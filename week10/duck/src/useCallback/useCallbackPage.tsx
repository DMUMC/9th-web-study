import { useState, useCallback } from "react";
import CountButton from "../components/CountButton";

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleIncreaseWithoutCallback = () => {
    setCount((prev) => prev + 1);
  };

  const handleIncreaseWithCallback = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold mb-4">
        같이 배우는 리액트 useCallback편
      </h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-2">count: {count}</h2>
        <h2 className="text-2xl mb-4">text: {text}</h2>

        <div className="flex flex-col gap-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">
              ❌ useCallback 미사용
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              text를 입력할 때마다 버튼이 리렌더링됩니다 (콘솔 확인)
            </p>
            <CountButton
              onClick={handleIncreaseWithoutCallback}
              label="증가 (useCallback 없음)"
            />
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">✅ useCallback 사용</h3>
            <p className="text-sm text-gray-600 mb-2">
              text를 입력해도 버튼이 리렌더링되지 않습니다 (콘솔 확인)
            </p>
            <CountButton
              onClick={handleIncreaseWithCallback}
              label="증가 (useCallback 사용)"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">텍스트 입력</h3>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="텍스트를 입력하세요..."
              className="px-4 py-2 border rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              텍스트를 입력하면 위의 버튼들이 어떻게 동작하는지 콘솔을
              확인하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
