import { useCallback, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type Validator<TValues> = (
  value: TValues[keyof TValues],
  values: TValues,
) => string | null | undefined;

type UseFormOptions<TValues extends Record<string, unknown>> = {
  initialValues: TValues;
  validators?: Partial<Record<keyof TValues, Validator<TValues>>>;
  onSubmit?: (values: TValues) => void;
};

type RegisteredField<
  TValues extends Record<string, unknown>,
  TField extends keyof TValues,
> = {
  name: string;
  value: TValues[TField];
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onBlur: () => void;
};

type UseFormReturn<TValues extends Record<string, unknown>> = {
  values: TValues;
  errors: Record<keyof TValues, string>;
  touched: Record<keyof TValues, boolean>;
  isValid: boolean;
  register: <TField extends keyof TValues>(
    field: TField,
  ) => RegisteredField<TValues, TField>;
  setFieldValue: (field: keyof TValues, value: TValues[keyof TValues]) => void;
  reset: () => void;
  handleSubmit: (
    callback?: (values: TValues) => void,
  ) => (event: FormEvent<HTMLFormElement>) => void;
};

function createRecord<TValues extends Record<string, unknown>, TValue>(
  values: TValues,
  fill: TValue,
): Record<keyof TValues, TValue> {
  return (Object.keys(values) as Array<keyof TValues>).reduce(
    (acc, key) => {
      acc[key] = fill;
      return acc;
    },
    {} as Record<keyof TValues, TValue>,
  );
}

export function useForm<TValues extends Record<string, unknown>>({
  initialValues,
  validators,
  onSubmit,
}: UseFormOptions<TValues>): UseFormReturn<TValues> {
  const initialValuesRef = useRef(initialValues);

  const [values, setValues] = useState<TValues>(initialValues);
  const [touched, setTouched] = useState<Record<keyof TValues, boolean>>(() =>
    createRecord(initialValues, false),
  );
  const [errors, setErrors] = useState<Record<keyof TValues, string>>(() =>
    createRecord(initialValues, ""),
  );

  const runValidator = useCallback(
    (
      field: keyof TValues,
      value: TValues[keyof TValues],
      nextValues: TValues,
    ) => {
      const validator = validators?.[field];
      if (!validator) {
        return "";
      }
      return validator(value, nextValues) ?? "";
    },
    [validators],
  );

  const validateAll = useCallback(
    (formValues: TValues) => {
      const validation = createRecord(formValues, "");

      if (!validators) {
        return validation;
      }

      (Object.keys(validators) as Array<keyof TValues>).forEach((field) => {
        const validator = validators[field];
        if (!validator) {
          return;
        }
        validation[field] = validator(formValues[field], formValues) ?? "";
      });

      return validation;
    },
    [validators],
  );

  const handleFieldChange =
    (field: keyof TValues) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { value } = event.target;

      setValues((prev) => {
        const nextValues = { ...prev, [field]: value } as TValues;
        const message = runValidator(field, nextValues[field], nextValues);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: message,
        }));

        return nextValues;
      });
    };

  const handleFieldBlur = (field: keyof TValues) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: runValidator(field, values[field], values),
    }));
  };

  const register = <TField extends keyof TValues>(
    field: TField,
  ): RegisteredField<TValues, TField> => ({
    name: String(field),
    value: values[field],
    onChange: handleFieldChange(field),
    onBlur: handleFieldBlur(field),
  });

  const handleSubmit =
    (callback?: (submittedValues: TValues) => void) =>
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validation = validateAll(values);
      setErrors(validation);
      setTouched(createRecord(values, true));

      const hasError = Object.values(validation).some(Boolean);
      if (!hasError) {
        (callback ?? onSubmit)?.(values);
      }
    };

  const setFieldValue = useCallback(
    (field: keyof TValues, value: TValues[keyof TValues]) => {
      setValues((prev) => {
        const nextValues = { ...prev, [field]: value } as TValues;
        const message = runValidator(field, nextValues[field], nextValues);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: message,
        }));

        return nextValues;
      });
    },
    [runValidator],
  );

  const reset = useCallback(() => {
    const baseValues = { ...initialValuesRef.current } as TValues;
    setValues(baseValues);
    setErrors(createRecord(baseValues, ""));
    setTouched(createRecord(baseValues, false));
  }, []);

  const isValid = useMemo(() => {
    const validation = validateAll(values);
    return Object.values(validation).every((message) => !message);
  }, [validateAll, values]);

  return {
    values,
    errors,
    touched,
    isValid,
    register,
    setFieldValue,
    reset,
    handleSubmit,
  };
}
