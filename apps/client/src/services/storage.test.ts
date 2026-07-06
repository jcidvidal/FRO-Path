import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get', () => {
    it('retorna el valor parseado cuando existe', () => {
      localStorage.setItem('clave', JSON.stringify({ a: 1 }));
      expect(storage.get<{ a: number }>('clave')).toEqual({ a: 1 });
    });

    it('retorna null cuando la clave no existe', () => {
      expect(storage.get('inexistente')).toBeNull();
    });

    it('retorna null cuando el contenido no es JSON válido', () => {
      localStorage.setItem('rota', '{no-es-json');
      expect(storage.get('rota')).toBeNull();
    });
  });

  describe('set', () => {
    it('serializa y guarda el valor', () => {
      storage.set('clave', { b: 2 });
      expect(localStorage.getItem('clave')).toBe(JSON.stringify({ b: 2 }));
    });

    it('captura el error y no propaga si localStorage falla', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('cuota excedida');
      });

      expect(() => storage.set('clave', { c: 3 })).not.toThrow();
      expect(error).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('elimina la clave', () => {
      localStorage.setItem('clave', '1');
      storage.remove('clave');
      expect(localStorage.getItem('clave')).toBeNull();
    });

    it('captura el error y no propaga si localStorage falla', () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('falla');
      });

      expect(() => storage.remove('clave')).not.toThrow();
      expect(log).toHaveBeenCalled();
    });
  });
});
