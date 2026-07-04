const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { message?: string | string[] };
        const message = Array.isArray(body.message)
            ? body.message[0]
            : (body.message ?? 'Error del servidor');
        throw new Error(message as string);
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: 'POST',
            body: body === undefined ? undefined : JSON.stringify(body),
        }),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
