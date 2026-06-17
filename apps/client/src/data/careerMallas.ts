import type { Semester, Subject } from '../types/malla';

export interface CareerMalla {
    id: string;
    nombre: String;
    semestres: Semester[];
    modulosIngles: Subject[];
    practicas: Subject[];
}

const informaticaSemestres: Semester[] = [
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
            { id: 'ii-3-1', nombre: 'Matematica para Informatica II', sct: 7, status: 'disponible', prerrequisitos: ['ii-2-1'] },
            { id: 'ii-3-2', nombre: 'Estadistica Aplicada', sct: 7, status: 'disponible' },
            { id: 'ii-3-3', nombre: 'Lenguajes de Programacion', sct: 7, status: 'disponible', prerrequisitos: ['ii-2-3'] },
            { id: 'ii-3-4', nombre: 'Electivo de Formacion General II', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 4,
        asignaturas: [
            { id: 'ii-4-1', nombre: 'Proyecto de Aplicacion', sct: 6, status: 'disponible' },
            { id: 'ii-4-2', nombre: 'Hardware y Sistemas Operativos', sct: 6, status: 'disponible' },
            { id: 'ii-4-3', nombre: 'Programacion Avanzada', sct: 7, status: 'disponible', prerrequisitos: ['ii-3-3'] },
            { id: 'ii-4-4', nombre: 'Diseno de Bases de Datos', sct: 6, status: 'disponible', prerrequisitos: ['ii-2-4'] },
            { id: 'ii-4-5', nombre: 'Electivo de Formacion General III', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 5,
        asignaturas: [
            { id: 'ii-5-1', nombre: 'Comprension del Contexto Social', sct: 5, status: 'disponible' },
            { id: 'ii-5-2', nombre: 'Redes de Computadores', sct: 5, status: 'disponible', prerrequisitos: ['ii-4-2'] },
            { id: 'ii-5-3', nombre: 'Ingenieria de Software', sct: 7, status: 'disponible', prerrequisitos: ['ii-4-1', 'ii-4-3'] },
            { id: 'ii-5-4', nombre: 'Especializacion Tecnologica I', sct: 7, status: 'disponible' },
            { id: 'ii-5-5', nombre: 'Ingles Tecnico I', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 6,
        asignaturas: [
            { id: 'ii-6-1', nombre: 'Diseno Interface Humano Computador', sct: 7, status: 'disponible' },
            { id: 'ii-6-2', nombre: 'Taller de Redes', sct: 5, status: 'disponible', prerrequisitos: ['ii-5-2'] },
            { id: 'ii-6-3', nombre: 'Ingenieria de Requerimientos', sct: 7, status: 'disponible', prerrequisitos: ['ii-5-3'] },
            { id: 'ii-6-4', nombre: 'Especializacion Tecnologica II', sct: 6, status: 'disponible' },
            { id: 'ii-6-5', nombre: 'Taller de Habilidades Profesionales I', sct: 4, status: 'disponible' },
        ],
    },
    {
        numero: 7,
        asignaturas: [
            { id: 'ii-7-1', nombre: 'Direccion de Proyectos', sct: 6, status: 'disponible' },
            { id: 'ii-7-2', nombre: 'Ciberseguridad', sct: 5, status: 'disponible', prerrequisitos: ['ii-5-2'] },
            { id: 'ii-7-3', nombre: 'Arquitectura de Software', sct: 7, status: 'disponible', prerrequisitos: ['ii-5-3', 'ii-4-4'] },
            { id: 'ii-7-4', nombre: 'Ingenieria de Datos', sct: 7, status: 'disponible' },
            { id: 'ii-7-5', nombre: 'Electivo de Formacion General IV', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 8,
        asignaturas: [
            { id: 'ii-8-1', nombre: 'Proyecto de Investigacion e Innovacion', sct: 5, status: 'disponible' },
            { id: 'ii-8-2', nombre: 'Tecnicas de Seguridad Aplicada', sct: 5, status: 'disponible' },
            { id: 'ii-8-3', nombre: 'Pruebas de Software', sct: 7, status: 'disponible', prerrequisitos: ['ii-7-3'] },
            { id: 'ii-8-4', nombre: 'Especializacion Tecnologica III', sct: 7, status: 'disponible' },
            { id: 'ii-8-5', nombre: 'Ingles Tecnico II', sct: 5, status: 'disponible' },
        ],
    },
    {
        numero: 9,
        asignaturas: [
            { id: 'ii-9-1', nombre: 'Gestion de Proyectos de Software', sct: 7, status: 'disponible', prerrequisitos: ['ii-7-1', 'ii-5-3'] },
            { id: 'ii-9-2', nombre: 'Proyecto de Integracion de Software', sct: 9, status: 'disponible' },
            { id: 'ii-9-3', nombre: 'Taller de Habilidades Profesionales II', sct: 4, status: 'disponible' },
        ],
    },
    {
        numero: 10,
        asignaturas: [
            { id: 'ii-10-1', nombre: 'Actividad de Titulacion', sct: 30, status: 'disponible' },
        ],
    },
];

const informaticaIngles: Subject[] = [
    { id: 'ii-ing-1', nombre: 'Nivel Principiante', sct: 3, status: 'disponible' },
    { id: 'ii-ing-2', nombre: 'Nivel Basico', sct: 3, status: 'disponible' },
    { id: 'ii-ing-3', nombre: 'Nivel Pre Intermedio', sct: 3, status: 'disponible' },
    { id: 'ii-ing-4', nombre: 'Nivel Intermedio', sct: 3, status: 'disponible' },
];

const informaticaPracticas: Subject[] = [
    { id: 'ii-prac-1', nombre: 'Practica I', sct: 9, status: 'disponible' },
    { id: 'ii-prac-2', nombre: 'Practica II', sct: 9, status: 'disponible' },
];

const civilSemestres: Semester[] = [
    {
        numero: 1,
        asignaturas: [
            { id: 'ic-1-1', nombre: 'Ingeniería y sociedad', sct: 4, status: 'disponible' },
            { id: 'ic-1-2', nombre: 'Fundamentos de Cálculo', sct: 6, status: 'disponible' },
            { id: 'ic-1-3', nombre: 'Álgebra', sct: 6, status: 'disponible' },
            { id: 'ic-1-4', nombre: 'Introduccion a la Química', sct: 5, status: 'disponible' },
            { id: 'ic-1-5', nombre: 'Habilidades comunicativas en Ingenieria', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 2,
        asignaturas: [
            { id: 'ic-2-1', nombre: 'Introduccion al Diseño de Ingenieria', sct: 5, status: 'disponible', prerrequisitos: ['ic-1-1'] },
            { id: 'ic-2-2', nombre: 'Cálculo en una variable', sct: 6, status: 'disponible', prerrequisitos: ['ic-1-2'] },
            { id: 'ic-2-3', nombre: 'Matematica para la Computacion', sct: 4, status: 'disponible', prerrequisitos: ['ic-1-3'] },
            { id: 'ic-2-4', nombre: 'Fisica I', sct: 6, status: 'disponible' },
            { id: 'ic-2-5', nombre: 'Laboratorio de Ciencias', sct: 5, status: 'disponible' },
        ],
    },
    {
        numero: 3,
        asignaturas: [
            { id: 'ic-3-1', nombre: 'Fundamentos de Ecodiseño', sct: 4, status: 'disponible', prerrequisitos: ['ic-2-1'] },
            { id: 'ic-3-2', nombre: 'Cálculo Multivariable', sct: 5, status: 'disponible', prerrequisitos: ['ic-2-1'] },
            { id: 'ic-3-3', nombre: 'Álgebra Lineal', sct: 5, status: 'disponible', prerrequisitos: ['ic-2-3'] },
            { id: 'ic-3-4', nombre: 'Física II', sct: 5, status: 'disponible', prerrequisitos: ['ic-2-4'] },
            { id: 'ic-3-5', nombre: 'Electivo de Ingenieria', sct: 3, status: 'disponible' },
            { id: 'ic-3-6', nombre: 'Taller de Programacion', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 4,
        asignaturas: [
            { id: 'ic-4-1', nombre: 'Taller de Diseño de Ingenieria', sct: 6, status: 'disponible', prerrequisitos: ['ic-3-3'] },
            { id: 'ic-4-2', nombre: 'Programacion Orientada a Objetos', sct: 5, status: 'disponible', prerrequisitos: ['ic-3-3'] },
            { id: 'ic-4-3', nombre: 'Ecuaciones Diferenciales', sct: 6, status: 'disponible', prerrequisitos: ['ic-3-1'] },
            { id: 'ic-4-4', nombre: 'Física III', sct: 5, status: 'disponible' },
            { id: 'ic-4-5', nombre: 'Taller de Computacion', sct: 4, status: 'disponible' },
            { id: 'ic-3-6', nombre: 'Electivo Formacion General I', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 5,
        asignaturas: [
            { id: 'ic-5-1', nombre: 'Economia y Finanzas Empresariales', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-5-2', nombre: 'Probabilidad y Estadistica para Ingenieria', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-5-3', nombre: 'Bases de Datos', sct: 4, status: 'disponible' },
            { id: 'ic-5-4', nombre: 'Internet y Sistemas Operativos', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-5-5', nombre: 'Algoritmos y Paradigmas', sct: 6, status: 'disponible' },
            { id: 'ic-3-6', nombre: 'Electivo Formacion General II', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 6,
        asignaturas: [
            { id: 'ic-6-1', nombre: 'Formulacion y Evaluacion de Proyectos', sct: 4, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-6-2', nombre: 'Ciencias de la Computacion', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-6-3', nombre: 'Taller de Bases de Datos', sct: 6, status: 'disponible' },
            { id: 'ic-6-4', nombre: 'Computación en la Nube', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-6-5', nombre: 'Ingenieria de Software', sct: 6, status: 'disponible' },
        ],
    },
    {
        numero: 7,
        asignaturas: [
            { id: 'ic-7-1', nombre: 'Diseño de Negocios Innovadores', sct: 4, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-7-2', nombre: 'Sistemas Inteligentes', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-7-3', nombre: 'Ingenieria de Datos', sct: 4, status: 'disponible' },
            { id: 'ic-7-4', nombre: 'Ciberseguridad', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-7-5', nombre: 'Diseño de Experiencia de Usuario', sct: 6, status: 'disponible' },
            { id: 'ic-7-6', nombre: 'Electivo Formacion General III', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 8,
        asignaturas: [
            { id: 'ic-8-1', nombre: 'Taller de Empresas Tecnologicas', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-8-2', nombre: 'Taller de Ingenieria de Datos', sct: 7, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-8-3', nombre: 'Taller de IoT y Robotica', sct: 5, status: 'disponible' },
            { id: 'ic-8-4', nombre: 'Taller de Ingenieria de Software', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-8-5', nombre: 'Taller de habilidades Profesionales', sct: 4, status: 'disponible' },
        ],
    },
    {
        numero: 9,
        asignaturas: [
            { id: 'ic-9-1', nombre: 'Diseño de proyecto de Ingenieria Informatica', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-9-2', nombre: 'Electivo de Especialidad I', sct: 4, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-9-3', nombre: 'Electivo de Especialidad II', sct: 4, status: 'disponible' },
            { id: 'ic-9-4', nombre: 'Direccion de Proyectos', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-9-5', nombre: 'Proyecto de Desarrollo de Software', sct: 7, status: 'disponible' },
            { id: 'ic-9-6', nombre: 'Electivo Formacion General IV', sct: 3, status: 'disponible' },
        ],
    },
    {
        numero: 10,
        asignaturas: [
            { id: 'ic-10-1', nombre: 'Capstone Multidiciplinario', sct: 5, status: 'disponible', prerrequisitos: ['ic-4-4'] },
            { id: 'ic-10-2', nombre: 'Electivo de Especialidad III', sct: 4, status: 'disponible', prerrequisitos: ['ic-4-1', 'ic-3-3'] },
            { id: 'ic-10-3', nombre: 'Investigacion Aplicada en Informatica', sct: 7, status: 'disponible' },
            { id: 'ic-10-4', nombre: 'Proyecto de Integracion de Informatica', sct: 6, status: 'disponible', prerrequisitos: ['ic-4-4', 'ic-3-4'] },
            { id: 'ic-10-5', nombre: 'Electivo de Especialidad IV', sct: 4, status: 'disponible' },
        ],
    },
    {
        numero: 11,
        asignaturas: [
            { id: 'ic-11-1', nombre: 'Actividad de Titulacion', sct: 29, status: 'disponible' },
        ],
    },
];

const civilIngles: Subject[] = [
    { id: 'ii-ing-1', nombre: 'Nivel Principiante', sct: 3, status: 'disponible' },
    { id: 'ii-ing-2', nombre: 'Nivel Basico', sct: 3, status: 'disponible' },
    { id: 'ii-ing-3', nombre: 'Nivel Pre Intermedio', sct: 3, status: 'disponible' },
    { id: 'ii-ing-4', nombre: 'Nivel Intermedio', sct: 3, status: 'disponible' },
];

const civilPracticas: Subject[] = [
    { id: 'ic-prac-1', nombre: 'Practica de Estudios I', sct: 6, status: 'disponible' },
    { id: 'ic-prac-2', nombre: 'Practica de Estudios II', sct: 6, status: 'disponible' },
];

export const careerMallas: CareerMalla[] = [
    {
        id: 'ing-informatica',
        nombre: 'Ingenieria Informatica',
        semestres: informaticaSemestres,
        modulosIngles: informaticaIngles,
        practicas: informaticaPracticas,
    },
    {
        id: 'ing-civil',
        nombre: 'Ingenieria Civil',
        semestres: civilSemestres,
        modulosIngles: civilIngles,
        practicas: civilPracticas,
    },
];