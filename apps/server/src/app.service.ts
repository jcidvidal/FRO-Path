import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  obtenerSaludo(): string {
    return 'FRO-Path API is running.';
  }
}
