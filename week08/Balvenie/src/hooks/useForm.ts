import { useState, type ChangeEvent, useEffect } from "react";

interface UseFormProps<T> {
  initialValue: T;
  // validate는 선택적으로, 에러는 key → string 형태
  validate?: (values: T) => Record<string, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const handleBlur = (name: keyof T) => {
    const key = String(name);
    setTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    if (!validate) return;
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;