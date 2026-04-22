import {Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request,} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags, ApiParam,} from '@nestjs/swagger';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
 
@ApiTags('Movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}
 
  @Post()
  @Roles(Role.BODEGUERO)
  @ApiOperation({ summary: 'Registrar entrada o salida de inventario (solo BODEGUERO)' })
  create(@Body() dto: CreateMovementDto, @Request() req) {
    return this.movementsService.create(dto, req.user);
  }
 
  @Get()
  @Roles(Role.ADMIN, Role.BODEGUERO, Role.CONSULTOR)
  @ApiOperation({ summary: 'Listar todos los movimientos' })
  findAll() {
    return this.movementsService.findAll();
  }
 
  @Get(':id')
  @Roles(Role.ADMIN, Role.BODEGUERO, Role.CONSULTOR)
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movementsService.findOne(id);
  }
 
  @Get('product/:productId')
  @Roles(Role.ADMIN, Role.BODEGUERO, Role.CONSULTOR)
  @ApiOperation({ summary: 'Listar movimientos por producto' })
  @ApiParam({ name: 'productId', type: Number })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.movementsService.findByProduct(productId);
  }
}