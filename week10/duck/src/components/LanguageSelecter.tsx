interface LanguageSelecterProps {
  value: string;
  onChange: (value: string) => void;
  options: LanguageOption[];
  className?: string;
}

interface LanguageOption {
  value: string;
  label: string;
}

const LanguageSelecter = ({
  value,
  onChange,
  options,
  className,
}: LanguageSelecterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border-2 border-gray-300 bg-white py-2.5 px-4 text-sm text-gray-700 shadow-sm transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 cursor-pointer ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelecter;
