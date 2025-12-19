import { memo } from "react";

interface ICountButtonProps {
  onClick: () => void;
  label: string;
}

const CountButton = memo(({ onClick, label }: ICountButtonProps) => {
  console.log(`${label} 버튼이 렌더링되었습니다.`);
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </button>
  );
});

CountButton.displayName = "CountButton";

export default CountButton;
