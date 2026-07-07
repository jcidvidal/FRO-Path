import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import styles from './AdminDashboardPage.module.css';

export function AdminDashboardPage() {
    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.container}>
                <h2 className={styles.titulo}>Vista Administrador</h2>
                <p className={styles.descripcion}>
                    La gestión de usuarios, mallas y estadísticas estará disponible próximamente.
                </p>
            </div>
        </DashboardLayout>
    );
}
