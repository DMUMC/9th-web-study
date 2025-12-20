import { useState, useEffect, useRef } from 'react';

function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastExecuted.current;

    if (timeElapsed >= interval) {
      // 1. 이미 interval보다 많은 시간이 지났다면 즉시 업데이트
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 2. 아직 시간이 덜 지났다면, 남은 시간만큼 기다렸다가 업데이트 (trailing edge)
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - timeElapsed);

      // 3. 언마운트되거나 의존성(value)이 바뀌면 기존 타이머 정리
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;