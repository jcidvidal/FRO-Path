import styles from './Button.module.css';

export interface ButtonProps {
    readonly children: React.ReactNode;
    readonly type?: 'button' | 'submit' | 'reset';
    readonly variant?: 'green' | 'cyan';
    readonly loading?: boolean;
    readonly disabled?: boolean;
    readonly fullWidth?: boolean;
    readonly onClick?: () => void;
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