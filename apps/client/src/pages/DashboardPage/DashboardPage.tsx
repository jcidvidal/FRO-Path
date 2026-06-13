import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshContainer } from '../../components/mesh/MeshContainer';

export function DashboardPage() {
    const [resetKey, setResetKey] = useState(0);

    function handleResetMalla() {
        setResetKey((k) => k + 1);
    }

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onResetMalla={handleResetMalla} onCloseSidebar={onCloseSidebar} />
        )}>
            <MeshContainer key={resetKey} />
        </DashboardLayout>
    );
}