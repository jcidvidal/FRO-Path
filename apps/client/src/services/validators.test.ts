import {describe, it, expect} from 'vitest';
import {required, minLength, rut, matchesField, email} from './validators';

describe('validators', () => {
  describe('required', () => {
    it('debe retornar error para string vacio', () => {
      expect(required('')).toBe('Este campo es requerido');
    });

    it('debe retornar error para solo espacios', () => {
      expect(required('   ')).toBe('Este campo es requerido');
    });

    it('debe retornar true para string con contenido', () => {
      expect(required('hola')).toBe(true);
    });
  });

  describe('minLength', () => {
    it('debe retornar error para string mas corto que el minimo', () => {
      const validator = minLength(6);
      expect(validator('12345')).toBe('Minimo 6 caracteres');
    });

    it('debe retornar true para string con longitud igual al minimo', () => {
      const validator = minLength(6);
      expect(validator('123456')).toBe(true);
    });

    it('debe retornar true para string mas largo que el minimo', () => {
      const validator = minLength(6);
      expect(validator('1234567')).toBe(true);
    });
  });

  describe('rut', () => {
    it('debe retornar true para RUT valido', () => {
      expect(rut('11.111.111-1')).toBe(true);
    });

    it('debe retornar true para RUT valido sin formato', () => {
      expect(rut('111111111')).toBe(true);
    });

    it('debe retornar error para RUT invalido', () => {
      const result = rut('11.111.111-2');
      expect(result).not.toBe(true);
      expect(typeof result).toBe('string');
    });

    it('debe retornar true para string vacio (delegar a required)', () => {
      expect(rut('')).toBe(true);
    });
  });

  describe('matchesField', () => {
    it('debe retornar true cuando los valores coinciden', () => {
      const validator = matchesField('password', 'Contrasena');
      expect(validator('abc', { password: 'abc' })).toBe(true);
    });

    it('debe retornar error cuando los valores no coinciden', () => {
      const validator = matchesField('password', 'Contrasena');
      expect(validator('abc', { password: 'xyz' })).toBe('No coincide con Contrasena');
    });

    it('debe retornar error cuando formValues es undefined', () => {
      const validator = matchesField('password', 'Contrasena');
      expect(validator('abc', undefined)).toBe('No coincide con Contrasena');
    });
  });

  describe('email', () => {
    it('debe retornar true para email valido', () => {
      expect(email('test@example.com')).toBe(true);
    });

    it('debe retornar true para string vacio (delegar a required)', () => {
      expect(email('')).toBe(true);
    });

    it('debe retornar error para email invalido', () => {
      expect(email('invalido')).toBe('Correo invalido');
    });

    it('debe retornar error para email sin @', () => {
      expect(email('testexample.com')).toBe('Correo invalido');
    });
  });
});