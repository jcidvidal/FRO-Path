import { EstadoAsignatura } from '../value-objects/course-status.vo';
import { Asignatura } from './course.entity';

function crearAsignatura(estado = EstadoAsignatura.Disponible) {
  return new Asignatura({
    id: 'ICC-001',
    codigo: 'ICC-001',
    nombre: 'Programacion I',
    sct: 6,
    nivel: 1,
    estado,
    idsPrerequisitos: ['BASE-001'],
  });
}

describe('Asignatura', () => {
  it('expone sus propiedades a traves de getters', () => {
    const asignatura = crearAsignatura();

    expect(asignatura.id).toBe('ICC-001');
    expect(asignatura.codigo).toBe('ICC-001');
    expect(asignatura.nombre).toBe('Programacion I');
    expect(asignatura.sct).toBe(6);
    expect(asignatura.nivel).toBe(1);
    expect(asignatura.estado).toBe(EstadoAsignatura.Disponible);
    expect(asignatura.idsPrerequisitos).toEqual(['BASE-001']);
  });

  it('idsPrerequisitos retorna una copia y no la referencia interna', () => {
    const asignatura = crearAsignatura();
    const prerequisitos = asignatura.idsPrerequisitos;
    prerequisitos.push('MUTADO');

    expect(asignatura.idsPrerequisitos).toEqual(['BASE-001']);
  });

  it('aprobar retorna una nueva instancia en estado Aprobada sin mutar la original', () => {
    const asignatura = crearAsignatura();
    const aprobada = asignatura.aprobar();

    expect(aprobada).not.toBe(asignatura);
    expect(aprobada.estado).toBe(EstadoAsignatura.Aprobada);
    expect(asignatura.estado).toBe(EstadoAsignatura.Disponible);
  });

  it('conEstado retorna una nueva instancia con el estado indicado', () => {
    const asignatura = crearAsignatura();
    const enCurso = asignatura.conEstado(EstadoAsignatura.EnCurso);

    expect(enCurso.estado).toBe(EstadoAsignatura.EnCurso);
    expect(enCurso.id).toBe('ICC-001');
  });

  it('aPrimitivos devuelve un objeto plano con todas las propiedades', () => {
    const primitivos = crearAsignatura(EstadoAsignatura.Reprobada).aPrimitivos();

    expect(primitivos).toEqual({
      id: 'ICC-001',
      codigo: 'ICC-001',
      nombre: 'Programacion I',
      sct: 6,
      nivel: 1,
      estado: EstadoAsignatura.Reprobada,
      idsPrerequisitos: ['BASE-001'],
    });
  });
});
