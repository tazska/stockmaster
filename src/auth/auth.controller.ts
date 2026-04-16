import {
  Controller, Post, Get, Body, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está en uso' })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna access_token' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/profile  (ruta protegida de ejemplo)
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
