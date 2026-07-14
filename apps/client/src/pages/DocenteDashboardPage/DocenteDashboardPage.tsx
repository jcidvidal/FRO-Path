import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshGrid } from '../../components/mesh/MeshGrid';
import { useMesh } from '../../store/useMeshStore';
import { listarCarreras, type CarreraDto } from '../../services/carreraService';
import styles from './DocenteDashboardPage.module.css';

export function DocenteDashboardPage() {
    const [carreras, setCarreras] = useState<CarreraDto[]>([]);
    const [selectedCareerId, setSelectedCareerId] = useState('icc');

    useEffect(() => {
        listarCarreras()
            .then(setCarreras)
            .catch(() => setCarreras([]));
    }, []);

    const { semestres, modulosIngles, practicas, isLoading } = useMesh(selectedCareerId);

    const selectedCareer = carreras.find((c) => c.codigo_carrera === selectedCareerId);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <label htmlFor="career-select" className={styles.selectLabel}>
                        Seleccionar Carrera
                    </label>
                    <select
                        id="career-select"
                        className={styles.careerSelect}
                        value={selectedCareerId}
                        onChange={(e) => setSelectedCareerId(e.target.value)}
                    >
                        <option value="">-- Seleccione una carrera --</option>
                        {carreras.map((c) => (
                            <option key={c.id} value={c.codigo_carrera}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {!selectedCareerId || isLoading ? (
                    <p className={styles.placeholder}>
                        {isLoading ? 'Cargando malla...' : 'Seleccione una carrera para ver su malla'}
                    </p>
                ) : (
                    <>
                        <h3 className={styles.careerTitle}>{selectedCareer?.nombre}</h3>
                        <div className={styles.mainPanel}>
                            <div className={styles.meshArea}>
                                <MeshGrid
                                    semestres={semestres}
                                    modulosIngles={modulosIngles}
                                    practicas={practicas}
                                    readOnly
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}