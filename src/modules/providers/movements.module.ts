import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from '../../modules/services/movements.service';
import { MovementsController } from '../../modules/controllers/movements.controller';
import { Movement } from '../../modules/entities/movement.entity';
import { Producto } from '../../modules/entities/producto.entity';
<<<<<<< HEAD
 
=======
import { WebsocketModule } from '../../websocket/websocket.module';

>>>>>>> 9bc0c74 (WebSockets)
@Module({
  imports: [TypeOrmModule.forFeature([Movement, Producto]), WebsocketModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
 