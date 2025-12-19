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
      className={`w-full rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm py-2.5 px-4 text-gray-800 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 ${className}`}
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
