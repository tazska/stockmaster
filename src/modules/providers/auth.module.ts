import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../../modules/controllers/auth.controller';
import { AuthService } from '../../modules/services/auth.service';
import { JwtStrategy } from '../../modules/strategies/jwt.strategy';
import { RefreshJwtStrategy } from '../../modules/strategies/refresh-jwt.strategy';
import { UsersModule } from '../../modules/providers/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT configurado de forma asíncrona para leer del .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 * 8 }, // 8 horas en segundos
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
