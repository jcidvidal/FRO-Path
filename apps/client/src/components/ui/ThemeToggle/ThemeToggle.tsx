import { useTheme } from '../../../services/ThemeContext';
import { SunIcon, MoonIcon } from '../../icons/Icons';

interface ThemeToggleProps {
    readonly className?: string;
    readonly showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={className}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            {showLabel && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>}
        </button>
    );
}
