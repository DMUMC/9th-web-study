import { useEffect, useState } from "react";

/**
 * Debounce 훅: 입력값이 변경된 후 일정 시간(delay)이 지난 후에만 값을 업데이트합니다.
 *
 * 사용 예시:
 * - 검색어 입력 시: 사용자가 타이핑을 멈춘 후 일정 시간 후에만 API 요청 발생
 * - Network 탭에서 확인: 입력 직후 바로 요청이 발생하지 않고, delay 시간 후에 요청 발생
 *
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 500ms)
 * @returns debounced된 값
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 입력값이 변경되면 타이머를 설정
    // 이전 타이머가 있으면 취소하고 새로운 타이머 시작
    const timer = setTimeout(() => {
      // delay 시간이 지난 후에만 debouncedValue 업데이트
      // 이 시점에 API 요청이 발생하게 됨
      setDebouncedValue(value);
    }, delay);

    // cleanup: 컴포넌트 언마운트 또는 value/delay 변경 시 이전 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
