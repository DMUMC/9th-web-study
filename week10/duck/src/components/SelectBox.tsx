interface SelectBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
  className?: string;
}

const SelectBox = ({
  checked,
  onChange,
  label,
  id = "checkbox",
  className,
}: SelectBoxProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 rounded border-2 border-gray-300 bg-white text-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-offset-0 cursor-pointer transition-all"
      />
      <label
        htmlFor={id}
        className="ml-3 text-gray-700 font-medium cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default SelectBox;
