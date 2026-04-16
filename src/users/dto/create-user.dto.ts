import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail({}, { message: 'Debe ingresar un email válido' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @ApiProperty({ example: 'Segura123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ enum: Role, default: Role.CONSULTOR })
  @IsEnum(Role, { message: 'Rol no válido. Use: ADMIN, BODEGUERO o CONSULTOR' })
  rol: Role;
}
