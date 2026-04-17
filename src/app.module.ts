import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ── Variables de entorno ─────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,       // disponible en todos los módulos sin reimportar
      envFilePath: '.env',
    }),

    // ── Rate Limiting (Throttler) ────────────────────────────────
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,       // 60 segundos
          limit: 100,       // 100 requests por minuto (límite global)
        },
      ],
    }),

    // ── Base de datos MySQL con TypeORM ──────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host:     config.get<string>('DB_HOST'),
        port:     config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production', // ⚠️ solo desarrollo
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    // ── Módulos de la aplicación ─────────────────────────────────
    AuthModule,
    // ProductsModule,    ← se agrega en la siguiente fase
    // CategoriesModule,
    // MovementsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
