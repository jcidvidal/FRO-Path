import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Carrera } from '../domain/carrera';
import { CreateCarreraDto } from '../presentation/dto/create-carrera.dto';
import { UpdateCarreraDto } from '../presentation/dto/update-carrera.dto';
import { CarreraRepository } from './carrera.repository';

@Injectable()
export class CarreraService {
  constructor(private readonly carreraRepository: CarreraRepository) {}

  async create(dto: CreateCarreraDto): Promise<Carrera> {
    const existente = await this.carreraRepository.buscarPorCodigo(
      dto.codigo_carrera,
    );
    if (existente) {
      throw new ConflictException('El codigo de carrera ya esta registrado.');
    }
    return this.carreraRepository.crear(dto);
  }

  async findAll(): Promise<Carrera[]> {
    return this.carreraRepository.buscarTodos();
  }

  async findOne(id: string): Promise<Carrera> {
    const carrera = await this.carreraRepository.buscarPorId(id);
    if (!carrera) {
      throw new NotFoundException(`La carrera con ID ${id} no existe.`);
    }
    return carrera;
  }

  async update(id: string, dto: UpdateCarreraDto): Promise<Carrera> {
    await this.findOne(id);

    if (dto.codigo_carrera) {
      const existente = await this.carreraRepository.buscarPorCodigo(
        dto.codigo_carrera,
      );
      if (existente && existente.id !== id) {
        throw new ConflictException(
          'El codigo de carrera ya esta siendo usado.',
        );
      }
    }
    return this.carreraRepository.actualizar(id, dto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.carreraRepository.eliminar(id);
  }
}
