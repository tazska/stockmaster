import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from '../../modules/services/producto.service';
import { ProductoController } from '../../modules/controllers/producto.controller';
import { Producto } from '../../modules/entities/producto.entity';
import { Categoria } from '../../modules/entities/categoria.entity';
<<<<<<< HEAD

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria])],
=======
import { WebsocketModule } from '../../websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria]), WebsocketModule],
>>>>>>> 9bc0c74 (WebSockets)
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
