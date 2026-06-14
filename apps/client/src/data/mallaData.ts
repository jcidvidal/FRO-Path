import type { Semester, Subject } from '../types/malla';

export const initialSemestres: Semester[] = [
    {
        numero: 1,
        asignaturas: [
            { id: 'ii-1-1', nombre: 'Introduccion a la Matematica', sct: 6, status: 'disponible' },
            { id: 'ii-1-2', nombre: 'Introduccion a la Fisica', sct: 5, status: 'disponible' },
            { id: 'ii-1-3', nombre: 'Introduccion a la Programacion', sct: 7, status: 'disponible' },
            { id: 'ii-1-4', nombre: 'Desarrollo de Habilidades Comunicacionales', sct: 5, status: 'disponible' },
            { id: 'ii-1-5', nombre: 'Desarrollo de Habilidades de Pensamiento', sct: 5, status: 'disponible' },
        ],
    },
    {
        numero: 2,
        asignaturas: [
            { id: 'ii-2-1', nombre: 'Matematica para Informatica I', sct: 6, status: 'disponible', prerrequisitos: ['ii-1-1'] },
            { id: 'ii-2-2', nombre: 'Fisica para Informatica', sct: 5, status: 'disponible', prerrequisitos: ['ii-1-2'] },
            { id: 'ii-2-3', nombre: 'Programacion Orientada a Objetos', sct: 7, status: 'disponible', prerrequisitos: ['ii-1-3'] },
            { id: 'ii-2-4', nombre: 'Acceso a Datos', sct: 6, status: 'disponible', prerrequisitos: ['ii-1-3'] },
            { id: 'ii-2-5', nombre: 'Electivo de Formacion General I', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 3,
        asignaturas: [
            { id: 'ii-3-1', nombre: 'Matematica para Informatica II', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-2-1'] },
            { id: 'ii-3-2', nombre: 'Estadistica Aplicada', sct: 7, status: 'bloqueado' },
            { id: 'ii-3-3', nombre: 'Lenguajes de Programacion', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-2-3'] },
            { id: 'ii-3-4', nombre: 'Electivo de Formacion General II', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 4,
        asignaturas: [
            { id: 'ii-4-1', nombre: 'Proyecto de Aplicacion', sct: 6, status: 'bloqueado' },
            { id: 'ii-4-2', nombre: 'Hardware y Sistemas Operativos', sct: 6, status: 'bloqueado' },
            { id: 'ii-4-3', nombre: 'Programacion Avanzada', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-3-3'] },
            { id: 'ii-4-4', nombre: 'Diseno de Bases de Datos', sct: 6, status: 'bloqueado', prerrequisitos: ['ii-2-4'] },
            { id: 'ii-4-5', nombre: 'Electivo de Formacion General III', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 5,
        asignaturas: [
            { id: 'ii-5-1', nombre: 'Comprension del Contexto Social', sct: 5, status: 'bloqueado' },
            { id: 'ii-5-2', nombre: 'Redes de Computadores', sct: 5, status: 'bloqueado', prerrequisitos: ['ii-4-2'] },
            { id: 'ii-5-3', nombre: 'Ingenieria de Software', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-4-1', 'ii-4-3'] },
            { id: 'ii-5-4', nombre: 'Especializacion Tecnologica I', sct: 7, status: 'bloqueado' },
            { id: 'ii-5-5', nombre: 'Ingles Tecnico I', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 6,
        asignaturas: [
            { id: 'ii-6-1', nombre: 'Diseno Interface Humano Computador', sct: 7, status: 'bloqueado' },
            { id: 'ii-6-2', nombre: 'Taller de Redes', sct: 5, status: 'bloqueado', prerrequisitos: ['ii-5-2'] },
            { id: 'ii-6-3', nombre: 'Ingenieria de Requerimientos', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-5-3'] },
            { id: 'ii-6-4', nombre: 'Especializacion Tecnologica II', sct: 6, status: 'bloqueado' },
            { id: 'ii-6-5', nombre: 'Taller de Habilidades Profesionales I', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 7,
        asignaturas: [
            { id: 'ii-7-1', nombre: 'Direccion de Proyectos', sct: 6, status: 'bloqueado' },
            { id: 'ii-7-2', nombre: 'Ciberseguridad', sct: 5, status: 'bloqueado', prerrequisitos: ['ii-5-2'] },
            { id: 'ii-7-3', nombre: 'Arquitectura de Software', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-5-3', 'ii-4-4'] },
            { id: 'ii-7-4', nombre: 'Ingenieria de Datos', sct: 7, status: 'bloqueado' },
            { id: 'ii-7-5', nombre: 'Electivo de Formacion General IV', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 8,
        asignaturas: [
            { id: 'ii-8-1', nombre: 'Proyecto de Investigacion e Innovacion', sct: 5, status: 'bloqueado' },
            { id: 'ii-8-2', nombre: 'Tecnicas de Seguridad Aplicada', sct: 5, status: 'bloqueado' },
            { id: 'ii-8-3', nombre: 'Pruebas de Software', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-7-3'] },
            { id: 'ii-8-4', nombre: 'Especializacion Tecnologica III', sct: 7, status: 'bloqueado' },
            { id: 'ii-8-5', nombre: 'Ingles Tecnico II', sct: 5, status: 'bloqueado' },
        ],
    },
    {
        numero: 9,
        asignaturas: [
            { id: 'ii-9-1', nombre: 'Gestion de Proyectos de Software', sct: 7, status: 'bloqueado', prerrequisitos: ['ii-7-1', 'ii-5-3'] },
            { id: 'ii-9-2', nombre: 'Proyecto de Integracion de Software', sct: 9, status: 'bloqueado' },
            { id: 'ii-9-3', nombre: 'Taller de Habilidades Profesionales II', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 10,
        asignaturas: [
            { id: 'ii-10-1', nombre: 'Actividad de Titulacion', sct: 30, status: 'bloqueado' },
        ],
    },
];

export const initialModulosIngles: Subject[] = [
    { id: 'ii-ing-1', nombre: 'Nivel Principiante', sct: 3, status: 'disponible' },
    { id: 'ii-ing-2', nombre: 'Nivel Basico', sct: 3, status: 'disponible' },
    { id: 'ii-ing-3', nombre: 'Nivel Pre Intermedio', sct: 3, status: 'bloqueado' },
    { id: 'ii-ing-4', nombre: 'Nivel Intermedio', sct: 3, status: 'bloqueado' },
];

export const initialPracticas: Subject[] = [
    { id: 'ii-prac-1', nombre: 'Practica I', sct: 9, status: 'disponible' },
    { id: 'ii-prac-2', nombre: 'Practica II', sct: 9, status: 'bloqueado' },
];
