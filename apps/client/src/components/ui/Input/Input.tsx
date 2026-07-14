import { useId } from 'react';
import styles from './Input.module.css';

export interface Option {
    readonly value: string;
    readonly label: string;
}

export interface InputProps {
    readonly label?: string;
    readonly name: string;
    readonly type?: 'text' | 'email' | 'password' | 'tel';

    readonly as?: 'input' | 'select';
    readonly value: string;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readonly onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readonly error?: string;
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly required?: boolean;
    readonly autoComplete?: string;

    readonly variant?: 'green' | 'cyan';

    readonly options?: Option[];
}

export function Input({
    label,
    name,
    type = 'text',
    as = 'input',
    value,
    onChange,
    onBlur,
    error,
    placeholder,
    disabled = false,
    required = false,
    autoComplete,
    variant = 'green',
    options = [],
}: InputProps) {
    const generatedId = useId();
    const inputId = `input-${name}-${generatedId}`;
    const errorId = `error-${name}-${generatedId}`;

    const isCyan = variant === 'cyan';

    const inputClass = [
        styles.input,
        error ? styles.inputError : '',
        isCyan ? styles.inputCyan : '',
    ]
        .filter(Boolean)
        .join(' ');

    const labelClass = [styles.label, isCyan ? styles.labelCyan : styles.labelGreen]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={inputId} className={labelClass}>
                    {label}
                    {required && <span aria-hidden="true"> *</span>}
                </label>
            )}

            {as === 'select' ? (
                <select
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={`${inputClass} ${styles.select}`}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    aria-required={required ? 'true' : undefined}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={inputClass}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    aria-required={required ? 'true' : undefined}
                />
            )}

            {error && (
                <p id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
