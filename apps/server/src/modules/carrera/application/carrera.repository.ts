import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Carrera } from '../domain/carrera';
import { CreateCarreraDto } from '../presentation/dto/create-carrera.dto';
import { UpdateCarreraDto } from '../presentation/dto/update-carrera.dto';
import { CarreraRegistro } from '../../mesh/infrastructure/persistence/postgres/postgres.entities';
import { obtenerDataSourceFroPath } from '../../mesh/infrastructure/persistence/postgres/postgres-data-source';

@Injectable()
export class CarreraRepository {
  private dataSource?: DataSource;

  async buscarTodos(): Promise<Carrera[]> {
    const ds = await this.obtenerDataSource();
    const carreras = await ds.getRepository<CarreraRegistro>('Carrera').find();
    return carreras.map((c) => this.mapear(c));
  }

  async buscarPorId(id: string): Promise<Carrera | null> {
    const ds = await this.obtenerDataSource();
    const carrera = await ds
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({ where: { id } });
    return carrera ? this.mapear(carrera) : null;
  }

  async buscarPorCodigo(codigo_carrera: string): Promise<Carrera | null> {
    const ds = await this.obtenerDataSource();
    const carrera = await ds
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({ where: { codigo: codigo_carrera } });
    return carrera ? this.mapear(carrera) : null;
  }

  async crear(entrada: CreateCarreraDto): Promise<Carrera> {
    const ds = await this.obtenerDataSource();
    const guardada = await ds.getRepository<CarreraRegistro>('Carrera').save({
      nombre: entrada.nombre,
      codigo: entrada.codigo_carrera,
    });

    return this.mapear(guardada);
  }

  async actualizar(id: string, entrada: UpdateCarreraDto): Promise<Carrera> {
    const ds = await this.obtenerDataSource();
    const repo = ds.getRepository<CarreraRegistro>('Carrera');

    const existente = await repo.findOneOrFail({ where: { id } });

    if (entrada.nombre) {
      existente.nombre = entrada.nombre;
    }
    if (entrada.codigo_carrera) {
      existente.codigo = entrada.codigo_carrera;
    }

    const guardada = await repo.save(existente);
    return this.mapear(guardada);
  }

  async eliminar(id: string): Promise<void> {
    const ds = await this.obtenerDataSource();
    await ds.getRepository<CarreraRegistro>('Carrera').delete(id);
  }

  // --- MÉTODOS PRIVADOS DE INFRAESTRUCTURA ---

  private async obtenerDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = await obtenerDataSourceFroPath();
    }
    return this.dataSource;
  }

  private mapear(carrera: CarreraRegistro): Carrera {
    return {
      id: carrera.id,
      nombre: carrera.nombre,
      codigo_carrera: carrera.codigo,
    };
  }
}
