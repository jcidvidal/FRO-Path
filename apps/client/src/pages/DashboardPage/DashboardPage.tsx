import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshContainer } from '../../components/mesh/MeshContainer';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../services/AuthContext';

const ID_CARRERA_POR_DEFECTO = 'ii';

export function DashboardPage() {
    const { user } = useAuth();
    const idCarrera = user?.idCarrera ?? ID_CARRERA_POR_DEFECTO;
    const [resetKey, setResetKey] = useState(0);

    async function handleResetMalla() {
        try {
            await apiClient.delete(`/mesh/${idCarrera}/progreso`);
        } finally {
            setResetKey((k) => k + 1);
        }
    }

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onResetMalla={() => { void handleResetMalla(); }} onCloseSidebar={onCloseSidebar} />
        )}>
            <MeshContainer key={resetKey} />
        </DashboardLayout>
    );
}
