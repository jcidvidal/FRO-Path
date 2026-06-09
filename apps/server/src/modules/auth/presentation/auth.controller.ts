import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() cuerpo: LoginDto) {
    return this.authService.login(cuerpo);
  }

  @Post('register')
  register(@Body() cuerpo: RegisterDto) {
    return this.authService.register(cuerpo);
  }
}
