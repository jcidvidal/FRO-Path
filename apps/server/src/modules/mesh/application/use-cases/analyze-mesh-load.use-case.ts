import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ANALISIS_IA } from '../../domain/ports/ai-analysis.port';
import type { PuertoAnalisisIa } from '../../domain/ports/ai-analysis.port';
import { REPOSITORIO_MALLA } from '../../domain/ports/mesh-repository.port';
import type { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { clasificarCargaAcademica } from '../../domain/services/clasificar-carga-academica';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

@Injectable()
export class AnalizarCargaMallaUseCase {
  constructor(
    @Inject(ANALISIS_IA)
    private readonly analisisIa: PuertoAnalisisIa,
    @Inject(REPOSITORIO_MALLA)
    private readonly repositorioMalla: PuertoRepositorioMalla,
  ) {}

  async ejecutar(idCarrera: string, idUsuario: number) {
    const asignaturas = await this.repositorioMalla.buscarPorCarrera(
      idCarrera,
      idUsuario,
    );

    if (asignaturas.length === 0) {
      throw new NotFoundException(`La carrera ${idCarrera} no existe.`);
    }

    const enCurso = asignaturas.filter(
      (asignatura) => asignatura.estado === EstadoAsignatura.EnCurso,
    );
    const aprobadas = asignaturas.filter(
      (asignatura) => asignatura.estado === EstadoAsignatura.Aprobada,
    );

    const sctEnCurso = sumarSct(enCurso);
    const cantidadEnCurso = enCurso.length;

    const { nivel, ramosAdicionalesSugeridos } = clasificarCargaAcademica({
      cantidadEnCurso,
      sctEnCurso,
    });

    return this.analisisIa.analizar({
      idCarrera,
      sctEnCurso,
      cantidadEnCurso,
      sctAprobado: sumarSct(aprobadas),
      sctTotal: sumarSct(asignaturas),
      nivelCarga: nivel,
      ramosAdicionalesSugeridos,
    });
  }
}

function sumarSct(asignaturas: { sct: number }[]): number {
  return asignaturas.reduce((acc, asignatura) => acc + asignatura.sct, 0);
}
