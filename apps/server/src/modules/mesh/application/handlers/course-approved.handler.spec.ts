import { EventoAsignaturaAprobada } from '../../domain/events/course-approved.event';
import { ManejadorEventoAsignaturaAprobada } from './course-approved.handler';

describe('ManejadorEventoAsignaturaAprobada', () => {
  it('maneja el evento sin lanzar errores', () => {
    const manejador = new ManejadorEventoAsignaturaAprobada();
    const evento = new EventoAsignaturaAprobada('icc', 'ICC-001');

    expect(() => manejador.manejar(evento)).not.toThrow();
  });
});
