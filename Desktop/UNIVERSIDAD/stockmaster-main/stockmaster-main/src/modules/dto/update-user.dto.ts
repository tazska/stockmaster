import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../modules/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
