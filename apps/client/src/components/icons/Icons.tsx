interface IconProps {
    className?: string;
}

export function GridIcon({ className }: IconProps) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="1" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function TrashIcon({ className }: IconProps) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 5V3.5C6 2.67 6.67 2 7.5 2H10.5C11.33 2 12 2.67 12 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 5V14.5C14 15.33 13.33 16 12.5 16H5.5C4.67 16 4 15.33 4 14.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function ChartIcon({ className }: IconProps) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect x="2" y="12" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="7.5" y="8" width="3" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="4" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function UsersIcon({ className }: IconProps) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 16C3 12.5 6.5 10 9 10C11.5 10 15 12.5 15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function LockIcon({ className }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

export function SearchIcon({ className }: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function UserIcon({ className }: IconProps) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="10" cy="7" r="3.5" stroke="var(--color-green)" strokeWidth="1.5" />
            <path d="M3 18C3 14.5 6.5 12 10 12C13.5 12 17 14.5 17 18" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}