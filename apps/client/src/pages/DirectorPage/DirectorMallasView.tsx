import { MeshGrid } from '../../components/mesh/MeshGrid';
import { careerMallas } from '../../data/careerMallas';
import styles from './DirectorPage.module.css';

interface DirectorMallasViewProps {
    selectedCareerId: string;
    onCareerChange: (id: string) => void;
}

export function DirectorMallasView({ selectedCareerId, onCareerChange }: DirectorMallasViewProps) {
    const selectedCareer = careerMallas.find((c) => c.id === selectedCareerId) ?? null;

    return (
        <>
            <div className={styles.toolbar}>
                <label htmlFor="director-career-select" className={styles.selectLabel}>
                    Seleccionar Carrera
                </label>
                <select
                    id="director-career-select"
                    className={styles.careerSelect}
                    value={selectedCareerId}
                    onChange={(e) => onCareerChange(e.target.value)}
                >
                    <option value="">-- Seleccione una carrera --</option>
                    {careerMallas.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <h3 className={styles.careerTitle}>{selectedCareer?.nombre}</h3>
            <div className={styles.mainPanel}>
                <div className={styles.meshArea}>
                    {selectedCareer && (
                        <MeshGrid
                            semestres={selectedCareer.semestres}
                            modulosIngles={selectedCareer.modulosIngles}
                            practicas={selectedCareer.practicas}
                            readOnly
                        />
                    )}
                </div>
            </div>
        </>
    );
}