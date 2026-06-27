import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { ReadOnlyMeshView } from '../../components/shared/ReadOnlyMeshView/ReadOnlyMeshView';
import { StudentProgressView } from '../../components/shared/StudentProgressView/StudentProgressView';
import styles from './DirectorDashboardPage.module.css';

export function DirectorDashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get('view') || 'mallas';

    useEffect(() => {
        if (!searchParams.get('view')) {
            setSearchParams({ view: 'mallas' }, { replace: true });
        }
    }, []);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (<AppSidebar onCloseSidebar={onCloseSidebar} />)}>
            <div className={styles.content}>
                {view === 'mallas' ? (
                    <ReadOnlyMeshView />
                ) : (
                    <StudentProgressView />
                )}
            </div>
        </DashboardLayout>
    );
}
