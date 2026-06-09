import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { Input } from '../../components/ui/Input/Input';
import { PasswordInput } from '../../components/auth/Passwordinput/passwordInput';
import { Button } from '../../components/ui/Button/Button';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';
import { useAuth } from '../../services/AuthContext';
import { useForm } from '../../hooks/useForm';
import { required, minLength, matchesField, rut } from '../../services/validators';
import styles from './RegisterPage.module.css';

const CARRERA_OPTIONS = [
    { value: 'informatica', label: 'Ingeniería en Informática' },
    { value: 'ing-civil-inf', label: 'Ingeniería Civil en Informática' },
];

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            rut: '',
            email: '',
            carrera: 'informatica',
            password: '',
            confirmPassword: '',
        },
        validators: {
            nombre: [required],
            rut: [required, rut],
            email: [required],
            password: [required, minLength(6)],
            confirmPassword: [required, matchesField('password', 'Contraseña')],
        },
        onSubmit: async (vals) => {
            setFormError(null);
            setSuccessMessage(null);

            const result = await register(vals.nombre, vals.rut, vals.email, vals.password);

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
                            label="Nombre Completo"
                            name="nombre"
                            type="text"
                            value={values.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.nombre ? errors.nombre : undefined}
                            autoComplete="name"
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
                            options={CARRERA_OPTIONS}
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
