import type { Semester, Subject } from '../types/malla';

export const initialSemestres: Semester[] = [
    {
        numero: 1,
        asignaturas: [
            { id: '1-1', nombre: 'Introduccion a la Matematica', sct: 6, status: 'disponible' },
            { id: '1-2', nombre: 'Introduccion a la Fisica', sct: 5, status: 'disponible' },
            { id: '1-3', nombre: 'Introduccion a la Programacion', sct: 7, status: 'disponible' },
            { id: '1-4', nombre: 'Desarrollo de Habilidades Comunicacionales', sct: 5, status: 'disponible' },
            { id: '1-5', nombre: 'Desarrollo de Habilidades de Pensamiento', sct: 5, status: 'disponible' },
        ],
    },
    {
        numero: 2,
        asignaturas: [
            { id: '2-1', nombre: 'Matematica para Informatica I', sct: 6, status: 'bloqueado' },
            { id: '2-2', nombre: 'Fisica para Informatica', sct: 5, status: 'bloqueado' },
            { id: '2-3', nombre: 'Programacion Orientada a Objetos', sct: 7, status: 'bloqueado' },
            { id: '2-4', nombre: 'Acceso a Datos', sct: 6, status: 'bloqueado' },
            { id: '2-5', nombre: 'Electivo de Formacion General I', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 3,
        asignaturas: [
            { id: '3-1', nombre: 'Matematica para Informatica II', sct: 7, status: 'bloqueado' },
            { id: '3-2', nombre: 'Estadistica Aplicada', sct: 7, status: 'bloqueado' },
            { id: '3-3', nombre: 'Lenguajes de Programacion', sct: 7, status: 'bloqueado' },
            { id: '3-4', nombre: 'Electivo de Formacion General II', sct: 3, status: 'bloqueado' },
            { id: '3-5', nombre: 'Electivo de Formacion General III', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 4,
        asignaturas: [
            { id: '4-1', nombre: 'Proyecto de Aplicacion', sct: 7, status: 'bloqueado' },
            { id: '4-2', nombre: 'Hardware y Sistemas Operativos', sct: 6, status: 'bloqueado' },
            { id: '4-3', nombre: 'Programacion Avanzada', sct: 7, status: 'bloqueado' },
            { id: '4-4', nombre: 'Diseno de Bases de Datos', sct: 6, status: 'bloqueado' },
        ],
    },
    {
        numero: 5,
        asignaturas: [
            { id: '5-1', nombre: 'Comprension del Contexto Social', sct: 5, status: 'bloqueado' },
            { id: '5-2', nombre: 'Redes de Computadores', sct: 5, status: 'bloqueado' },
            { id: '5-3', nombre: 'Ingenieria de Software', sct: 7, status: 'bloqueado' },
            { id: '5-4', nombre: 'Especializacion Tecnologica I', sct: 7, status: 'bloqueado' },
            { id: '5-5', nombre: 'Ingles Tecnico I', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 6,
        asignaturas: [
            { id: '6-1', nombre: 'Diseno Interface Humano Computador', sct: 7, status: 'bloqueado' },
            { id: '6-2', nombre: 'Taller de Redes', sct: 5, status: 'bloqueado' },
            { id: '6-3', nombre: 'Ingenieria de Requerimientos', sct: 7, status: 'bloqueado' },
            { id: '6-4', nombre: 'Especializacion Tecnologica II', sct: 6, status: 'bloqueado' },
            { id: '6-5', nombre: 'Taller de Habilidades Profesionales I', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 7,
        asignaturas: [
            { id: '7-1', nombre: 'Direccion de Proyectos', sct: 6, status: 'bloqueado' },
            { id: '7-2', nombre: 'Ciberseguridad', sct: 5, status: 'bloqueado' },
            { id: '7-3', nombre: 'Arquitectura de Software', sct: 7, status: 'bloqueado' },
            { id: '7-4', nombre: 'Ingenieria de Datos', sct: 7, status: 'bloqueado' },
            { id: '7-5', nombre: 'Electivo de Formacion General IV', sct: 3, status: 'bloqueado' },
        ],
    },
    {
        numero: 8,
        asignaturas: [
            { id: '8-1', nombre: 'Proyecto de Investigacion e Innovacion', sct: 5, status: 'bloqueado' },
            { id: '8-2', nombre: 'Tecnicas de Seguridad Aplicada', sct: 5, status: 'bloqueado' },
            { id: '8-3', nombre: 'Pruebas de Software', sct: 7, status: 'bloqueado' },
            { id: '8-4', nombre: 'Especializacion Tecnologica III', sct: 7, status: 'bloqueado' },
            { id: '8-5', nombre: 'Ingles Tecnico II', sct: 5, status: 'bloqueado' },
        ],
    },
    {
        numero: 9,
        asignaturas: [
            { id: '9-1', nombre: 'Gestion de Proyectos de Software', sct: 7, status: 'bloqueado' },
            { id: '9-2', nombre: 'Proyecto de Integracion de Software', sct: 9, status: 'bloqueado' },
            { id: '9-3', nombre: 'Taller de Habilidades Profesionales II', sct: 4, status: 'bloqueado' },
        ],
    },
    {
        numero: 10,
        asignaturas: [
            { id: '10-1', nombre: 'Actividad de Titulacion', sct: 30, status: 'bloqueado' },
        ],
    },
];

export const initialModulosIngles: Subject[] = [
    { id: 'ing-1', nombre: 'Nivel Principiante', sct: 3, status: 'disponible' },
    { id: 'ing-2', nombre: 'Nivel Basico', sct: 3, status: 'bloqueado' },
    { id: 'ing-3', nombre: 'Nivel Pre Intermedio', sct: 3, status: 'bloqueado' },
    { id: 'ing-4', nombre: 'Nivel Intermedio', sct: 3, status: 'bloqueado' },
];

export const initialPracticas: Subject[] = [
    { id: 'prac-1', nombre: 'Practica I', sct: 5, status: 'bloqueado' },
    { id: 'prac-2', nombre: 'Practica II', sct: 5, status: 'bloqueado' },
];
