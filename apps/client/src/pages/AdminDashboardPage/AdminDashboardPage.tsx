import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppSidebar } from '../../components/auth/AppSidebar/AppSidebar';
import { ReadOnlyMeshView } from '../../components/shared/ReadOnlyMeshView/ReadOnlyMeshView';
import { StudentProgressView } from '../../components/shared/StudentProgressView/StudentProgressView';
import { SearchIcon } from '../../components/icons/Icons';
import {
    buscarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    nombreCompleto,
    type UsuarioResumen,
    type RolUsuario,
} from '../../services/adminService';
import styles from './AdminDashboardPage.module.css';

function RoleBadge({ role }: { role: string }) {
    const colorMap: Record<string, string> = {
        admin: styles.roleAdmin,
        director: styles.roleDirector,
        docente: styles.roleDocente,
        profesor: styles.roleDocente,
        estudiante: styles.roleEstudiante,
    };
    const labels: Record<string, string> = {
        admin: 'Admin',
        director: 'Director',
        docente: 'Docente',
        profesor: 'Profesor',
        estudiante: 'Estudiante',
    };
    return (
        <span className={`${styles.roleBadge} ${colorMap[role] || ''}`}>
            {labels[role] || role}
        </span>
    );
}

const ROLE_OPTIONS = [
    { value: 'estudiante', label: 'Estudiante' },
    { value: 'profesor', label: 'Profesor' },
    { value: 'director', label: 'Director' },
    { value: 'admin', label: 'Admin' },
];

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--color-card-border-green)',
    borderRadius: 4,
    padding: '6px 10px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-sm)',
};

const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: 4,
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

