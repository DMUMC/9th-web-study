import { useCallback, useEffect, useRef } from 'react';

/**
 * 콜백 함수 스로틀링 useThrottle 훅
 * @param callback - 스로틀링할 콜백 함수
 * @param interval - 스로틀링 간격 (밀리초)
 * @returns 스로틀링된 콜백 함수
 */
function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    interval: number
): T {
    const lastExecuted = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef(callback);

    // callback이 변경될 때마다 ref 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecuted.current;

            // 이전 실행으로부터 interval 시간이 지났다면 즉시 실행
            if (timeSinceLastExecution >= interval) {
                lastExecuted.current = now;
                callbackRef.current(...args);
            } else {
                // 기존 타이머가 있다면 정리
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }

                // 남은 시간만큼 지연 후 실행
                const remainingTime = interval - timeSinceLastExecution;
                timerRef.current = setTimeout(() => {
                    lastExecuted.current = Date.now();
                    callbackRef.current(...args);
                    timerRef.current = null;
                }, remainingTime);
            }
        },
        [interval]
    ) as T;

    // 언마운트 또는 interval 변경 시 타이머 정리
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [interval]);

    return throttledCallback;
}

export default useThrottle;

