interface InputFieldProps {
    name: string;
    type: string;
    placeholder: string;
    register: any;
    errors: any;
}

const InputField = ({
    name,
    type,
    placeholder,
    register,
    errors,
}: InputFieldProps) => {
    return (
        <>
            <input
                {...register(name)}
                name={name}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                    ${
                        errors?.[name]
                            ? 'border-red-500 bg-red-200'
                            : 'border-gray-300'
                    }`}
                type={type}
                placeholder={placeholder}
            />
            {errors?.[name] && (
                <div className='text-red-500 text-sm'>
                    {errors?.[name].message}
                </div>
            )}
        </>
    );
};

export default InputField;
