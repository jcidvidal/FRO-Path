import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
    readonly children: ReactNode;
    readonly glow?: 'green' | 'cyan';
}

export function AuthLayout({ children, glow = 'green' }: AuthLayoutProps) {
    return (
        <div className={styles.layout}>
            <div
                className={`${styles.glow} ${glow === 'cyan' ? styles.glowCyan : styles.glowGreen}`}
                aria-hidden="true"
            />
            <main className={styles.content}>{children}</main>
        </div>
    );
}
