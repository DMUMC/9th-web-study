import { useEffect, useState } from 'react';

/**
 * 값 지연형 useDebounce 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 타이머 설정
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 언마운트 또는 의존성 변경 시 타이머 정리
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // value와 delay 변경 시 즉시 반영

    return debouncedValue;
}

export default useDebounce;

