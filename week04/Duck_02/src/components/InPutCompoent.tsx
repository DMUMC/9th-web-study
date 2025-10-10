export default function InPutCompoent({
  type,
  placeholder,
  ...props
}: {
  type: string;
  placeholder: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...props}
      className="border border-[#ccc] w-[300px] p-2 focus:border-[#333] rounded-md"
    />
  );
}