function AdminUsersView() {
    const [users, setUsers] = useState<UsuarioResumen[]>([]);
    const [search, setSearch] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNombre, setEditingNombre] = useState('');
    const [editingApellidoPaterno, setEditingApellidoPaterno] = useState('');
    const [editingApellidoMaterno, setEditingApellidoMaterno] = useState('');
    const [editingRol, setEditingRol] = useState<RolUsuario>('estudiante');
    const [isCreating, setIsCreating] = useState(false);
    const [createData, setCreateData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        rol: 'estudiante' as string,
        password: '',
    });
    const [createBtnHovered, setCreateBtnHovered] = useState(false);

    const cargarUsuarios = useCallback(async (termino: string) => {
        setCargando(true);
        setError(null);
        try {
            const datos = await buscarUsuarios({ busqueda: termino || undefined });
            setUsers(datos);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => { cargarUsuarios(search); }, 300);
        return () => clearTimeout(t);
    }, [search, cargarUsuarios]);

    const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

    function handleSelectUser(id: number) {
        setSelectedUserId(id);
        setIsEditing(false);
    }

    function handleStartEdit() {
        if (!selectedUser) return;
        setIsEditing(true);
        setEditingNombre(selectedUser.nombre);
        setEditingApellidoPaterno(selectedUser.apellidoPaterno);
        setEditingApellidoMaterno(selectedUser.apellidoMaterno);
        setEditingRol(selectedUser.rol as 'estudiante' | 'profesor' | 'director' | 'admin');
    }

    async function handleSaveEdit() {
        if (!selectedUser) return;
        try {
            await actualizarUsuario(selectedUser.id, {
                nombre: editingNombre,
                apellidoPaterno: editingApellidoPaterno,
                apellidoMaterno: editingApellidoMaterno,
                rol: editingRol,
            });
            setIsEditing(false);
            await cargarUsuarios(search);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al actualizar');
        }
    }

    function handleStartCreate() {
        setIsCreating(true);
        setCreateData({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', rol: 'estudiante', password: '' });
    }

    async function handleSaveCreate() {
        if (!createData.nombre || !createData.email || !createData.password) {
            alert('Todos los campos son obligatorios');
            return;
        }
        try {
            await crearUsuario({
                nombre: createData.nombre,
                apellidoPaterno: createData.apellidoPaterno,
                apellidoMaterno: createData.apellidoMaterno,
                email: createData.email,
                password: createData.password,
                rol: createData.rol as RolUsuario,
            });
            setIsCreating(false);
            await cargarUsuarios(search);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error al crear usuario');
        }
    }

    function handleDelete(user: UsuarioResumen) {
        if (!confirm(`Eliminar a ${nombreCompleto(user)}?`)) return;
        eliminarUsuario(user.id).then(() => {
            if (selectedUserId === user.id) setSelectedUserId(null);
            cargarUsuarios(search);
        }).catch((err) => alert(err instanceof Error ? err.message : 'Error al eliminar'));
    }

    return (
        <div className={styles.usersView}>
            <h2 className={styles.subtitle}>Gestion de Usuarios</h2>
            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <SearchIcon />
                    <input className={styles.searchInput} placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar usuarios" />
                </div>
                <button
                    onClick={handleStartCreate}
                    onMouseEnter={() => setCreateBtnHovered(true)}
                    onMouseLeave={() => setCreateBtnHovered(false)}
                    style={{
                        padding: '6px 16px',
                        background: 'transparent',
                        color: 'var(--color-green)',
                        border: '2px solid var(--color-green)',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background 0.18s, color 0.18s',
                        ...(createBtnHovered ? { background: 'var(--color-green)', color: 'var(--color-bg-primary)' } : {}),
                    }}
                >
                    + Crear Usuario
                </button>
            </div>
            <div className={styles.mainPanel}>
                <div className={styles.userList}>
                    <p className={styles.listTitle}>Usuarios ({users.length})</p>
                    {cargando && <p className={styles.placeholder}>Cargando...</p>}
                    {error && <p className={styles.placeholder}>{error}</p>}
                    {!cargando && !error && users.length === 0 && <p className={styles.placeholder}>No se encontraron usuarios.</p>}
                    {users.map((u) => (
                        <button key={u.id} className={`${styles.userItem} ${selectedUser?.id === u.id ? styles.userItemActive : ''}`} onClick={() => handleSelectUser(u.id)}>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{nombreCompleto(u)}</span>
                                <RoleBadge role={u.rol} />
                            </div>
                        </button>
                    ))}
                </div>
                <div className={styles.userDetail}>
                    {!selectedUser ? (
                        <p className={styles.placeholder}>Seleccione un usuario para ver detalles</p>
                    ) : isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Editar Usuario</h3>
                            <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={editingNombre} onChange={(e) => setEditingNombre(e.target.value)} placeholder="Nombres" /></div>
                            <div><label style={labelStyle}>Apellido Paterno</label><input style={inputStyle} value={editingApellidoPaterno} onChange={(e) => setEditingApellidoPaterno(e.target.value)} placeholder="Apellido paterno" /></div>
                            <div><label style={labelStyle}>Apellido Materno</label><input style={inputStyle} value={editingApellidoMaterno} onChange={(e) => setEditingApellidoMaterno(e.target.value)} placeholder="Apellido materno" /></div>
                            <div><label style={labelStyle}>Rol</label>
                                <select style={selectStyle} value={editingRol} onChange={(e) => setEditingRol(e.target.value as 'estudiante' | 'profesor' | 'director' | 'admin')}>
                                    {ROLE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={handleSaveEdit} style={{ padding: '8px 20px', background: 'var(--color-green)', color: 'var(--color-bg-primary)', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Guardar</button>
                                <button onClick={() => setIsEditing(false)} style={{ padding: '8px 20px', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-card-border-green)', borderRadius: 6, fontWeight: 600, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Detalles del Usuario</h3>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Nombre: {nombreCompleto(selectedUser)}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Email: {selectedUser.email}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Rol: <RoleBadge role={selectedUser.rol} /></p>
                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                <button onClick={handleStartEdit} style={{ padding: '8px 20px', background: 'var(--color-green)', color: 'var(--color-bg-primary)', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Editar</button>
                                <button onClick={() => handleDelete(selectedUser)} style={{ padding: '8px 20px', background: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: 6, fontWeight: 600, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Eliminar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isCreating && (
                <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}>
                    <div style={{ background: 'var(--color-bg-primary)', border: '2px solid var(--color-card-border-green)', borderRadius: 12, padding: 24, width: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Crear Usuario</h3>
                        <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={createData.nombre} onChange={(e) => setCreateData(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombres" /></div>
                        <div><label style={labelStyle}>Apellido Paterno</label><input style={inputStyle} value={createData.apellidoPaterno} onChange={(e) => setCreateData(p => ({ ...p, apellidoPaterno: e.target.value }))} placeholder="Apellido paterno" /></div>
                        <div><label style={labelStyle}>Apellido Materno</label><input style={inputStyle} value={createData.apellidoMaterno} onChange={(e) => setCreateData(p => ({ ...p, apellidoMaterno: e.target.value }))} placeholder="Apellido materno" /></div>
                        <div><label style={labelStyle}>Email</label><input style={inputStyle} value={createData.email} onChange={(e) => setCreateData(p => ({ ...p, email: e.target.value }))} placeholder="email@ejemplo.com" /></div>
                        <div><label style={labelStyle}>Contrasena</label><input style={inputStyle} type="password" value={createData.password} onChange={(e) => setCreateData(p => ({ ...p, password: e.target.value }))} placeholder="Contrasena" /></div>
                        <div><label style={labelStyle}>Rol</label>
                            <select style={selectStyle} value={createData.rol} onChange={(e) => setCreateData(p => ({ ...p, rol: e.target.value }))}>
                                {ROLE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsCreating(false)} style={{ padding: '8px 20px', background: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-card-border-green)', borderRadius: 6, fontWeight: 600, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Cancelar</button>
                            <button onClick={handleSaveCreate} style={{ padding: '8px 20px', background: 'var(--color-green)', color: 'var(--color-bg-primary)', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 'var(--font-size-sm)', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>Crear</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function AdminDashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get('view') || 'users';

    useEffect(() => {
        if (!searchParams.get('view')) {
            setSearchParams({ view: 'users' }, { replace: true });
        }
    }, []);

    return (
        <DashboardLayout sidebar={(onCloseSidebar) => (<AppSidebar onCloseSidebar={onCloseSidebar} />)}>
            <div className={styles.content}>
                {view === 'users' && <AdminUsersView />}
                {view === 'mallas' && <ReadOnlyMeshView />}
                {view === 'avances' && <StudentProgressView />}
            </div>
        </DashboardLayout>
    );
}