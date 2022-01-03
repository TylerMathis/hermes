import { useEffect, useState } from 'react';
import CHANNELS from '../utils/channels';
import eventHandler from '../utils/eventHandler';
import { Response } from '../utils/Types';

type ResultsType = {
  [id: string]: Response;
};

const useResults = () => {
  const [results, setResults] = useState<ResultsType>({});

  useEffect(() => {
    const resetResults = () => {
      setResults({});
    };

    const dataRecieved = (dataIds: Array<string>) => {
      setResults(
        dataIds.reduce((curRes, id) => {
          return {
            ...curRes,
            [id]: {
              verdict: 'UNKNOWN',
              messages: [],
            },
          };
        }, {})
      );
    };

    const caseJudged = (newResults: ResultsType) => {
      setResults(newResults);
    };

    const removers: Array<() => void> = [];
    removers.push(eventHandler.on(CHANNELS.BEGIN_EVALUATION, resetResults));
    removers.push(eventHandler.on(CHANNELS.DONE_COLLECT_DATA, dataRecieved));
    removers.push(eventHandler.on(CHANNELS.CASE_JUDGED, caseJudged));

    return () => {
      removers.forEach((remover) => remover());
    };
  }, []);

  return results;
};

export default useResults;
