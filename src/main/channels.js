const CHANNELS = {
  SELECT_FILE: 'renderer-select-file',
  FILE_SELECTED: 'electron-file-selected',
  SET_TIME_LIMIT: 'renderer-set-time-limit',
  SET_ASYNCHRONY: 'renderer-set-asynchrony',

  JUDGE: 'renderer-judge',

  MISSING_INFO: 'electron-missing-info',
  BEGIN_COLLECT_DATA: 'electron-begin-collect-data',
  INVALID_DATA: 'electron-invalid-data',
  DONE_COLLECT_DATA: 'electron-done-collect-data',

  BEGIN_COMPILING: 'electron-begin-compiling',
  COMPILATION_ERROR: 'electron-compilation-error',
  DONE_COMPILING: 'electron-done-compiling',

  BEGIN_JUDGING: 'electron-begin-judging',
  CASE_JUDGED: 'electron-case-judged',
  DONE_JUDGING: 'electron-done-judging',
};

module.exports = CHANNELS;
