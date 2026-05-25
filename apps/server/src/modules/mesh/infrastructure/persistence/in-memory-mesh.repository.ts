import { Injectable } from '@nestjs/common';
import { Asignatura } from '../../domain/entities/course.entity';
import { PuertoRepositorioMalla } from '../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

@Injectable()
export class RepositorioMallaEnMemoria implements PuertoRepositorioMalla {
  private readonly asignaturasPorCarrera = new Map<string, Asignatura[]>([
    [
      'informatica',
      [
        new Asignatura({
          id: 'programming-1',
          codigo: 'INF-101',
          nombre: 'Programacion I',
          sct: 6,
          nivel: 1,
          estado: EstadoAsignatura.Disponible,
          idsPrerequisitos: [],
        }),
        new Asignatura({
          id: 'programming-2',
          codigo: 'INF-102',
          nombre: 'Programacion II',
          sct: 6,
          nivel: 2,
          estado: EstadoAsignatura.Bloqueada,
          idsPrerequisitos: ['programming-1'],
        }),
      ],
    ],
  ]);

  buscarPorCarrera(idCarrera: string): Promise<Asignatura[]> {
    return Promise.resolve(this.asignaturasPorCarrera.get(idCarrera) ?? []);
  }

  guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
  ): Promise<Asignatura> {
    const asignaturas = this.asignaturasPorCarrera.get(idCarrera) ?? [];
    this.asignaturasPorCarrera.set(
      idCarrera,
      asignaturas.map((elemento) =>
        elemento.id === asignatura.id ? asignatura : elemento,
      ),
    );

    return Promise.resolve(asignatura);
  }
}
