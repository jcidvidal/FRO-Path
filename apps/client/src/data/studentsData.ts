import type { Semester } from '../types/malla';

export interface Student {
    id: string;
    nombre: string;
    rut: string;
    email: string;
    carrera: string;
    semestres: Semester[];
}

const baseBloqueados = (prefix: string): Semester[] => [
    {
        numero: 5,
        asignaturas: [
            { id: `${prefix}-5-1`, nombre: 'Comprension del Contexto Social', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-5-2`, nombre: 'Redes de Computadores', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-5-3`, nombre: 'Ingenieria de Software', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-5-4`, nombre: 'Especializacion Tecnologica I', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-5-5`, nombre: 'Ingles Tecnico I', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 6,
        asignaturas: [
            { id: `${prefix}-6-1`, nombre: 'Diseno Interface Humano Computador', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-6-2`, nombre: 'Taller de Redes', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-6-3`, nombre: 'Ingenieria de Requerimientos', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-6-4`, nombre: 'Especializacion Tecnologica II', sct: 6, status: 'bloqueado' },
            { id: `${prefix}-6-5`, nombre: 'Taller de Habilidades Profesionales I', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 7,
        asignaturas: [
            { id: `${prefix}-7-1`, nombre: 'Direccion de Proyectos', sct: 6, status: 'bloqueado' },
            { id: `${prefix}-7-2`, nombre: 'Ciberseguridad', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-7-3`, nombre: 'Arquitectura de Software', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-7-4`, nombre: 'Ingenieria de Datos', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-7-5`, nombre: 'Electivo de Formacion General IV', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 8,
        asignaturas: [
            { id: `${prefix}-8-1`, nombre: 'Proyecto de Investigacion e Innovacion', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-8-2`, nombre: 'Tecnicas de Seguridad Aplicada', sct: 5, status: 'bloqueado' },
            { id: `${prefix}-8-3`, nombre: 'Pruebas de Software', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-8-4`, nombre: 'Especializacion Tecnologica III', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-8-5`, nombre: 'Ingles Tecnico II', sct: 5, status: 'bloqueado' },
        ],
    },
    {
        numero: 9,
        asignaturas: [
            { id: `${prefix}-9-1`, nombre: 'Gestion de Proyectos de Software', sct: 7, status: 'bloqueado' },
            { id: `${prefix}-9-2`, nombre: 'Proyecto de Integracion de Software', sct: 9, status: 'bloqueado' },
            { id: `${prefix}-9-3`, nombre: 'Taller de Habilidades Profesionales II', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 10,
        asignaturas: [
            { id: `${prefix}-10-1`, nombre: 'Actividad de Titulacion', sct: 30, status: 'bloqueado' },
        ],
    },
];

export const mockStudents: Student[] = [
    {
        id: '1',
        nombre: 'Estudiante Prueba',
        rut: '20.123.456-7',
        email: 'estud@ufromail.cl',
        carrera: 'Ingenieria Informatica',
        semestres: [
            {
                numero: 1,
                asignaturas: [
                    { id: 'ep-1-1', nombre: 'Introduccion a la Matematica', sct: 6, status: 'aprobado' },
                    { id: 'ep-1-2', nombre: 'Introduccion a la Fisica', sct: 5, status: 'aprobado' },
                    { id: 'ep-1-3', nombre: 'Introduccion a la Programacion', sct: 7, status: 'aprobado' },
                    { id: 'ep-1-4', nombre: 'Desarrollo de Habilidades Comunicacionales', sct: 5, status: 'aprobado' },
                    { id: 'ep-1-5', nombre: 'Desarrollo de Habilidades de Pensamiento', sct: 5, status: 'cursando' },
                ],
            },
            {
                numero: 2,
                asignaturas: [
                    { id: 'ep-2-1', nombre: 'Matematica para Informatica I', sct: 6, status: 'aprobado' },
                    { id: 'ep-2-2', nombre: 'Fisica para Informatica', sct: 5, status: 'aprobado' },
                    { id: 'ep-2-3', nombre: 'Programacion Orientada a Objetos', sct: 7, status: 'aprobado' },
                    { id: 'ep-2-4', nombre: 'Acceso a Datos', sct: 6, status: 'reprobado' },
                    { id: 'ep-2-5', nombre: 'Electivo de Formacion General I', sct: 3, status: 'aprobado' },
                ],
            },
            {
                numero: 3,
                asignaturas: [
                    { id: 'ep-3-1', nombre: 'Matematica para Informatica II', sct: 7, status: 'cursando' },
                    { id: 'ep-3-2', nombre: 'Estadistica Aplicada', sct: 7, status: 'cursando' },
                    { id: 'ep-3-3', nombre: 'Lenguajes de Programacion', sct: 7, status: 'cursando' },
                    { id: 'ep-3-4', nombre: 'Electivo de Formacion General II', sct: 3, status: 'cursando' },
                    { id: 'ep-3-5', nombre: 'Electivo de Formacion General III', sct: 3, status: 'disponible' },
                ],
            },
            {
                numero: 4,
                asignaturas: [
                    { id: 'ep-4-1', nombre: 'Proyecto de Aplicacion', sct: 7, status: 'disponible' },
                    { id: 'ep-4-2', nombre: 'Hardware y Sistemas Operativos', sct: 6, status: 'disponible' },
                    { id: 'ep-4-3', nombre: 'Programacion Avanzada', sct: 7, status: 'disponible' },
                    { id: 'ep-4-4', nombre: 'Diseno de Bases de Datos', sct: 6, status: 'disponible' },
                ],
            },
            ...baseBloqueados('ep'),
        ],
    },
    {
        id: '2',
        nombre: 'Maria Gonzalez',
        rut: '21.987.654-3',
        email: 'maria.g@ufromail.cl',
        carrera: 'Ingenieria Civil en Informatica',
        semestres: [
            {
                numero: 1,
                asignaturas: [
                    { id: 'mg-1-1', nombre: 'Introduccion a la Matematica', sct: 6, status: 'aprobado' },
                    { id: 'mg-1-2', nombre: 'Introduccion a la Fisica', sct: 5, status: 'aprobado' },
                    { id: 'mg-1-3', nombre: 'Introduccion a la Programacion', sct: 7, status: 'aprobado' },
                    { id: 'mg-1-4', nombre: 'Desarrollo de Habilidades Comunicacionales', sct: 5, status: 'aprobado' },
                    { id: 'mg-1-5', nombre: 'Desarrollo de Habilidades de Pensamiento', sct: 5, status: 'aprobado' },
                ],
            },
            {
                numero: 2,
                asignaturas: [
                    { id: 'mg-2-1', nombre: 'Matematica para Informatica I', sct: 6, status: 'aprobado' },
                    { id: 'mg-2-2', nombre: 'Fisica para Informatica', sct: 5, status: 'aprobado' },
                    { id: 'mg-2-3', nombre: 'Programacion Orientada a Objetos', sct: 7, status: 'aprobado' },
                    { id: 'mg-2-4', nombre: 'Acceso a Datos', sct: 6, status: 'aprobado' },
                    { id: 'mg-2-5', nombre: 'Electivo de Formacion General I', sct: 3, status: 'aprobado' },
                ],
            },
            {
                numero: 3,
                asignaturas: [
                    { id: 'mg-3-1', nombre: 'Matematica para Informatica II', sct: 7, status: 'aprobado' },
                    { id: 'mg-3-2', nombre: 'Estadistica Aplicada', sct: 7, status: 'aprobado' },
                    { id: 'mg-3-3', nombre: 'Lenguajes de Programacion', sct: 7, status: 'aprobado' },
                    { id: 'mg-3-4', nombre: 'Electivo de Formacion General II', sct: 3, status: 'cursando' },
                    { id: 'mg-3-5', nombre: 'Electivo de Formacion General III', sct: 3, status: 'cursando' },
                ],
            },
            {
                numero: 4,
                asignaturas: [
                    { id: 'mg-4-1', nombre: 'Proyecto de Aplicacion', sct: 7, status: 'cursando' },
                    { id: 'mg-4-2', nombre: 'Hardware y Sistemas Operativos', sct: 6, status: 'cursando' },
                    { id: 'mg-4-3', nombre: 'Programacion Avanzada', sct: 7, status: 'cursando' },
                    { id: 'mg-4-4', nombre: 'Diseno de Bases de Datos', sct: 6, status: 'cursando' },
                ],
            },
            ...baseBloqueados('mg'),
        ],
    },
];