import { useEffect, useState } from "react";

interface useFormProps<T> {
  initialValues: T; // emial : '' , password : ''
  // 값이 올바른지 검증하는 함수a
  validate: (values: T) => Record<keyof T, string>;
}

export default function useForm<T>({
  initialValues,
  validate,
}: useFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(); // Record : key 값은 문자열 value 값은 boolean
  const [errors, setErrors] = useState<Record<keyof T, string>>();

  //   사용자가 입력값을 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues({ ...values, [name]: text });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({ ...touched, [name]: true } as Record<keyof T, boolean>);
  };

  // values가 변경될 때 마다 에러 검증 로직이 실행됨
  useEffect(() => {
    const newErrors: Record<keyof T, string> = validate(values);
    setErrors(newErrors); // 오류 메시지 업뎃
  }, [values, validate]);

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => handleBlur(name);

    return {
      value,
      onChange,
      onBlur,
    };
  };

  return { values, touched, errors, getInputProps };
}
