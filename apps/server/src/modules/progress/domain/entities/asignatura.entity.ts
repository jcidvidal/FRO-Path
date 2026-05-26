import { Estado } from '../enums/estados.enums';

export class Asignatura {
  id: number;
  nombre: string;
  nivel: number;
  sct: number;
  estado: Estado;

  constructor(
    id: number,
    nombre: string,
    nivel: number,
    sct: number,
    estado: Estado,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.nivel = nivel;
    this.sct = sct;
    this.estado = estado;
  }

  cambiarEstado(nuevoEstado: Estado): void {
    if (this.estado === Estado.BLOQUEADO) {
      return;
    } else {
      if (nuevoEstado !== this.estado) {
        this.estado = nuevoEstado;
      }
    }
  }

  presentarSct(): number {
    return this.sct;
  }
}
