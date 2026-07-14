import { Asignatura } from '../../domain/entities/course.entity';
import { PuedeAprobarAsignaturaSpecification } from '../../domain/specs/can-approve-course.specification';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { ServicioDesbloqueoCascada } from './unlock-cascading.service';

function crearAsignatura(
  id: string,
  estado: EstadoAsignatura,
  idsPrerequisitos: string[] = [],
) {
  return new Asignatura({ id, codigo: id, nombre: id, sct: 6, nivel: 1, estado, idsPrerequisitos });
}

describe('ServicioDesbloqueoCascada', () => {
  const specification = new PuedeAprobarAsignaturaSpecification();
  const servicio = new ServicioDesbloqueoCascada(specification);

  it('retorna lista vacia si no hay asignaturas bloqueadas que se desbloqueen', () => {
    const aprobada = crearAsignatura('A', EstadoAsignatura.Aprobada);
    const disponible = crearAsignatura('B', EstadoAsignatura.Disponible);

    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aprobada, [aprobada, disponible]);

    expect(resultado).toEqual([]);
  });

  it('retorna el id de una asignatura bloqueada cuyos prerequisitos quedan todos aprobados', () => {
    const aprobada = crearAsignatura('ICC-001', EstadoAsignatura.Aprobada);
    const bloqueada = crearAsignatura('ICC-002', EstadoAsignatura.Bloqueada, ['ICC-001']);

    // aprobada es la asignatura que acaba de ser aprobada
    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aprobada, [
      crearAsignatura('ICC-001', EstadoAsignatura.Disponible), // estado anterior en la lista
      bloqueada,
    ]);

    expect(resultado).toEqual(['ICC-002']);
  });

  it('no retorna asignaturas ya disponibles o aprobadas', () => {
    const aprobada = crearAsignatura('A', EstadoAsignatura.Aprobada);
    const yaDisponible = crearAsignatura('B', EstadoAsignatura.Disponible, ['A']);
    const yaAprobada = crearAsignatura('C', EstadoAsignatura.Aprobada, ['A']);

    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aprobada, [
      aprobada,
      yaDisponible,
      yaAprobada,
    ]);

    expect(resultado).toEqual([]);
  });

  it('no desbloquea una asignatura si aun le faltan prerequisitos por aprobar', () => {
    // A y B son prerequisitos de C; solo A se aprueba
    const aAprobada = crearAsignatura('A', EstadoAsignatura.Aprobada);
    const bDisponible = crearAsignatura('B', EstadoAsignatura.Disponible);
    const cBloqueada = crearAsignatura('C', EstadoAsignatura.Bloqueada, ['A', 'B']);

    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aAprobada, [
      crearAsignatura('A', EstadoAsignatura.Disponible),
      bDisponible,
      cBloqueada,
    ]);

    expect(resultado).toEqual([]);
  });

  it('desbloqueo en cadena: al aprobar A solo se desbloquea B, no C (que requiere B)', () => {
    // A→B→C: aprobar A desbloquea B, pero C sigue bloqueada porque B aun no esta aprobada
    const aDisponibleEnLista = crearAsignatura('A', EstadoAsignatura.Disponible);
    const aAprobada = crearAsignatura('A', EstadoAsignatura.Aprobada);
    const bBloqueada = crearAsignatura('B', EstadoAsignatura.Bloqueada, ['A']);
    const cBloqueada = crearAsignatura('C', EstadoAsignatura.Bloqueada, ['B']);

    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aAprobada, [
      aDisponibleEnLista,
      bBloqueada,
      cBloqueada,
    ]);

    expect(resultado).toEqual(['B']);
    expect(resultado).not.toContain('C');
  });

  it('desbloquea multiples asignaturas si todas sus prerequisitos quedan aprobados', () => {
    const aAprobada = crearAsignatura('A', EstadoAsignatura.Aprobada);
    const bBloqueada = crearAsignatura('B', EstadoAsignatura.Bloqueada, ['A']);
    const cBloqueada = crearAsignatura('C', EstadoAsignatura.Bloqueada, ['A']);

    const resultado = servicio.obtenerIdsAsignaturasDesbloqueadas(aAprobada, [
      crearAsignatura('A', EstadoAsignatura.Disponible),
      bBloqueada,
      cBloqueada,
    ]);

    expect(resultado).toContain('B');
    expect(resultado).toContain('C');
    expect(resultado).toHaveLength(2);
  });
});
