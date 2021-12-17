import { exec } from 'child_process';
import {
  getCachePath,
  getFileNameFromPath,
  langSpecific,
  LangType,
  trimExtension,
} from '../utils';

// Compile source, and return path to binary
const compile = async (sourcePath: string, lang: LangType) => {
  const sourceName = trimExtension(getFileNameFromPath(sourcePath));

  const command = langSpecific(lang, {
    cpp: `g++ ${sourcePath} -O2 -o ${getCachePath(sourceName)}`,
    c: `gcc ${sourcePath} -O2 -o ${getCachePath(sourceName)}`,
    java: `javac ${sourcePath} -d ${getCachePath()}`,
    py: `cp ${sourcePath} ${getCachePath()}`,
  }) as string;

  return new Promise<string>((resolve, reject) => {
    exec(command, (err) => {
      if (err) reject(err);
      resolve(getCachePath(sourceName));
    });
  });
};

export default compile;
