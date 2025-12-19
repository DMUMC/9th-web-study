import { useState, useMemo } from "react";

// 배열 필터링 및 정렬 예시
const filterAndSortNumbers = (numbers: number[], filterValue: number) => {
  console.log("배열 필터링 및 정렬 중...");
  return numbers.filter((num) => num > filterValue).sort((a, b) => a - b);
};

// 복잡한 계산 예시: 소수 찾기
const findPrimes = (max: number): number[] => {
  console.log(`${max}까지의 소수 찾는 중...`);
  const primes: number[] = [];
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
};

export default function UseMemoPage() {
  const [count, setCount] = useState<number>(0);

  const [filterValue, setFilterValue] = useState<number>(50);
  const [maxPrime, setMaxPrime] = useState<number>(200);
  const [text, setText] = useState<string>("");

  // 배열 생성 (크기 줄임 - 메모리 효율적)
  const numberArray = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => i + 1);
  }, []);

  // ❌ useMemo를 사용하지 않은 배열 필터링
  // count나 text가 변경될 때마다 매번 필터링 및 정렬이 실행됨
  const filteredArrayWithoutMemo = filterAndSortNumbers(
    numberArray,
    filterValue
  );

  // ✅ useMemo를 사용한 배열 필터링
  // numberArray나 filterValue가 변경될 때만 필터링 및 정렬이 실행됨
  const filteredArrayWithMemo = useMemo(() => {
    return filterAndSortNumbers(numberArray, filterValue);
  }, [numberArray, filterValue]);

  // ❌ useMemo를 사용하지 않은 소수 찾기
  // count나 text가 변경될 때마다 매번 소수를 찾음
  const primesWithoutMemo = findPrimes(maxPrime);

  // ✅ useMemo를 사용한 소수 찾기
  // maxPrime이 변경될 때만 소수를 찾음
  const primesWithMemo = useMemo(() => {
    return findPrimes(maxPrime);
  }, [maxPrime]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">같이 배우는 리액트 useMemo편</h1>

      <div className="w-full max-w-4xl space-y-6">
        {/* 카운터 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">카운터: {count}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              증가
            </button>
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              감소
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            카운터를 변경하면 콘솔을 확인하세요
          </p>
        </div>

        {/* 배열 필터링 예시 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            배열 필터링 및 정렬 예시
          </h2>
          <div className="mb-4">
            <label className="block mb-2">
              필터 값 (이 값보다 큰 숫자만 표시): {filterValue}
            </label>
            <input
              type="range"
              min="0"
              max="150"
              value={filterValue}
              onChange={(e) => setFilterValue(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">❌ useMemo 미사용</h3>
              <p className="text-sm text-gray-700 mb-2">
                필터링된 배열 개수: {filteredArrayWithoutMemo.length}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                처음 10개: {filteredArrayWithoutMemo.slice(0, 10).join(", ")}...
              </p>
              <p className="text-xs text-gray-600">
                카운터나 텍스트를 변경해도 매번 필터링이 실행됩니다 (콘솔 확인)
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">✅ useMemo 사용</h3>
              <p className="text-sm text-gray-700 mb-2">
                필터링된 배열 개수: {filteredArrayWithMemo.length}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                처음 10개: {filteredArrayWithMemo.slice(0, 10).join(", ")}...
              </p>
              <p className="text-xs text-gray-600">
                filterValue가 변경될 때만 필터링이 실행됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 소수 찾기 예시 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">소수 찾기 예시</h2>
          <div className="mb-4">
            <label className="block mb-2">최대값: {maxPrime}</label>
            <input
              type="range"
              min="100"
              max="300"
              value={maxPrime}
              onChange={(e) => setMaxPrime(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">❌ useMemo 미사용</h3>
              <p className="text-sm text-gray-700 mb-2">
                소수 개수: {primesWithoutMemo.length}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                처음 10개: {primesWithoutMemo.slice(0, 10).join(", ")}...
              </p>
              <p className="text-xs text-gray-600">
                카운터나 텍스트를 변경해도 매번 소수를 찾습니다 (콘솔 확인)
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">✅ useMemo 사용</h3>
              <p className="text-sm text-gray-700 mb-2">
                소수 개수: {primesWithMemo.length}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                처음 10개: {primesWithMemo.slice(0, 10).join(", ")}...
              </p>
              <p className="text-xs text-gray-600">
                maxPrime이 변경될 때만 소수를 찾습니다
              </p>
            </div>
          </div>
        </div>

        {/* 텍스트 입력 (다른 상태 변경 예시) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            텍스트 입력 (다른 상태 변경)
          </h3>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="텍스트를 입력하세요..."
            className="px-4 py-2 border rounded w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            텍스트를 입력하면 useMemo를 사용하지 않은 계산들이 다시 실행됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
