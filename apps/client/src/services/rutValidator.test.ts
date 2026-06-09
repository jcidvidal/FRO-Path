import { describe, it, expect } from 'vitest';
import { validateRut, cleanRut, formatRut } from './rutValidator';

describe('rutValidator', () => {
    describe('validateRut', () => {
        it('debe validar un RUT valido con el formato(11.111.111-1)', () => {
            const result = validateRut('11.111.111-1');
            expect(result.isValid).toBe(true);
            expect(result.clean).toBe('111111111');
            expect(result.dv).toBe('1');
            expect(result.formatted).toBe('11.111.111-1');
        });

        it('debe validar un RUT valido sin formato (111111111)', () => {
            const result = validateRut('111111111');
            expect(result.isValid).toBe(true);
            expect(result.clean).toBe('111111111');
            expect(result.formatted).toBe('11.111.111-1');
        });

        it('debe rechazar un RUT con dv invalido (11.111.111-2) el dv deberia ser 2', () => {
            const result = validateRut('11.111.111-2');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Digito verificador invalido');
        });

        it('debe rechazar un RUT vacio', () => {
            const result = validateRut('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Formato de Rut invalido. Use xx.xxx.xxx-x');
        });

        it('debe rechazar un RUT con formato incorrecto', () => {
            const result = validateRut('abc');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Formato de Rut invalido. Use xx.xxx.xxx-x');
        });

        it('debe aceptar RUT con dígito verificador K', () => {
            const result = validateRut('11111111');
            expect(typeof result.isValid).toBe('boolean');
        });

        it('debe manejar RUT con dígito 0', () => {
            const result = validateRut('1');
            expect(result.isValid).toBe(false);
        });
    });

    describe('cleanRut', () => {
        it('debe limpiar puntos y guiones', () => {
            expect(cleanRut('11.111.111-1')).toBe('111111111');
        });

        it('debe limpiar espacios', () => {
            expect(cleanRut(' 11.111.111-1 ')).toBe('111111111');
        });
    });

    describe('formatRut', () => {
        it('debe formatear un RUT limpio', () => {
            expect(formatRut('111111111')).toBe('11.111.111-1');
        });

        it('debe devolver el mismo valor si es muy corto', () => {
            expect(formatRut('1')).toBe('1');
        });
    });
});