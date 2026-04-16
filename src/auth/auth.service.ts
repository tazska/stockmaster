import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ─── Registro ────────────────────────────────────────────────────────────────

  async register(dto: CreateUserDto) {
    // Verificar si el email ya existe
    const existe = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // Crear y guardar usuario
    const usuario = this.usersRepository.create({
      ...dto,
      password: passwordHash,
    });
    await this.usersRepository.save(usuario);

    // Retornar sin la contraseña
    const { password, ...resultado } = usuario;
    return resultado;
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    // Buscar usuario por email
    const usuario = await this.usersRepository.findOne({
      where: { email: dto.email, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar JWT
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }

  // ─── Perfil ──────────────────────────────────────────────────────────────────

  async getProfile(userId: number) {
    const usuario = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!usuario) throw new UnauthorizedException();
    const { password, ...perfil } = usuario;
    return perfil;
  }
}
