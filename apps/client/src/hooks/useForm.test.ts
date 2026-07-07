import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';
import { required, minLength } from '../services/validators';

describe('useForm', () => {
    const initialValues = { name: '', email: '' };
    const validators = {
        name: [required],
        email: [required, minLength(5)],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe inicializar con valores iniciales y sin errores', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        expect(result.current.values).toEqual({ name: '', email: '' });
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
    });

    it('handleChange debe actualizar valores', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        act(() => {
            result.current.handleChange({
                target: { name: 'name', value: 'Juan' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.values).toEqual({ name: 'Juan', email: '' });
    });

    it('validateOnBlur debe validar el campo al hacer blur', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        act(() => {
            result.current.handleBlur({
                target: { name: 'name', value: '' },
            } as React.FocusEvent<HTMLInputElement>);
        });

        expect(result.current.touched.name).toBe(true);
        expect(result.current.errors.name).toBe('Este campo es requerido');
    });

    it('validateOnBlur no debe marcar error si el campo es válido', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        act(() => {
            result.current.handleBlur({
                target: { name: 'email', value: 'a@b.com' },
            } as React.FocusEvent<HTMLInputElement>);
        });

        expect(result.current.touched.email).toBe(true);
        expect(result.current.errors.email).toBeUndefined();
    });

    it('validateOnSubmit debe validar todos los campos', async () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        await act(async () => {
            result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent);
        });

        // Should have errors for both fields
        expect(result.current.errors.name).toBe('Este campo es requerido');
        expect(result.current.errors.email).toBe('Este campo es requerido');
        // onSubmit should NOT have been called
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('validateOnSubmit debe llamar onSubmit si todos los campos son válidos', async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useForm({
                initialValues: { name: 'Juan', email: 'a@b.com' },
                validators,
                onSubmit,
            }),
        );

        await act(async () => {
            result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent);
        });

        expect(onSubmit).toHaveBeenCalledWith({ name: 'Juan', email: 'a@b.com' });
        expect(result.current.errors).toEqual({});
    });

    it('setFieldError debe establecer un error en un campo específico', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        act(() => {
            result.current.setFieldError('name', 'Error personalizado');
        });

        expect(result.current.errors.name).toBe('Error personalizado');
    });

    it('resetForm debe restaurar el estado inicial', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        act(() => {
            result.current.setFieldError('name', 'Error');
            result.current.handleChange({
                target: { name: 'name', value: 'Juan' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        act(() => {
            result.current.resetForm();
        });

        expect(result.current.values).toEqual({ name: '', email: '' });
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
    });

    it('handleChange debe limpiar error cuando el campo está tocado y es válido', () => {
        const onSubmit = vi.fn();
        const { result } = renderHook(() =>
            useForm({ initialValues, validators, onSubmit }),
        );

        // First touch the field to trigger validation
        act(() => {
            result.current.handleBlur({
                target: { name: 'name', value: '' },
            } as React.FocusEvent<HTMLInputElement>);
        });
        expect(result.current.errors.name).toBe('Este campo es requerido');

        // Then change the value to a valid one
        act(() => {
            result.current.handleChange({
                target: { name: 'name', value: 'Juan' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.errors.name).toBeUndefined();
    });

    it('isSubmitting debe ser true durante el submit', async () => {
        let resolvePromise: () => void = () => { };
        const onSubmit = vi.fn().mockImplementation(() => {
            return new Promise<void>((resolve) => {
                resolvePromise = resolve;
            });
        });

        const { result } = renderHook(() =>
            useForm({
                initialValues: { name: 'Juan', email: 'a@b.com' },
                validators,
                onSubmit,
            }),
        );

        await act(async () => {
            result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent);
        });

        expect(result.current.isSubmitting).toBe(true);

        await act(async () => {
            resolvePromise();
        });

        expect(result.current.isSubmitting).toBe(false);
    });
});
