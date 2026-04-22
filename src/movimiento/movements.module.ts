import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { Movement } from './entities/movement.entity';
import { Producto } from '../producto/entities/producto.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Movement, Producto])],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
 