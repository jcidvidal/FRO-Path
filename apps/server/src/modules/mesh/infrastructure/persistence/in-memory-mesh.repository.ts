import { Injectable } from '@nestjs/common';
import { Asignatura } from '../../domain/entities/course.entity';
import { PuertoRepositorioMalla, MallaCategorizada } from '../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../domain/value-objects/course-status.vo';

function estadoInicial(asignatura: Asignatura): EstadoAsignatura {
  return asignatura.idsPrerequisitos.length > 0
    ? EstadoAsignatura.Bloqueada
    : EstadoAsignatura.Disponible;
}

@Injectable()
export class RepositorioMallaEnMemoria implements PuertoRepositorioMalla {
  private readonly asignaturasPorCarrera = new Map<string, MallaCategorizada>([
    [
      'informatica',
      {
        asignaturas: [
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
        modulosIngles: [],
        practicas: [],
      },
    ],
  ]);

  buscarPorCarrera(idCarrera: string, _idUsuario: number): Promise<MallaCategorizada> {
    return Promise.resolve(this.asignaturasPorCarrera.get(idCarrera) ?? { asignaturas: [], modulosIngles: [], practicas: [] });
  }

  guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
    _idUsuario: number,
  ): Promise<Asignatura> {
    const malla = this.asignaturasPorCarrera.get(idCarrera);
    if (!malla) return Promise.resolve(asignatura);
    
    // Buscar en las tres categorías
    const actualizar = (items: Asignatura[]) => items.map(a => a.id === asignatura.id ? asignatura : a);
    
    this.asignaturasPorCarrera.set(idCarrera, {
      asignaturas: actualizar(malla.asignaturas),
      modulosIngles: actualizar(malla.modulosIngles),
      practicas: actualizar(malla.practicas),
    });

    return Promise.resolve(asignatura);
  }

  limpiarProgreso(idCarrera: string, _idUsuario: number): Promise<void> {
    const malla = this.asignaturasPorCarrera.get(idCarrera);
    if (!malla) return Promise.resolve();

    this.asignaturasPorCarrera.set(idCarrera, {
      asignaturas: malla.asignaturas.map(a => a.conEstado(estadoInicial(a))),
      modulosIngles: malla.modulosIngles.map(a => a.conEstado(estadoInicial(a))),
      practicas: malla.practicas.map(a => a.conEstado(estadoInicial(a))),
    });

    return Promise.resolve();
  }
}
