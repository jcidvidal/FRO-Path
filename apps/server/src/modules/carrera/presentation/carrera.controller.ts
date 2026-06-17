import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CarreraService } from '../application/carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { ReadCarreraDto } from './dto/read-carrera.dto';
import { Carrera } from '../domain/carrera';

@Controller('carrera')
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) { }

  @Post()
  async create(@Body() cuerpo: CreateCarreraDto): Promise<ReadCarreraDto> {
    const carrera = await this.carreraService.create(cuerpo);
    return this.mapearADto(carrera);
  }

  @Get()
  async findAll(): Promise<ReadCarreraDto[]> {
    const carreras = await this.carreraService.findAll();
    return carreras.map((c) => this.mapearADto(c));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadCarreraDto> {
    const carrera = await this.carreraService.findOne(id);
    return this.mapearADto(carrera);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() cuerpo: UpdateCarreraDto,
  ): Promise<ReadCarreraDto> {
    const carrera = await this.carreraService.update(id, cuerpo);
    return this.mapearADto(carrera);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.carreraService.remove(id);
  }

  private mapearADto(carrera: Carrera): ReadCarreraDto {
    return {
      id: carrera.id,
      nombre: carrera.nombre,
      codigo_carrera: carrera.codigo_carrera,
    };
  }
}
