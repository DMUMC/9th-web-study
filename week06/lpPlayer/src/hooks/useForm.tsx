import { useEffect, useState } from "react"

interface useFormProps<T> {
    initialValues: T;
    validate: (values: T) => Record<keyof T, string>;
}

export function useForm<T>({ initialValues, validate }: useFormProps<T>) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<Record<string, string>>()
    const [touched, setTouched] = useState<Record<string, boolean>>()

    const handleChange = (name: keyof T, text: string) => {
        setValues({ ...values, [name]: text })
    }

    const handleBlur = (name: keyof T) => {
        setTouched({ ...touched, [name]: true })
    }

    const getInputProps = (name: keyof T) => {
        const value = values[name]

        const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            handleChange(name, e.target.value)
        }

        const onBlur = () => {handleBlur(name)}

        return {
            value,
            onChange,
            onBlur
        }
    }

    useEffect(() => {
        const errors = validate(values)
        setErrors(errors)
    },[validate, values])

    return {
        values,
        errors,
        touched,
        getInputProps
    }
}