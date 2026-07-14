import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from './apiClient';
import {
    buscarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    asignarRol,
    nombreCompleto,
    type UsuarioResumen,
} from './adminService';

describe('adminService', () => {
    const usuarioEjemplo: UsuarioResumen = {
        id: 1,
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'González',
        email: 'juan@ufrontera.cl',
        rol: 'estudiante',
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('nombreCompleto', () => {
        it('concatena nombre + apellidoPaterno + apellidoMaterno', () => {
            expect(nombreCompleto(usuarioEjemplo)).toBe('Juan Pérez González');
        });

        it('filtra valores vacíos', () => {
            const sinMaterno = { ...usuarioEjemplo, apellidoMaterno: '' };
            expect(nombreCompleto(sinMaterno)).toBe('Juan Pérez');
        });

        it('funciona si todos los campos están vacíos', () => {
            const vacio = { ...usuarioEjemplo, nombre: '', apellidoPaterno: '', apellidoMaterno: '' };
            expect(nombreCompleto(vacio)).toBe('');
        });
    });

    describe('buscarUsuarios', () => {
        it('llama a GET /auth/usuarios sin query cuando no hay filtros', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarUsuarios({});
            expect(spy).toHaveBeenCalledWith('/auth/usuarios');
        });

        it('incluye busqueda en query string', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarUsuarios({ busqueda: 'Juan' });
            expect(spy).toHaveBeenCalledWith('/auth/usuarios?busqueda=Juan');
        });

        it('incluye rol en query string', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarUsuarios({ rol: 'profesor' });
            expect(spy).toHaveBeenCalledWith('/auth/usuarios?rol=profesor');
        });

        it('combina busqueda y rol', async () => {
            const spy = vi.spyOn(apiClient, 'get').mockResolvedValue([]);
            await buscarUsuarios({ busqueda: 'María', rol: 'director' });
            const llamado = spy.mock.calls[0][0] as string;
            expect(llamado).toContain('busqueda=' + encodeURIComponent('María'));
            expect(llamado).toContain('rol=director');
        });

        it('retorna los usuarios del backend', async () => {
            vi.spyOn(apiClient, 'get').mockResolvedValue([usuarioEjemplo]);
            const resultado = await buscarUsuarios({});
            expect(resultado).toEqual([usuarioEjemplo]);
        });
    });

    describe('crearUsuario', () => {
        it('llama a POST /auth/usuarios con los datos', async () => {
            const spy = vi.spyOn(apiClient, 'post').mockResolvedValue(usuarioEjemplo);
            const datos = {
                nombre: 'Ana',
                apellidoPaterno: 'López',
                apellidoMaterno: 'Rivas',
                email: 'ana@ufrontera.cl',
                password: '123456',
                rol: 'profesor',
            };
            await crearUsuario(datos);
            expect(spy).toHaveBeenCalledWith('/auth/usuarios', datos);
        });

        it('retorna el usuario creado', async () => {
            vi.spyOn(apiClient, 'post').mockResolvedValue(usuarioEjemplo);
            const resultado = await crearUsuario({
                nombre: 'Ana', apellidoPaterno: 'López', apellidoMaterno: 'Rivas',
                email: 'ana@ufrontera.cl', password: '123456', rol: 'profesor',
            });
            expect(resultado).toEqual(usuarioEjemplo);
        });
    });

    describe('actualizarUsuario', () => {
        it('llama a PATCH /auth/usuarios/:id con los datos', async () => {
            const spy = vi.spyOn(apiClient, 'patch').mockResolvedValue(usuarioEjemplo);
            await actualizarUsuario(1, { nombre: 'Juanito', rol: 'profesor' });
            expect(spy).toHaveBeenCalledWith('/auth/usuarios/1', { nombre: 'Juanito', rol: 'profesor' });
        });
    });

    describe('eliminarUsuario', () => {
        it('llama a DELETE /auth/usuarios/:id', async () => {
            const spy = vi.spyOn(apiClient, 'delete').mockResolvedValue({ id: 5 });
            await eliminarUsuario(5);
            expect(spy).toHaveBeenCalledWith('/auth/usuarios/5');
        });
    });

    describe('asignarRol', () => {
        it('llama a PATCH /auth/usuarios/:id/rol con el rol', async () => {
            const spy = vi.spyOn(apiClient, 'patch').mockResolvedValue({ ...usuarioEjemplo, rol: 'director' });
            await asignarRol(1, 'director');
            expect(spy).toHaveBeenCalledWith('/auth/usuarios/1/rol', { rol: 'director' });
        });
    });
});
