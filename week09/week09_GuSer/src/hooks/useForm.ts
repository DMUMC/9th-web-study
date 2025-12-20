import { useState, useCallback } from 'react';

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setError: (name: keyof T, error: string) => void;
  clearError: (name: keyof T) => void;
  handleBlur: (name: keyof T) => void;
  handleChange: <K extends keyof T>(name: K, value: T[K]) => void;
  getInputProps: <K extends keyof T>(name: K) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error: string | undefined;
  };
  reset: () => void;
  validate: () => boolean;
}

export default function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name as string]: error }));
  }, []);

  const clearError = useCallback((name: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name as string]) {
        setError(name, validationErrors[name as string]);
      } else {
        clearError(name);
      }
    }
  }, [values, validate, setError, clearError]);

  const handleChange = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValue(name, value);
  }, [setValue]);

  const getInputProps = useCallback(<K extends keyof T>(name: K) => {
    return {
      value: (values[name] ?? '') as T[K],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleChange(name, e.target.value as T[K]);
      },
      onBlur: () => handleBlur(name),
      error: (touched[name as string] ? errors[name as string] : undefined),
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );
    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    clearError,
    handleBlur,
    handleChange,
    getInputProps,
    reset,
    validate: validateForm,
  };
}

