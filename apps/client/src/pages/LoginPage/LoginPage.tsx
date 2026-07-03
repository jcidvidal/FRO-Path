import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { Input } from '../../components/ui/Input/Input';
import { PasswordInput } from '../../components/auth/Passwordinput/passwordInput';
import { Button } from '../../components/ui/Button/Button';
import { FormMessage } from '../../components/ui/FormMessage/FormMessage';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../services/ThemeContext';
import { SunIcon, MoonIcon } from '../../components/icons/Icons';
import { useForm } from '../../hooks/useForm';
import { required, minLength } from '../../services/validators';
import styles from './LoginPage.module.css';

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [formError, setFormError] = useState<string | null>(null);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldError,
    } = useForm({
        initialValues: { email: '', password: '' },
        validators: {
            email: [required],
            password: [required, minLength(6)],
        },
        onSubmit: async (vals) => {
            setFormError(null);

            const result = await login(vals.email, vals.password);

            if (result.success) {
                const rutas: Record<string, string> = {
                    estudiante: '/dashboard',
                    docente: '/dashboard/docente',
                    director: '/dashboard/director',
                    admin: '/dashboard/admin',
                };
                navigate(rutas[result.role ?? 'estudiante'] ?? '/dashboard');
            } else {
                if (result.error?.toLowerCase().includes('contrasena')) {
                    setFieldError('password', result.error);
                } else {
                    setFormError(result.error || 'Error al iniciar sesion');
                }
            }
        },
    });

    return (
        <AuthLayout glow="green">
            <div className={styles.card}>
                <h1 className={styles.title}>Malla Interactiva</h1>
                <p className={styles.subtitle}>Universidad de la Frontera</p>

                {formError && <FormMessage type="error" message={formError} />}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
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
                            variant="green"
                        />
                    </div>

                    <div className={styles.field}>
                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password ? errors.password : undefined}
                            autoComplete="current-password"
                            required
                            variant="green"
                        />
                    </div>

                    <Button type="submit" fullWidth loading={isSubmitting} variant="green">
                        Iniciar Sesion
                    </Button>
                </form>

                <p className={styles.footer}>
                    ¿No tienes cuenta?<Link to="/register">Registrate</Link>
                </p>
            </div>

            <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
        </AuthLayout>
    );
}