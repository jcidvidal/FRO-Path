import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import {
    buscarUsuarios,
    asignarRol,
    nombreCompleto,
    type RolUsuario,
    type UsuarioResumen,
} from '../../services/adminService';
import styles from './AdminDashboardPage.module.css';

const RETARDO_BUSQUEDA_MS = 300;

const ETIQUETAS_ROL: Record<RolUsuario, string> = {
    estudiante: 'Estudiante',
    profesor: 'Profesor',
    director: 'Director',
    admin: 'Administrador',
};

const FILTROS_ROL: { valor: '' | RolUsuario; etiqueta: string }[] = [
    { valor: '', etiqueta: 'Todos los roles' },
    { valor: 'estudiante', etiqueta: 'Estudiantes' },
    { valor: 'profesor', etiqueta: 'Profesores' },
    { valor: 'director', etiqueta: 'Directores' },
];

export function AdminDashboardPage() {
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState<'' | RolUsuario>('');
    const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accionId, setAccionId] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const cargarUsuarios = useCallback(
        (controlador?: { cancelado: boolean }) => {
            setCargando(true);
            setError(null);

            return buscarUsuarios({
                busqueda,
                rol: filtroRol || undefined,
            })
                .then((datos) => {
                    if (!controlador?.cancelado) {
                        setUsuarios(datos);
                    }
                })
                .catch((err: unknown) => {
                    if (!controlador?.cancelado) {
                        setError(
                            err instanceof Error ? err.message : 'Error al buscar usuarios',
                        );
                    }
                })
                .finally(() => {
                    if (!controlador?.cancelado) {
                        setCargando(false);
                    }
                });
        },
        [busqueda, filtroRol],
    );

    useEffect(() => {
        const controlador = { cancelado: false };
        const temporizador = setTimeout(() => {
            void cargarUsuarios(controlador);
        }, RETARDO_BUSQUEDA_MS);

        return () => {
            controlador.cancelado = true;
            clearTimeout(temporizador);
        };
    }, [cargarUsuarios]);

    const manejarAsignacion = async (
        usuario: UsuarioResumen,
        rol: 'profesor' | 'director',
    ) => {
        setAccionId(usuario.id);
        setError(null);
        setMensaje(null);
        try {
            await asignarRol(usuario.id, rol);
            setMensaje(
                `${nombreCompleto(usuario)} ahora es ${ETIQUETAS_ROL[rol]}.`,
            );
            await cargarUsuarios();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al asignar el rol');
        } finally {
            setAccionId(null);
        }
    };

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (
            <AppSidebar onCloseSidebar={onCloseSidebar} />
        )}>
            <div className={styles.container}>
                <h2 className={styles.titulo}>Gestión de Usuarios</h2>
                <p className={styles.descripcion}>
                    Busca estudiantes, profesores y directores por nombre o correo, y
                    asigna roles. Al asignar profesor o director, el rol de estudiante se
                    reemplaza automáticamente.
                </p>

                <div className={styles.filtros}>
                    <input
                        type="search"
                        className={styles.buscador}
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar usuario por nombre o correo"
                    />
                    <select
                        className={styles.selectorRol}
                        value={filtroRol}
                        onChange={(e) => setFiltroRol(e.target.value as '' | RolUsuario)}
                        aria-label="Filtrar por rol"
                    >
                        {FILTROS_ROL.map((opcion) => (
                            <option key={opcion.valor} value={opcion.valor}>
                                {opcion.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>

                {mensaje && <p className={styles.estadoExito}>{mensaje}</p>}
                {error && <p className={styles.estadoError}>{error}</p>}
                {cargando && <p className={styles.estado}>Buscando usuarios...</p>}
                {!cargando && !error && usuarios.length === 0 && (
                    <p className={styles.estado}>No se encontraron usuarios.</p>
                )}

                {usuarios.length > 0 && (
                    <div className={styles.tablaWrapper}>
                        <table className={styles.tabla}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{nombreCompleto(usuario)}</td>
                                        <td className={styles.celdaEmail}>{usuario.email}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[`badge_${usuario.rol}`]}`}>
                                                {ETIQUETAS_ROL[usuario.rol]}
                                            </span>
                                        </td>
                                        <td>
                                            {usuario.rol === 'admin' ? (
                                                <span className={styles.sinAcciones}>—</span>
                                            ) : (
                                                <div className={styles.acciones}>
                                                    <button
                                                        type="button"
                                                        className={styles.botonRol}
                                                        disabled={
                                                            accionId === usuario.id ||
                                                            usuario.rol === 'profesor'
                                                        }
                                                        onClick={() =>
                                                            manejarAsignacion(usuario, 'profesor')
                                                        }
                                                    >
                                                        Hacer profesor
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={styles.botonRol}
                                                        disabled={
                                                            accionId === usuario.id ||
                                                            usuario.rol === 'director'
                                                        }
                                                        onClick={() =>
                                                            manejarAsignacion(usuario, 'director')
                                                        }
                                                    >
                                                        Hacer director
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
