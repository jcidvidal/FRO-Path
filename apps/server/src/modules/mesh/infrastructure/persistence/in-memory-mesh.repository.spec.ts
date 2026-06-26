import { Asignatura } from '../../domain/entities/course.entity';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { RepositorioMallaEnMemoria } from './in-memory-mesh.repository';

describe('RepositorioMallaEnMemoria', () => {
  let repositorio: RepositorioMallaEnMemoria;

  beforeEach(() => {
    repositorio = new RepositorioMallaEnMemoria();
  });

  it('buscarPorCarrera retorna las asignaturas de una carrera existente', async () => {
    const resultado = await repositorio.buscarPorCarrera('informatica', 1);

    expect(resultado.asignaturas.length).toBeGreaterThan(0);
    expect(resultado.asignaturas.map((a) => a.id)).toContain('programming-1');
  });

  it('buscarPorCarrera retorna lista vacia para una carrera inexistente', async () => {
    const resultado = await repositorio.buscarPorCarrera('no-existe', 1);

    expect(resultado).toEqual({ asignaturas: [], modulosIngles: [], practicas: [] });
  });

  it('guardarEstadoAsignatura reemplaza el estado de la asignatura persistida', async () => {
    const aprobada = new Asignatura({
      id: 'programming-1',
      codigo: 'INF-101',
      nombre: 'Programacion I',
      sct: 6,
      nivel: 1,
      estado: EstadoAsignatura.Aprobada,
      idsPrerequisitos: [],
    });

    await repositorio.guardarEstadoAsignatura('informatica', aprobada, 1);
    const resultado = await repositorio.buscarPorCarrera('informatica', 1);

    expect(
      resultado.asignaturas.find((a) => a.id === 'programming-1')?.estado,
    ).toBe(EstadoAsignatura.Aprobada);
  });

  it('limpiarProgreso restablece cada asignatura a su estado inicial segun prerequisitos', async () => {
    const aprobada = new Asignatura({
      id: 'programming-2',
      codigo: 'INF-102',
      nombre: 'Programacion II',
      sct: 6,
      nivel: 2,
      estado: EstadoAsignatura.Aprobada,
      idsPrerequisitos: ['programming-1'],
    });
    await repositorio.guardarEstadoAsignatura('informatica', aprobada, 1);

    await repositorio.limpiarProgreso('informatica', 1);
    const resultado = await repositorio.buscarPorCarrera('informatica', 1);

    const prog1 = resultado.asignaturas.find((a) => a.id === 'programming-1');
    const prog2 = resultado.asignaturas.find((a) => a.id === 'programming-2');
    expect(prog1?.estado).toBe(EstadoAsignatura.Disponible);
    expect(prog2?.estado).toBe(EstadoAsignatura.Bloqueada);
  });
});
