import {
  Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';

@ApiTags('Categorías')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva categoría (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado (se requiere rol ADMIN)' })
  @ApiResponse({ status: 409, description: 'Ya existe una categoría con ese nombre' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.BODEGUERO, Role.CONSULTOR)
  @ApiOperation({ summary: 'Listar todas las categorías (todos los roles autenticados)' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.BODEGUERO, Role.CONSULTOR)
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }
}
