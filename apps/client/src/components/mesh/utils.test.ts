import { describe, it, expect } from 'vitest';
import { findSubjectById } from './utils';
import type { Semester, Subject } from '../../types/malla';

const semestres: Semester[] = [
  {
    numero: 1,
    asignaturas: [
      { id: 'A1', nombre: 'Cálculo', sct: 6, status: 'disponible' },
      { id: 'A2', nombre: 'Física', sct: 5, status: 'bloqueado' },
    ],
  },
  {
    numero: 2,
    asignaturas: [{ id: 'B1', nombre: 'Álgebra', sct: 4, status: 'aprobado' }],
  },
];

const modulosIngles: Subject[] = [
  { id: 'ENG-1', nombre: 'Inglés I', sct: 3, status: 'disponible' },
];

const practicas: Subject[] = [
  { id: 'PR-1', nombre: 'Práctica I', sct: 0, status: 'bloqueado' },
];

describe('findSubjectById', () => {
  it('encuentra una asignatura dentro de los semestres', () => {
    expect(findSubjectById(semestres, modulosIngles, practicas, 'A2')?.nombre).toBe(
      'Física',
    );
  });

  it('encuentra una asignatura en los módulos de inglés', () => {
    expect(
      findSubjectById(semestres, modulosIngles, practicas, 'ENG-1')?.nombre,
    ).toBe('Inglés I');
  });

  it('encuentra una asignatura en las prácticas', () => {
    expect(
      findSubjectById(semestres, modulosIngles, practicas, 'PR-1')?.nombre,
    ).toBe('Práctica I');
  });

  it('retorna null cuando el id no existe', () => {
    expect(findSubjectById(semestres, modulosIngles, practicas, 'ZZ')).toBeNull();
  });

  it('retorna null cuando el id es undefined o null', () => {
    expect(findSubjectById(semestres, modulosIngles, practicas)).toBeNull();
    expect(findSubjectById(semestres, modulosIngles, practicas, null)).toBeNull();
  });

  it('funciona cuando módulos de inglés y prácticas son undefined', () => {
    expect(findSubjectById(semestres, undefined, undefined, 'B1')?.nombre).toBe(
      'Álgebra',
    );
  });
});
