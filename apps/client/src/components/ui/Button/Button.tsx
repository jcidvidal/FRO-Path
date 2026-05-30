import styles from './Button.module.css';

export interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'green' | 'cyan';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
}

export function Button({
    children,
    type = 'button',
    variant = 'green',
    loading = false,
    disabled = false,
    fullWidth = true,
    onClick,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const classNames = [
        styles.button,
        fullWidth ? styles.fullWidth : '',
        variant === 'cyan' ? styles.cyan : styles.green,
        loading ? styles.loading : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={isDisabled}
            onClick={onClick}
            aria-busy={loading ? 'true' : undefined}
        >
            {loading && <span className={styles.spinner} aria-hidden="true" />}
            {loading ? 'Cargando...' : children}
        </button>
    );
}