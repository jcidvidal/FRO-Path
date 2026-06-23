import { validateRut as validateRutFn} from "./rutValidator";

export type ValidationRule = (
    value: string,
    formValues?: Record<string, string>,
) => string | true;

export const required: ValidationRule = (value) => {
    return value.trim().length > 0 || 'Este campo es requerido';
};

export const minLength = (min: number): ValidationRule => {
    return (value) => {
        return value.length >= min || `Minimo ${min} caracteres`;
    };
};

export const rut: ValidationRule = (value) => { 
    if(value.trim().length ===0) return true;
    const result = validateRutFn(value);
    return result.isValid || result.error || 'RUT invalido. verifique el formato (ej: 12.345.678-9)';
};
export const matchesField = (fieldName: string, fieldLabel: string): ValidationRule => {
    return(value, formValues) =>{
        return formValues?.[fieldName] === value || `No coincide con ${fieldLabel}`;
    };
};

export const email: ValidationRule = (value) => {
    if(value.trim().length === 0)return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Correo invalido';
}