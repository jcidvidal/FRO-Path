import { Asignatura } from '../../domain/entities/course.entity';
import { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { PuedeAprobarAsignaturaSpecification } from '../../domain/specs/can-approve-course.specification';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { ServicioDesbloqueoCascada } from '../services/unlock-cascading.service';
import { CambiarEstadoAsignaturaUseCase } from './change-course-status.use-case';

class RepositorioMallaFake implements PuertoRepositorioMalla {
  asignaturas = [
    new Asignatura({
      id: 'ICC-001',
      codigo: 'ICC-001',
      nombre: 'Programacion I',
      sct: 6,
      nivel: 1,
      estado: EstadoAsignatura.Disponible,
      idsPrerequisitos: [],
    }),
    new Asignatura({
      id: 'ICC-002',
      codigo: 'ICC-002',
      nombre: 'Programacion II',
      sct: 6,
      nivel: 2,
      estado: EstadoAsignatura.Bloqueada,
      idsPrerequisitos: ['ICC-001'],
    }),
  ];

  buscarPorCarrera(_idCarrera: string, _idUsuario: number): Promise<Asignatura[]> {
    return Promise.resolve(this.asignaturas);
  }

  guardarEstadoAsignatura(
    _idCarrera: string,
    asignatura: Asignatura,
    _idUsuario: number,
  ): Promise<Asignatura> {
    this.asignaturas = this.asignaturas.map((elemento) =>
      elemento.id === asignatura.id ? asignatura : elemento,
    );

    return Promise.resolve(asignatura);
  }

  limpiarProgreso(_idCarrera: string, _idUsuario: number): Promise<void> {
    return Promise.resolve();
  }
}

function crearCasoDeUso(repositorio: RepositorioMallaFake) {
  const specification = new PuedeAprobarAsignaturaSpecification();

  return new CambiarEstadoAsignaturaUseCase(
    repositorio,
    specification,
    new ServicioDesbloqueoCascada(specification),
  );
}

describe('CambiarEstadoAsignaturaUseCase', () => {
  it('desbloquea y persiste asignaturas disponibles al aprobar prerequisitos', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    const resultado = await casoDeUso.ejecutar(
      'icc',
      'ICC-001',
      EstadoAsignatura.Aprobada,
      1,
    );

    expect(resultado.idsAsignaturasDesbloqueadas).toEqual(['ICC-002']);
    expect(
      repositorio.asignaturas.find((asignatura) => asignatura.id === 'ICC-002')
        ?.estado,
    ).toBe(EstadoAsignatura.Disponible);
  });

  it('no desbloquea asignaturas cuando el nuevo estado no es aprobada', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    const resultado = await casoDeUso.ejecutar(
      'icc',
      'ICC-001',
      EstadoAsignatura.EnCurso,
      1,
    );

    expect(resultado.idsAsignaturasDesbloqueadas).toEqual([]);
    expect(
      repositorio.asignaturas.find((asignatura) => asignatura.id === 'ICC-002')
        ?.estado,
    ).toBe(EstadoAsignatura.Bloqueada);
  });
});
