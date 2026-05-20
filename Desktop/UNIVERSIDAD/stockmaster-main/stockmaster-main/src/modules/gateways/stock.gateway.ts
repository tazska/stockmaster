import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Producto } from '../entities/producto.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    client.join('inventory');
  }

  handleDisconnect(client: Socket): void {
    // Connection disconnected
  }

  @SubscribeMessage('joinAdminRoom')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket): void {
    client.join('admins');
    client.emit('joinedAdminRoom', { room: 'admins' });
  }

  // Tarea 1 y 2: Agregar evento product:watch y unir al room
  @SubscribeMessage('product:watch')
  handleWatchProduct(@ConnectedSocket() client: Socket, @MessageBody() data: { id: number }): void {
    if (!data || !data.id) return;
    const room = `product:${data.id}`;
    client.join(room);
  }

  // Tarea 3: Agregar evento product:unwatch y salir del room
  @SubscribeMessage('product:unwatch')
  handleUnwatchProduct(@ConnectedSocket() client: Socket, @MessageBody() data: { id: number }): void {
    if (!data || !data.id) return;
    const room = `product:${data.id}`;
    client.leave(room);
  }

  sendLowStockAlert(product: Producto): void {
    if (!product || product.stockActual > (product.stockMinimo ?? 0)) {
      return;
    }

    this.server.to('admins').emit('lowStockAlert', {
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      stockActual: product.stockActual,
      stockMinimo: product.stockMinimo,
      categoria: product.categoria?.nombre,
      mensaje: `Stock bajo para ${product.nombre}`,
    });
  }

  emitProductCreated(producto: Producto): void {
    this.server.to('inventory').emit('product:created', producto);
  }

  emitProductUpdated(producto: Producto): void {
    this.server.to('inventory').emit('product:updated', producto);
    
    // Tarea 4: Emitir actualización específica al room del producto
    this.server.to(`product:${producto.id}`).emit('product:detailUpdate', producto);
  }

  emitProductDeleted(id: number): void {
    this.server.to('inventory').emit('product:deleted', { id });
  }
}
