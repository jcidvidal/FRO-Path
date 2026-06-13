import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarreraService } from '../application/carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Controller('carrera')
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}

  @Post()
  create(@Body() cuerpo: CreateCarreraDto) {
    return this.carreraService.create(cuerpo);
  }

  @Get()
  findAll() {
    return this.carreraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carreraService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() cuerpo: UpdateCarreraDto) {
    return this.carreraService.update(id, cuerpo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carreraService.remove(id);
  }
}
