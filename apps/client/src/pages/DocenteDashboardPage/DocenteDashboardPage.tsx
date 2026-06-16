import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import styles from './DocenteDashboardPage.module.css';

export function DocenteDashboardPage() {
    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.container}>
                <h2 className={styles.titulo}>Vista Docente</h2>
                <p className={styles.descripcion}>
                    La visualización de mallas de estudiantes estará disponible próximamente.
                </p>
            </div>
        </DashboardLayout>
    );
}
