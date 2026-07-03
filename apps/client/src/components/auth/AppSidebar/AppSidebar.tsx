import { useAuth } from '../../../services/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../services/ThemeContext';
import { GridIcon, TrashIcon, ChartIcon, UsersIcon, SunIcon, MoonIcon } from '../../icons/Icons';
import styles from './AppSidebar.module.css';

interface NavItem {
    readonly label: string;
    readonly icon: React.ReactNode;
    readonly path: string;
}

interface AppSidebarProps {
    readonly onResetMalla?: () => void;
    readonly onCloseSidebar?: () => void;
}

const itemsPorRol: Record<string, NavItem[]> = {
    estudiante: [
        { label: 'Mi Malla', icon: <GridIcon className={styles.navIcon} />, path: '/dashboard' },
        { label: 'Limpiar Malla', icon: <TrashIcon className={styles.navIcon} />, path: '/dashboard/limpiar' },
    ],
    docente: [
        { label: 'Ver Mallas', icon: <GridIcon className={styles.navIcon} />, path: '/dashboard/docente' },
    ],
    director: [
        { label: 'Ver Mallas', icon: <GridIcon className={styles.navIcon} />, path: '/dashboard/director?view=mallas' },
        { label: 'Ver Avances', icon: <ChartIcon className={styles.navIcon} />, path: '/dashboard/director?view=avances' },
    ],
    admin: [
        { label: 'Usuarios', icon: <UsersIcon className={styles.navIcon} />, path: '/dashboard/admin?view=users' },
        { label: 'Ver Mallas', icon: <GridIcon className={styles.navIcon} />, path: '/dashboard/admin?view=mallas' },
        { label: 'Estudiantes', icon: <ChartIcon className={styles.navIcon} />, path: '/dashboard/admin?view=avances' },
    ],
};

export function AppSidebar({ onResetMalla, onCloseSidebar }: AppSidebarProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const items = itemsPorRol[user?.role ?? 'estudiante'] ?? [];

    return (
        <div className={styles.sidebar}>
            <div className={styles.top}>
                <div className={styles.menuHeader}>
                    <p className={styles.roleLabel}>Menú</p>
                    <button
                        className={styles.closeButton}
                        onClick={onCloseSidebar}
                        aria-label="Cerrar menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    {items.map((item) => (
                        <button
                            key={item.path}
                            className={`${styles.navItem} ${(location.pathname + location.search) === item.path ? styles.navItemActive : ''}`}
                            onClick={() => {
                                if (item.label === 'Limpiar Malla') {
                                    onResetMalla?.();
                                    navigate('/dashboard');
                                } else {
                                    navigate(item.path);
                                }
                            }}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className={styles.bottom}>
                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                >
                    {theme === 'dark' ? <SunIcon className={styles.themeIcon} /> : <MoonIcon className={styles.themeIcon} />}
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                </button>
                <button className={styles.logoutButton} onClick={logout}>
                    → Cerrar Sesion
                </button>
            </div>
        </div>
    );
}