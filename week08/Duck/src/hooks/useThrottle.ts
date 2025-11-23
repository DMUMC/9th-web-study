import { useEffect, useRef, useState } from 'react';

/**
 * 값 제한형 useThrottle 훅
 * 입력 값이 변경되어도 일정 주기(interval)마다 한 번만 throttledValue를 업데이트합니다.
 * Leading edge 방식: 첫 번째 호출을 즉시 실행하고, 이후 interval 동안 추가 호출을 무시합니다.
 * 
 * @param value - 스로틀할 값
 * @param interval - 스로틀 간격 (밀리초, 기본값: 1000ms)
 * @returns throttledValue - 스로틀된 값
 * 
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledPosition = useThrottle(scrollPosition, 1000);
 */
function useThrottle<T>(value: T, interval: number = 1000): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecutedRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutedRef.current;

        // 클린업: 이전 타이머가 있으면 정리
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // interval 시간이 지났으면 즉시 업데이트 (leading edge)
        if (timeSinceLastExecution >= interval || lastExecutedRef.current === 0) {
            setThrottledValue(value);
            lastExecutedRef.current = now;
        } else {
            // interval 시간이 지나지 않았으면 남은 시간 후에 업데이트 (trailing edge)
            const remainingTime = interval - timeSinceLastExecution;
            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value);
                lastExecutedRef.current = Date.now();
                timeoutRef.current = null;
            }, remainingTime);
        }

        // 클린업 함수: 언마운트/의존성 변경 시 타이머 정리
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [value, interval]); // value 또는 interval이 변경되면 effect 재실행

    return throttledValue;
}

export default useThrottle;

