import { useId } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ label, name, checked, onChange }: CheckboxProps) {
    const generatedId = useId();
    const checkboxId = `checkbox-${name}-${generatedId}`;

    return (
        <label htmlFor={checkboxId} className={styles.label}>
            <input
                id={checkboxId}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.hiddenCheckbox}
                aria-checked={checked}
            />

            <span
                className={`${styles.visualCheckbox} ${checked ? styles.visualCheckboxChecked : ''}`}
                aria-hidden="true"
            >
                <svg
                    className={`${styles.checkIcon} ${checked ? styles.checkIconVisible : ''}`}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>

            <span className={styles.labelText}>{label}</span>
        </label>
    );
}
