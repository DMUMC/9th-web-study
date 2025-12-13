interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const Input = ({
    value,
    onChange,
    placeholder = '검색어 입력',
    className,
}: InputProps) => {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-md border-gray-700 bg-white p-2 text-sm text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
        />
    );
};

export default Input;
