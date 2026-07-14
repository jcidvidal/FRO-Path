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

  buscarPorCarrera(_idCarrera: string, _idUsuario: number): Promise<{ asignaturas: Asignatura[]; modulosIngles: Asignatura[]; practicas: Asignatura[] }> {
    return Promise.resolve({ asignaturas: this.asignaturas, modulosIngles: [], practicas: [] });
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

class RepositorioMallaVacioFake implements PuertoRepositorioMalla {
  buscarPorCarrera(_idCarrera: string, _idUsuario: number): Promise<{ asignaturas: Asignatura[]; modulosIngles: Asignatura[]; practicas: Asignatura[] }> {
    return Promise.resolve({ asignaturas: [], modulosIngles: [], practicas: [] });
  }

  guardarEstadoAsignatura(
    _idCarrera: string,
    asignatura: Asignatura,
    _idUsuario: number,
  ): Promise<Asignatura> {
    return Promise.resolve(asignatura);
  }

  limpiarProgreso(_idCarrera: string, _idUsuario: number): Promise<void> {
    return Promise.resolve();
  }
}

function crearCasoDeUso(repositorio: PuertoRepositorioMalla) {
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
  it('lanza BadRequestException si el estado proporcionado no es valido', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    await expect(
      casoDeUso.ejecutar('icc', 'ICC-001', 'estado_invalido' as EstadoAsignatura, 1),
    ).rejects.toThrow('El estado estado_invalido no es valido.');
  });

  it('lanza BadRequestException si la carrera no tiene asignaturas', async () => {
    const casoDeUso = crearCasoDeUso(new RepositorioMallaVacioFake());

    await expect(
      casoDeUso.ejecutar('no-existe', 'ICC-001', EstadoAsignatura.Aprobada, 1),
    ).rejects.toThrow('La carrera no-existe no existe.');
  });

  it('lanza BadRequestException si la asignatura no pertenece a la carrera', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    await expect(
      casoDeUso.ejecutar('icc', 'ICC-INEXISTENTE', EstadoAsignatura.Aprobada, 1),
    ).rejects.toThrow('La asignatura ICC-INEXISTENTE no existe.');
  });

  it('lanza BadRequestException si los prerequisitos no estan aprobados', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    // ICC-002 requires ICC-001 which is Disponible (not Aprobada)
    await expect(
      casoDeUso.ejecutar('icc', 'ICC-002', EstadoAsignatura.Aprobada, 1),
    ).rejects.toThrow('Los prerequisitos de la asignatura no estan aprobados.');
  });

  it('devuelve eventos de asignatura aprobada cuando el estado es Aprobada', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    const resultado = await casoDeUso.ejecutar(
      'icc',
      'ICC-001',
      EstadoAsignatura.Aprobada,
      1,
    );

    expect(resultado.eventos).toHaveLength(1);
    expect(resultado.eventos[0]).toMatchObject({ idCarrera: 'icc', idAsignatura: 'ICC-001' });
  });

  it('devuelve lista de eventos vacia cuando el estado no es Aprobada', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    const resultado = await casoDeUso.ejecutar(
      'icc',
      'ICC-001',
      EstadoAsignatura.Reprobada,
      1,
    );

    expect(resultado.eventos).toHaveLength(0);
  });

  it('persiste el nuevo estado de la asignatura cambiada', async () => {
    const repositorio = new RepositorioMallaFake();
    const casoDeUso = crearCasoDeUso(repositorio);

    const resultado = await casoDeUso.ejecutar(
      'icc',
      'ICC-001',
      EstadoAsignatura.EnCurso,
      1,
    );

    expect(resultado.asignatura.estado).toBe(EstadoAsignatura.EnCurso);
    expect(resultado.asignatura.id).toBe('ICC-001');
  });
});
