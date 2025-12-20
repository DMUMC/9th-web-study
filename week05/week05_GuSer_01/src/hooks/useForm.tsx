import type React from "react";
import { useEffect, useState } from "react";

interface useFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<keyof T, string>;
}

export function useForm<T>({ initialValues, validate }: useFormProps<T>) {
  // 초기값 방어
  const [values, setValues] = useState<T>(initialValues ?? ({} as T));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({ ...(prev ?? ({} as T)), [name]: text }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...(prev ?? {}), [name]: true }));
  };

  const getInputProps = (name: keyof T) => {
    const value = (values as any)?.[name] ?? "";

    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => {
      handleBlur(name);
    };

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const nextErrors = validate(values);
    setErrors(nextErrors as Record<string, string>);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}
