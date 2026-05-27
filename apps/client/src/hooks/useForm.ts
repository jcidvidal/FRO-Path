import { useState, useCallback, useRef } from 'react';
import type { ValidationRule } from '../services/validators';

export interface UseFormOptions<T extends Record<string, string>> {
    initialValues: T;
    validators?: Record<string, ValidationRule[]>;
    onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
    values: T;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setFieldError: (field: string, error: string) => void;
    resetForm: () => void;
}

export function useForm<T extends Record<string, string>>(
    options: UseFormOptions<T>,
): UseFormReturn<T> {
    const { initialValues, validators, onSubmit } = options;

    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const valuesRef = useRef(values);
    valuesRef.current = values;

    const validateField = useCallback(
        (field: string, value: string): string | undefined => {
            if (!validators?.[field]) return undefined;

            for (const rule of validators[field]) {
                const result = rule(value, valuesRef.current);
                if (result !== true) {
                    return result;
                }
            }

            return undefined;
        },
        [validators],
    );

    const validateAllFields = useCallback((): boolean => {
        if (!validators) return true;

        let isValid = true;
        const newErrors: Record<string, string> = {};

        for (const field of Object.keys(validators)) {
            const error = validateField(field, valuesRef.current[field as keyof T] as string);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [validators, validateField]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setValues((prev) => ({ ...prev, [name]: value }));

            if (touched[name]) {
                const error = validateField(name, value);
                setErrors((prev) => {
                    const next = { ...prev };
                    if (error) {
                        next[name] = error;
                    } else {
                        delete next[name];
                    }
                    return next;
                });
            }
        },
        [touched, validateField],
    );

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;

            setTouched((prev) => ({ ...prev, [name]: true }));

            const error = validateField(name, value);
            setErrors((prev) => {
                const next = { ...prev };
                if (error) {
                    next[name] = error;
                } else {
                    delete next[name];
                }
                return next;
            });
        },
        [validateField],
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const allTouched: Record<string, boolean> = {};
            for (const key of Object.keys(valuesRef.current)) {
                allTouched[key] = true;
            }
            setTouched(allTouched);

            const isValid = validateAllFields();
            if (!isValid) return;

            setIsSubmitting(true);
            try {
                await onSubmit(valuesRef.current);
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateAllFields, onSubmit],
    );

    const setFieldError = useCallback((field: string, error: string) => {
        setErrors((prev) => ({ ...prev, [field]: error }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldError,
        resetForm,
    };
}