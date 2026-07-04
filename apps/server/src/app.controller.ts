import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly servicioApp: AppService) {}

  @Get()
  obtenerSaludo(): string {
    return this.servicioApp.obtenerSaludo();
  }
}
