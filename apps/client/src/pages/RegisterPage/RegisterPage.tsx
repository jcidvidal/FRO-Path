import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { Input } from '../../components/ui/Input/Input';
import { PasswordInput } from '../../components/auth/Passwordinput/passwordInput';
import { Button } from '../../components/ui/Button/Button';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';
import { useAuth } from '../../services/AuthContext';
import { useForm } from '../../hooks/useForm';
import { required, minLength, matchesField, rut } from '../../services/validators';
import { listarCarreras, type CarreraDto } from '../../services/carreraService';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [carreras, setCarreras] = useState<CarreraDto[]>([]);
    const [cargandoCarreras, setCargandoCarreras] = useState(true);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm({
        initialValues: {
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rut: '',
            email: '',
            carrera: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            nombre: [required],
            apellidoPaterno: [required],
            apellidoMaterno: [required],
            rut: [required, rut],
            email: [required],
            password: [required, minLength(6)],
            confirmPassword: [required, matchesField('password', 'Contraseña')],
        },
        onSubmit: async (vals) => {
            setFormError(null);
            setSuccessMessage(null);

            const result = await register(
                vals.nombre,
                vals.apellidoPaterno,
                vals.apellidoMaterno,
                vals.rut,
                vals.email,
                vals.password,
                vals.carrera,
            );

            if (result.success) {
                setSuccessMessage(
                    'Cuenta creada exitosamente. Ahora puedes iniciar sesión.',
                );
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setFormError(result.error || 'Error al registrar');
            }
        },
    });

    useEffect(() => {
        listarCarreras()
            .then(setCarreras)
            .catch(() => setCarreras([]))
            .finally(() => setCargandoCarreras(false));
    }, []);

    return (
        <AuthLayout glow="cyan">
            <div className={styles.card}>
                <h1 className={styles.title}>Crear Cuenta</h1>
                <p className={styles.subtitle}>Universidad de la Frontera</p>

                {successMessage && (
                    <FormMessage type="success" message={successMessage} />
                )}
                {formError && <FormMessage type="error" message={formError} />}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.fieldsGrid}>
                        <Input
                            label="Nombres"
                            name="nombre"
                            type="text"
                            value={values.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.nombre ? errors.nombre : undefined}
                            autoComplete="given-name"
                            required
                            variant="cyan"
                        />

                        <Input
                            label="Apellido Paterno"
                            name="apellidoPaterno"
                            type="text"
                            value={values.apellidoPaterno}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.apellidoPaterno ? errors.apellidoPaterno : undefined}
                            autoComplete="family-name"
                            required
                            variant="cyan"
                        />

                        <Input
                            label="Apellido Materno"
                            name="apellidoMaterno"
                            type="text"
                            value={values.apellidoMaterno}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.apellidoMaterno ? errors.apellidoMaterno : undefined}
                            autoComplete="family-name"
                            required
                            variant="cyan"
                        />

                        <Input
                            label="RUT"
                            name="rut"
                            type="text"
                            value={values.rut}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.rut ? errors.rut : undefined}
                            placeholder="12.345.678-9"
                            autoComplete="off"
                            required
                            variant="cyan"
                        />

                        <Input
                            label="Correo"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email ? errors.email : undefined}
                            autoComplete="email"
                            required
                            variant="cyan"
                        />

                        <Input
                            label="Carrera"
                            name="carrera"
                            as="select"
                            value={values.carrera}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.carrera ? errors.carrera : undefined}
                            required
                            variant="cyan"
                            options={[
                                {
                                    value: '',
                                    label: cargandoCarreras
                                        ? 'Cargando carreras...'
                                        : 'Seleccione una carrera',
                                },
                                ...carreras.map((c) => ({
                                    value: c.codigo_carrera,
                                    label: c.nombre,
                                })),
                            ]}
                        />

                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password ? errors.password : undefined}
                            autoComplete="new-password"
                            required
                            variant="cyan"
                        />

                        <PasswordInput
                            label="Confirmar Contraseña"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.confirmPassword ? errors.confirmPassword : undefined
                            }
                            placeholder="Repite tu contraseña"
                            autoComplete="new-password"
                            required
                            variant="cyan"
                        />
                    </div>

                    <Button type="submit" fullWidth loading={isSubmitting} variant="cyan">
                        Crear Cuenta
                    </Button>
                </form>

                <p className={styles.footer}>
                    ¿Ya tienes cuenta?<Link to="/login">Inicia Sesión</Link>
                </p>
            </div>
        </AuthLayout>
    );
}
