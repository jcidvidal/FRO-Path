import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient, saveToken, getToken, removeToken } from './apiClient';

function respuestaOk(data: unknown): Response {
  return {
    ok: true,
    json: () => Promise.resolve(data),
  } as Response;
}

function respuestaError(body: unknown, status = 400): Response {
  return {
    ok: false,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('manejo del token', () => {
    it('guarda, lee y elimina el token de autenticación', () => {
      expect(getToken()).toBeNull();
      saveToken('abc123');
      expect(getToken()).toBe('abc123');
      removeToken();
      expect(getToken()).toBeNull();
    });
  });

  describe('peticiones', () => {
    it('GET incluye el header Authorization cuando hay token', async () => {
      saveToken('mi-token');
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(respuestaOk({ ok: 1 }));

      const data = await apiClient.get<{ ok: number }>('/recurso');

      expect(data).toEqual({ ok: 1 });
      const [, opciones] = fetchMock.mock.calls[0];
      expect(
        (opciones?.headers as Record<string, string>).Authorization,
      ).toBe('Bearer mi-token');
    });

    it('GET omite el header Authorization cuando no hay token', async () => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(respuestaOk({}));

      await apiClient.get('/publico');

      const [, opciones] = fetchMock.mock.calls[0];
      expect(
        (opciones?.headers as Record<string, string>).Authorization,
      ).toBeUndefined();
    });

    it('POST envía el método y el cuerpo serializado', async () => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(respuestaOk({ id: 9 }));

      await apiClient.post('/crear', { nombre: 'x' });

      const [, opciones] = fetchMock.mock.calls[0];
      expect(opciones?.method).toBe('POST');
      expect(opciones?.body).toBe(JSON.stringify({ nombre: 'x' }));
    });

    it('PATCH envía el método correcto', async () => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(respuestaOk({}));

      await apiClient.patch('/editar', { a: 1 });

      expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');
    });

    it('DELETE envía el método correcto', async () => {
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(respuestaOk({}));

      await apiClient.delete('/borrar');

      expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
    });

    it('lanza Error con el mensaje del backend cuando es un string', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        respuestaError({ message: 'Credenciales inválidas' }, 401),
      );

      await expect(apiClient.get('/login')).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('usa el primer mensaje cuando el backend devuelve un array', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        respuestaError({ message: ['Email inválido', 'Otro'] }),
      );

      await expect(apiClient.get('/x')).rejects.toThrow('Email inválido');
    });

    it('usa un mensaje por defecto cuando el cuerpo de error no es JSON', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('sin cuerpo')),
      } as Response);

      await expect(apiClient.get('/x')).rejects.toThrow('Error del servidor');
    });
  });
});
