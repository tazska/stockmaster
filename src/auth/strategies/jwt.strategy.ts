import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;        // id del usuario
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Este método se llama automáticamente si el token es válido.
   * Lo que retorne aquí queda en request.user
   */
  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}
