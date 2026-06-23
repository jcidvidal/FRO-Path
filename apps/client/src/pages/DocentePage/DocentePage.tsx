import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshGrid } from '../../components/mesh/MeshGrid';
import { careerMallas } from '../../data/careerMallas';
import styles from './DocentePage.module.css';

export function DocentePage() {
    const [selectedCareerId, setSelectedCareerId] = useState('ing-informatica');

    const selectedCareer = selectedCareerId
        ? careerMallas.find((c) => c.id === selectedCareerId) ?? null
        : null;

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
                        onChange={(e) => {
                            setSelectedCareerId(e.target.value);
                        }}
                    >
                        <option value="">-- Seleccione una carrera --</option>
                        {careerMallas.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {!selectedCareer ? (
                    <p className={styles.placeholder}>Seleccione una carrera para ver su malla</p>
                ) : (
                    <>
                        <h3 className={styles.careerTitle}>{selectedCareer.nombre}</h3>
                        <div className={styles.mainPanel}>
                            <div className={styles.meshArea}>
                                <MeshGrid
                                    semestres={selectedCareer.semestres}
                                    modulosIngles={selectedCareer.modulosIngles}
                                    practicas={selectedCareer.practicas}
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