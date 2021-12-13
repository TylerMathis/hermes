/* eslint global-require: off, no-console: off, promise/always-return: off */

import { exec } from 'child_process';
import { dialog } from 'electron';
import Store from 'electron-store';
import {
  getFileNameFromPath,
  findByExtension,
  getExtension,
  getLang,
  trimExtension,
} from '../utils';
import CHANNELS from '../channels';
import compile from './compile';
import run from './run';

// Store for the main thread. Get rid of old data
const store = new Store();
store.clear();

// Open file dialog and save selections by key.
export const selectFile = async (
  event: Electron.IpcMainEvent,
  key: string,
  isDir: boolean
) => {
  dialog
    .showOpenDialog({
      properties: [isDir ? 'openDirectory' : 'openFile'],
    })
    .then((file) => {
      if (file.filePaths.length > 0) {
        const filePath = file.filePaths[0];
        store.set(key, filePath);
        event.reply(CHANNELS.FILE_SELECTED, key, getFileNameFromPath(filePath));
      }
    })
    .catch((err) => console.error(err));
};

type VerdictType = 'AC' | 'PE' | 'WA' | 'TLE' | 'RTE' | 'INTERNAL_ERROR';
const check = (input: string, userOut: string, judgeOut: string) => {
  return new Promise<VerdictType>((resolve) => {
    exec(`python3 -m apollo ${input} ${userOut} ${judgeOut}`, (err, stdout) => {
      if (err) resolve('INTERNAL_ERROR');
      stdout.replace('\\r', '');
      const res = stdout.split('\n')[0].split(':')[0] as VerdictType;
      resolve(res);
    });
  });
};

export const judge = async (event: Electron.IpcMainEvent) => {
  const source = store.get('source', null) as string;
  const data = store.get('data', null) as string;

  // TODO: warn user
  if (source == null || data == null) {
    return;
  }

  // Get inputs and outputs from data dir
  const inputs = (await findByExtension(data, 'in')).map((path) => {
    return trimExtension(path);
  });
  const outputs = (await findByExtension(data, 'out')).map((path) => {
    return trimExtension(path);
  });

  const allCasesValid = inputs.every((path) => {
    return outputs.includes(path);
  });

  if (!allCasesValid) {
    event.reply(CHANNELS.INVALID_JUDGE_DATA);
    return;
  }

  // Begin judging
  event.reply(CHANNELS.FOUND_CASES);

  const ext = getExtension(source);
  const lang = getLang(ext);

  // TODO: Get from UI
  const TIME_LIMIT = 1000;

  // Compile the code
  const compiledPath = await compile(source, lang);

  inputs.forEach(async (input, index) => {
    const inputId = getFileNameFromPath(input);
    const inputPath = input.concat('.in');
    const judgeOutputPath = input.concat('.out');
    const userOutputPath = `tmp/${inputId}.userOut`;

    const runTime = await run(
      compiledPath,
      lang,
      inputPath,
      userOutputPath,
      TIME_LIMIT * 2
    );

    let verdict: VerdictType;
    if (runTime === -1) verdict = 'RTE';
    else if (runTime > TIME_LIMIT) verdict = 'TLE';
    else verdict = await check(inputPath, userOutputPath, judgeOutputPath);

    console.log({
      Case: inputId,
      index,
      Runtime: runTime,
      Verdict: verdict,
    });
  });

  event.reply(CHANNELS.DONE_JUDGING);
};