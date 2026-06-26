import { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { InputProps } from '../../ui/Input/Input';
import styles from './passwordInput.module.css';

export type PasswordInputProps = Omit<InputProps, 'type'>;

export function PasswordInput({
    autoComplete,
    variant = 'green',
    label,
    error,
    required,
    name,
    as: _as,
    options: _options,
    ...rest
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = `password-${name}-${generatedId}`;
    const errorId = `error-${name}-${generatedId}`;

    const isCyan = variant === 'cyan';

    const inputClass = [
        styles.input,
        error ? styles.inputError : '',
        isCyan ? styles.inputCyan : '',
    ]
        .filter(Boolean)
        .join(' ');

    const labelClass = [
        styles.label,
        isCyan ? styles.labelCyan : styles.labelGreen,
    ].join(' ');

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={inputId} className={labelClass}>
                    {label}
                    {required && <span aria-hidden="true"> *</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    id={inputId}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={rest.value}
                    onChange={rest.onChange}
                    onBlur={rest.onBlur}
                    placeholder={rest.placeholder}
                    disabled={rest.disabled}
                    required={required}
                    autoComplete={autoComplete ?? 'current-password'}
                    className={inputClass}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    aria-required={required ? 'true' : undefined}
                />

                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    tabIndex={0}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {error && (
                <p id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}