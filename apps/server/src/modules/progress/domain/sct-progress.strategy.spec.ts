import { Asignatura } from '../../mesh/domain/entities/course.entity';
import { EstadoAsignatura } from '../../mesh/domain/value-objects/course-status.vo';
import { EstrategiaProgresoSct } from './sct-progress.strategy';

function crearAsignatura(sct: number, estado: EstadoAsignatura) {
  return new Asignatura({
    id: Math.random().toString(),
    codigo: 'X',
    nombre: 'X',
    sct,
    nivel: 1,
    estado,
    idsPrerequisitos: [],
  });
}

describe('EstrategiaProgresoSct', () => {
  const estrategia = new EstrategiaProgresoSct();

  it('calcula sctTotales sumando los creditos de todas las asignaturas', () => {
    const asignaturas = [
      crearAsignatura(6, EstadoAsignatura.Aprobada),
      crearAsignatura(4, EstadoAsignatura.Disponible),
      crearAsignatura(3, EstadoAsignatura.Bloqueada),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    expect(resultado.sctTotales).toBe(13);
  });

  it('calcula sctAprobados sumando solo las asignaturas aprobadas', () => {
    const asignaturas = [
      crearAsignatura(6, EstadoAsignatura.Aprobada),
      crearAsignatura(4, EstadoAsignatura.Aprobada),
      crearAsignatura(3, EstadoAsignatura.Disponible),
      crearAsignatura(2, EstadoAsignatura.Bloqueada),
      crearAsignatura(5, EstadoAsignatura.EnCurso),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    expect(resultado.sctAprobados).toBe(10);
  });

  it('calcula el porcentaje redondeado correctamente', () => {
    const asignaturas = [
      crearAsignatura(6, EstadoAsignatura.Aprobada),
      crearAsignatura(4, EstadoAsignatura.Disponible),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    // 6 / 10 = 0.6 → 60 %
    expect(resultado.porcentaje).toBe(60);
  });

  it('redondea el porcentaje al entero mas proximo', () => {
    // 1 aprobado de 3 totales → 33.33% → 33
    const asignaturas = [
      crearAsignatura(1, EstadoAsignatura.Aprobada),
      crearAsignatura(1, EstadoAsignatura.Disponible),
      crearAsignatura(1, EstadoAsignatura.Bloqueada),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    expect(resultado.porcentaje).toBe(33);
  });

  it('retorna 0 % si ninguna asignatura esta aprobada', () => {
    const asignaturas = [
      crearAsignatura(6, EstadoAsignatura.Disponible),
      crearAsignatura(4, EstadoAsignatura.Bloqueada),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    expect(resultado.sctAprobados).toBe(0);
    expect(resultado.porcentaje).toBe(0);
  });

  it('retorna 0 % y 0 SCT si la lista de asignaturas esta vacia (sctTotales = 0)', () => {
    const resultado = estrategia.calcular([]).aPrimitivos();

    expect(resultado.sctTotales).toBe(0);
    expect(resultado.sctAprobados).toBe(0);
    expect(resultado.porcentaje).toBe(0);
  });

  it('retorna 100 % si todas las asignaturas estan aprobadas', () => {
    const asignaturas = [
      crearAsignatura(6, EstadoAsignatura.Aprobada),
      crearAsignatura(4, EstadoAsignatura.Aprobada),
    ];

    const resultado = estrategia.calcular(asignaturas).aPrimitivos();

    expect(resultado.porcentaje).toBe(100);
  });
});
