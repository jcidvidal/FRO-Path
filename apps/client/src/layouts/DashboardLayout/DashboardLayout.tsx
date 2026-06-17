import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppHeader } from '../../components/ui/AppHeader/AppHeader';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    sidebar: (onClose: () => void) => ReactNode;
    children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.layout}>
            {sidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                {sidebar(() => setSidebarOpen(false))}
            </aside>

            <div className={styles.mainArea}>
                <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}