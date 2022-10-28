import { useEffect } from 'react';

function useInterval(tick, pause, interval = 1000) {
  // 建立 interval
  useEffect(() => {
    let timeId;

    function _tick() {
      tick && tick();
    }

    if (!pause && tick) {
      // effect默认会在执行当前 effect 之前对上一个 effect 进行清除
      // 不要担心上一个setTimeout执行
      timeId = setInterval(_tick, interval);
    }

    return () => {
      timeId && clearInterval(timeId);
    };
  }, [tick, pause]);
}
export default useInterval;
