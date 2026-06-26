import { Injectable } from '@nestjs/common';
import { EventoAsignaturaAprobada } from '../../domain/events/course-approved.event';

@Injectable()
export class ManejadorEventoAsignaturaAprobada {
  manejar(evento: EventoAsignaturaAprobada): void {
    void evento;
  }
}
