import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { DirectorMallasView } from './DirectorMallasView';
import { DirectorAvancesView } from './DirectorAvancesView';
import styles from './DirectorPage.module.css';

export function DirectorPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get('view') || 'mallas';
    const [selectedCareerId, setSelectedCareerId] = useState('ing-informatica');

    useEffect(() => {
        if (!searchParams.get('view')) {
            setSearchParams({ view: 'mallas' }, { replace: true });
        }
    }, []);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.content}>
                {view === 'mallas' ? (
                    <DirectorMallasView
                        selectedCareerId={selectedCareerId}
                        onCareerChange={setSelectedCareerId}
                    />
                ) : (
                    <DirectorAvancesView />
                )}
            </div>
        </DashboardLayout>
    );
}