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
            className={`w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelecter;
