import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../modules/providers/auth.module';
import { CategoriaModule } from '../modules/providers/categoria.module';
import { ProductoModule } from '../modules/providers/producto.module';
import { MovementsModule } from '../modules/providers/movements.module';
<<<<<<< HEAD
=======
import { WebsocketModule } from '../websocket/websocket.module';
>>>>>>> 9bc0c74 (WebSockets)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60000, limit: 100 }],
    }),
    DatabaseModule,
    AuthModule,
    CategoriaModule,
    ProductoModule,
    MovementsModule,
<<<<<<< HEAD
=======
    WebsocketModule,
>>>>>>> 9bc0c74 (WebSockets)
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
