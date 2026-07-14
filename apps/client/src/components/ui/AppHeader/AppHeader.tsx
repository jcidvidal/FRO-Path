import { useAuth } from '../../../services/AuthContext';
import bandurrEstudiante from '../../../assets/imagenes/Bandurrias/logobanduestudiante.png';
import bandurrDocente from '../../../assets/imagenes/Bandurrias/logobandudocente.png';
import bandurrTrabajador from '../../../assets/imagenes/Bandurrias/logobandutrabajador.png';
import styles from './AppHeader.module.css';

const bandurrImages: Record<string, string> = {
    estudiante: bandurrEstudiante,
    docente: bandurrDocente,
    director: bandurrTrabajador,
    admin: bandurrTrabajador,
};

interface AppHeaderProps {
    readonly onToggleSidebar: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button
                    className={styles.hamburger}
                    onClick={onToggleSidebar}
                    aria-label="Abrir menu"
                >
                    <span /><span /><span />
                </button>
                <h1 className={styles.title}>MALLA INTERACTIVA</h1>
            </div>
            <div className={styles.userInfo}>
                {user?.role && (
                    <img
                        src={bandurrImages[user.role]}
                        alt="Bandurr"
                        className={styles.avatar}
                    />
                )}
                <div className={styles.userData}>
                    <span className={styles.userName}>{user?.name}</span>
                </div>
            </div>
        </header>
    );
}