import { useEffect, useState } from 'react';

/**
 * 값 지연형 useDebounce 훅
 * 입력 값이 변경된 후 일정 시간(delay)이 지나면 debouncedValue를 업데이트합니다.
 * 
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 300ms)
 * @returns debouncedValue - 지연된 값
 * 
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebounce(searchQuery, 300);
 */
function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 타이머 설정: delay 시간 후에 debouncedValue 업데이트
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 클린업 함수: 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // value 또는 delay가 변경되면 effect 재실행

    return debouncedValue;
}

export default useDebounce;

