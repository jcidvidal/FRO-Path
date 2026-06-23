import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import styles from './DirectorDashboardPage.module.css';

export function DirectorDashboardPage() {
    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.container}>
                <h2 className={styles.titulo}>Vista Director</h2>
                <p className={styles.descripcion}>
                    La visualización de mallas y avances curriculares estará disponible próximamente.
                </p>
            </div>
        </DashboardLayout>
    );
}
