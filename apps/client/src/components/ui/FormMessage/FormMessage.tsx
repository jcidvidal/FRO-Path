import styles from './FormMessage.module.css';

export interface FormMessageProps {
    type: 'error' | 'success' | 'info';
    message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
    return (
        <div className={`${styles.message} ${styles[type]}`} role="alert">
            <span className={styles.iconWrapper} aria-hidden="true">
                {type === 'error' && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 6L12 12M12 6L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                )}
                {type === 'success' && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 9L8 12L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                {type === 'info' && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 8V13M9 6V6.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                )}
            </span>
            {message}
        </div>
    );
}
