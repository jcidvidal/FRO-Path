import { useState, useEffect } from 'react';
import { MeshGrid } from '../../mesh/MeshGrid';
import { useMesh } from '../../../store/useMeshStore';
import { listarCarreras, type CarreraDto } from '../../../services/carreraService';
import styles from './ReadOnlyMeshView.module.css';

export function ReadOnlyMeshView() {
    const [careers, setCareers] = useState<CarreraDto[]>([]);
    const [selectedCareerId, setSelectedCareerId] = useState('icc');

    useEffect(() => {
        listarCarreras().then(setCareers).catch(() => setCareers([]));
    }, []);

    const { semestres, modulosIngles, practicas, isLoading } = useMesh(selectedCareerId);
    const selectedCareer = careers.find((c) => c.codigo_carrera === selectedCareerId);

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <label htmlFor="readonly-career-select" className={styles.selectLabel}>Seleccionar Carrera</label>
                <select
                    id="readonly-career-select"
                    className={styles.careerSelect}
                    value={selectedCareerId}
                    onChange={(e) => setSelectedCareerId(e.target.value)}
                >
                    <option value="">-- Seleccione una carrera --</option>
                    {careers.map((c) => (
                        <option key={c.id} value={c.codigo_carrera}>{c.nombre}</option>
                    ))}
                </select>
            </div>
            {isLoading ? (
                <p className={styles.placeholder}>Cargando malla...</p>
            ) : (
                <>
                    <h3 className={styles.careerTitle}>{selectedCareer?.nombre}</h3>
                    <div className={styles.panel}>
                        <div className={styles.meshArea}>
                            <MeshGrid semestres={semestres} modulosIngles={modulosIngles} practicas={practicas} readOnly />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
