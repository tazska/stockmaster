import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Busca un usuario por su ID
   */
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  /**
   * Valida que un usuario exista y esté activo
   */
  async validateUserIsActive(userId: number): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return user;
  }

  /**
   * Crea un nuevo usuario con password hasheado
   */
  async create(dto: CreateUserDto): Promise<User> {
    // Verificar que el email no exista
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear y guardar el usuario
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Obtiene todos los usuarios activos
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isActive: true },
      order: { creadoEn: 'DESC' },
    });
  }

  /**
   * Obtiene un usuario por ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Actualiza un usuario
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si viene una contraseña nueva, hashearlo
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Merge y guardar
    const updatedUser = this.usersRepository.merge(user, dto);
    return this.usersRepository.save(updatedUser);
  }

  /**
   * Soft delete: marca un usuario como inactivo
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
