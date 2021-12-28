import { message } from 'antd';
import { useEffect, useState } from 'react';
import CHANNELS from '../utils/channels';
import eventHandler from '../utils/eventHandler';

const usePrepStatus = (steps: Array<string>, onError: () => void) => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    const notifyError = (content: string) => {
      setError(true);
      message.error({
        content,
        style: {
          marginTop: '85vh',
        },
      });
      onError();
    };

    const cancelError = () => {
      setError(false);
    };
    const notifyMissingInfo = () => {
      notifyError('Select source and data');
    };
    const notifyInvalidData = () => {
      notifyError('Invalid data format');
    };
    const notifyCompilationError = () => {
      notifyError('Compilation error');
    };

    const prog = 100 / steps.length;
    const events = steps.reduce((curEvents, step, index) => {
      return {
        [step]: () => {
          setProgress((index + 1) * prog);
        },
        ...curEvents,
      };
    }, {});

    const removers: Array<() => void> = [];
    removers.push(eventHandler.on(CHANNELS.BEGIN_COLLECT_DATA, cancelError));

    Object.entries(events).forEach(([event, registerEvent]) => {
      removers.push(eventHandler.on(event, registerEvent));
    });

    removers.push(eventHandler.on(CHANNELS.MISSING_INFO, notifyMissingInfo));
    removers.push(eventHandler.on(CHANNELS.INVALID_DATA, notifyInvalidData));
    removers.push(
      eventHandler.on(CHANNELS.COMPILATION_ERROR, notifyCompilationError)
    );

    return () => {
      removers.forEach((remover) => remover());
    };
  }, [onError, steps]);

  return [progress, error];
};

export default usePrepStatus;