interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Input = ({
  value,
  onChange,
  placeholder = "검색어 입력",
  className,
}: InputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border-2 border-gray-300 bg-white p-3 text-sm text-gray-700 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none ${className}`}
    />
  );
};

export default Input;
