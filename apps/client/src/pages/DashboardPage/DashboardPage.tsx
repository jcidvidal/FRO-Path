import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshContainer } from '../../components/mesh/MeshContainer';
import { apiClient } from '../../services/apiClient';

const ID_CARRERA = 'icc';

export function DashboardPage() {
    const [resetKey, setResetKey] = useState(0);

    async function handleResetMalla() {
        try {
            await apiClient.delete(`/mesh/${ID_CARRERA}/progreso`);
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
