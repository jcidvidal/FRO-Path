import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventoAsignaturaAprobada } from '../../domain/events/course-approved.event';
import { REPOSITORIO_MALLA } from '../../domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { PuedeAprobarAsignaturaSpecification } from '../../domain/specs/can-approve-course.specification';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';
import { ServicioDesbloqueoCascada } from '../services/unlock-cascading.service';

@Injectable()
export class CambiarEstadoAsignaturaUseCase {
  constructor(
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
    private readonly puedeAprobarAsignatura: PuedeAprobarAsignaturaSpecification,
    private readonly servicioDesbloqueoCascada: ServicioDesbloqueoCascada,
  ) {}

  async ejecutar(
    idCarrera: string,
    idAsignatura: string,
    estado: EstadoAsignatura,
  ) {
    const asignaturas = await this.repositorioMalla.buscarPorCarrera(idCarrera);
    const asignatura = asignaturas.find(
      (elemento) => elemento.id === idAsignatura,
    );

    if (!asignatura) {
      throw new BadRequestException(`La asignatura ${idAsignatura} no existe.`);
    }

    if (
      estado === EstadoAsignatura.Aprobada &&
      !this.puedeAprobarAsignatura.seCumplePor(asignatura, asignaturas)
    ) {
      throw new BadRequestException(
        'Los prerequisitos de la asignatura no estan aprobados.',
      );
    }

    const asignaturaGuardada =
      await this.repositorioMalla.guardarEstadoAsignatura(
        idCarrera,
        asignatura.conEstado(estado),
      );

    const eventos =
      estado === EstadoAsignatura.Aprobada
        ? [new EventoAsignaturaAprobada(idCarrera, idAsignatura)]
        : [];

    return {
      asignatura: asignaturaGuardada.aPrimitivos(),
      idsAsignaturasDesbloqueadas:
        this.servicioDesbloqueoCascada.obtenerIdsAsignaturasDesbloqueadas(
          asignaturaGuardada,
          asignaturas,
        ),
      eventos,
    };
  }
}
