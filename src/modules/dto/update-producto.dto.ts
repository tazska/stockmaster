import { PartialType } from '@nestjs/swagger';
import { CreateProductoDto } from '../../modules/dto/create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
