import { useMemo, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { MeshGrid } from '../../components/mesh/MeshGrid';
import {
    eliminarEstudiante,
    nombreCompleto,
    type EstudianteResumen,
} from '../../services/directorService';
import {
    useBusquedaEstudiantes,
    useMallaEstudiante,
} from '../../store/useDirectorEstudiantes';
import styles from './DirectorDashboardPage.module.css';

const ID_CARRERA = 'icc';

export function DirectorDashboardPage() {
    const [busqueda, setBusqueda] = useState('');
    const [seleccionado, setSeleccionado] = useState<EstudianteResumen | null>(null);
    const [eliminandoId, setEliminandoId] = useState<number | null>(null);
    const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

    const {
        estudiantes,
        cargando: cargandoEstudiantes,
        error: errorEstudiantes,
        recargar,
    } = useBusquedaEstudiantes(busqueda);

    const manejarEliminar = async (estudiante: EstudianteResumen) => {
        const confirmado = window.confirm(
            `¿Eliminar a ${nombreCompleto(estudiante)}? Esta acción no se puede deshacer.`,
        );
        if (!confirmado) {
            return;
        }

        setEliminandoId(estudiante.id);
        setErrorEliminar(null);
        try {
            await eliminarEstudiante(estudiante.id);
            if (seleccionado?.id === estudiante.id) {
                setSeleccionado(null);
            }
            recargar();
        } catch (err) {
            setErrorEliminar(
                err instanceof Error ? err.message : 'Error al eliminar el estudiante',
            );
        } finally {
            setEliminandoId(null);
        }
    };

    const {
        semestres,
        modulosIngles,
        practicas,
        cargando: cargandoMalla,
        error: errorMalla,
    } = useMallaEstudiante(ID_CARRERA, seleccionado?.id ?? null);

    // Solo calcular SCT de la malla
    const asignaturasMalla = useMemo(() => semestres.flatMap((s) => s.asignaturas), [semestres]);
    const totalSct = asignaturasMalla.reduce((acc, a) => acc + a.sct, 0);
    const aprobadoSct = asignaturasMalla
        .filter((a) => a.status === 'aprobado')
        .reduce((acc, a) => acc + a.sct, 0);
    const porcentaje = totalSct === 0 ? 0 : Math.round((aprobadoSct / totalSct) * 100);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.container}>
                <h2 className={styles.titulo}>Vista Director</h2>

                <input
                    type="search"
                    className={styles.buscador}
                    placeholder="Buscar estudiante por nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    aria-label="Buscar estudiante por nombre o correo"
                />

                <div className={styles.layout}>
                    <aside className={styles.listaPanel}>
                        {cargandoEstudiantes && (
                            <p className={styles.estado}>Buscando estudiantes...</p>
                        )}
                        {errorEstudiantes && (
                            <p className={styles.estadoError}>{errorEstudiantes}</p>
                        )}
                        {!cargandoEstudiantes && !errorEstudiantes && estudiantes.length === 0 && (
                            <p className={styles.estado}>No se encontraron estudiantes.</p>
                        )}
                        {errorEliminar && (
                            <p className={styles.estadoError}>{errorEliminar}</p>
                        )}

                        <ul className={styles.lista}>
                            {estudiantes.map((estudiante) => (
                                <li key={estudiante.id} className={styles.itemFila}>
                                    <button
                                        type="button"
                                        className={`${styles.itemEstudiante} ${seleccionado?.id === estudiante.id ? styles.itemActivo : ''}`}
                                        onClick={() => setSeleccionado(estudiante)}
                                    >
                                        <span className={styles.itemNombre}>
                                            {nombreCompleto(estudiante)}
                                        </span>
                                        <span className={styles.itemEmail}>{estudiante.email}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.botonEliminar}
                                        disabled={eliminandoId === estudiante.id}
                                        onClick={() => manejarEliminar(estudiante)}
                                        aria-label={`Eliminar a ${nombreCompleto(estudiante)}`}
                                        title="Eliminar estudiante"
                                    >
                                        {eliminandoId === estudiante.id ? '…' : '🗑'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className={styles.mallaPanel}>
                        {!seleccionado && (
                            <p className={styles.estado}>
                                Selecciona un estudiante para ver su avance en la malla.
                            </p>
                        )}

                        {seleccionado && (
                            <>
                                <div className={styles.detalleHeader}>
                                    <h3 className={styles.detalleNombre}>
                                        {nombreCompleto(seleccionado)}
                                    </h3>
                                    <span className={styles.detalleEmail}>{seleccionado.email}</span>
                                </div>

                                {!cargandoMalla && !errorMalla && (
                                    <div className={styles.progreso}>
                                        <div className={styles.progresoHeader}>
                                            <span>Avance Curricular</span>
                                            <span>{aprobadoSct} / {totalSct} sct</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${porcentaje}%` }}
                                            />
                                        </div>
                                        <span className={styles.porcentaje}>{porcentaje}%</span>
                                    </div>
                                )}

                                {cargandoMalla && (
                                    <p className={styles.estado}>Cargando malla curricular...</p>
                                )}
                                {errorMalla && (
                                    <p className={styles.estadoError}>{errorMalla}</p>
                                )}

                                {!cargandoMalla && !errorMalla && (
                                    <MeshGrid
                                        semestres={semestres}
                                        modulosIngles={modulosIngles}
                                        practicas={practicas}
                                        readOnly
                                    />
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}