import { EntitySchema } from 'typeorm';

export interface CarreraRegistro {
  id: number;
  codigo: string;
  nombre: string;
}

export interface AsignaturaRegistro {
  id: number;
  codigo_ramo: string;
  nombre: string;
  sct: number;
  nivel: number;
  carrera_id: number;
  categoria: string;  // 'malla' | 'ingles' | 'practica'
  carrera?: CarreraRegistro;
}

export interface PrerrequisitoRegistro {
  asignatura_id: number;
  requisito_id: number;
  asignatura?: AsignaturaRegistro;
  requisito?: AsignaturaRegistro;
}

export interface UsuarioRegistro {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  rol: string;
  carrera_id?: number | null;
  carrera?: CarreraRegistro | null;
}

export interface ProgresoAcademicoRegistro {
  usuario_id: number;
  asignatura_id: number;
  estado: string;
  usuario?: UsuarioRegistro;
  asignatura?: AsignaturaRegistro;
}

export const CarreraSchema = new EntitySchema<CarreraRegistro>({
  name: 'Carrera',
  tableName: 'carrera',
  columns: {
    id: { type: Number, primary: true, generated: true },
    codigo: { type: String, length: 10, unique: true },
    nombre: { type: String, length: 255 },
  },
});

export const AsignaturaSchema = new EntitySchema<AsignaturaRegistro>({
  name: 'Asignatura',
  tableName: 'asignatura',
  columns: {
    id: { type: Number, primary: true, generated: true },
    codigo_ramo: { type: String, length: 30, unique: true },
    nombre: { type: String, length: 255 },
    sct: { type: Number },
    nivel: { type: Number },
    carrera_id: { type: Number },
    categoria: { type: String, length: 20, default: 'malla' },
  },
  relations: {
    carrera: {
      type: 'many-to-one',
      target: 'Carrera',
      joinColumn: { name: 'carrera_id' },
    },
  },
});

export const PrerrequisitoSchema = new EntitySchema<PrerrequisitoRegistro>({
  name: 'Prerrequisito',
  tableName: 'prerrequisito',
  columns: {
    asignatura_id: { type: Number, primary: true },
    requisito_id: { type: Number, primary: true },
  },
  relations: {
    asignatura: {
      type: 'many-to-one',
      target: 'Asignatura',
      joinColumn: { name: 'asignatura_id' },
    },
    requisito: {
      type: 'many-to-one',
      target: 'Asignatura',
      joinColumn: { name: 'requisito_id' },
    },
  },
});

export const UsuarioSchema = new EntitySchema<UsuarioRegistro>({
  name: 'Usuario',
  tableName: 'usuario',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombre: { type: String, length: 40 },
    apellido_paterno: { type: String, length: 50 },
    apellido_materno: { type: String, length: 50 },
    email: { type: String, length: 140, unique: true },
    password: { type: String, length: 255 },
    rol: { type: String, length: 20, default: 'estudiante' },
    carrera_id: { type: Number, nullable: true },
  },
  relations: {
    carrera: {
      type: 'many-to-one',
      target: 'Carrera',
      joinColumn: { name: 'carrera_id' },
      nullable: true,
    },
  },
});

export const ProgresoAcademicoSchema =
  new EntitySchema<ProgresoAcademicoRegistro>({
    name: 'ProgresoAcademico',
    tableName: 'progreso_academico',
    columns: {
      usuario_id: { type: Number, primary: true },
      asignatura_id: { type: Number, primary: true },
      estado: {
        type: 'enum',
        enum: ['aprobada', 'reprobada', 'en_curso', 'bloqueada', 'disponible'],
      },
    },
    relations: {
      usuario: {
        type: 'many-to-one',
        target: 'Usuario',
        joinColumn: { name: 'usuario_id' },
      },
      asignatura: {
        type: 'many-to-one',
        target: 'Asignatura',
        joinColumn: { name: 'asignatura_id' },
      },
    },
  });
