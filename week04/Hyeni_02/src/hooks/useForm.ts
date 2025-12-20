import { useState } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends object>({ initialValues, validate }: UseFormProps<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValues = { ...values, [name]: value };
        setValues(newValues);
        setErrors(validate(newValues));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        setErrors(validate(values));
    };

    const getInputProps = (name: keyof T) => ({
        name: name as string,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
    });

    return {
        values,
        errors,
        touched,
        getInputProps,
    };
};