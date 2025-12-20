import { useState, useEffect } from 'react';

// 제네릭 타입 T를 사용하여 문자열뿐만 아니라 다양한 타입에 재사용 가능하게 함
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 시간이 지난 후 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: value가 변경되거나 컴포넌트가 언마운트되면 타이머 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // 의존성 배열에 value와 delay 포함

  return debouncedValue;
}

export default useDebounce;