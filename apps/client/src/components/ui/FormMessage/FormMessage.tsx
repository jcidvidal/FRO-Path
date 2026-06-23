import { ErrorIcon, SuccessIcon, InfoIcon } from '../../icons/Icons';
import styles from './FormMessage.module.css';

export interface FormMessageProps {
    type: 'error' | 'success' | 'info';
    message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
    return (
        <div className={`${styles.message} ${styles[type]}`} role="alert">
            <span className={styles.iconWrapper} aria-hidden="true">
                {type === 'error' && <ErrorIcon />}
                {type === 'success' && <SuccessIcon />}
                {type === 'info' && <InfoIcon />}
            </span>
            {message}
        </div>
    );
}