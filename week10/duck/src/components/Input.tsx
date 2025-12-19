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
      className={`w-full rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-3 text-sm text-gray-800 shadow-lg transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white ${className}`}
    />
  );
};

export default Input;
