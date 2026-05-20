import { SetMetadata } from '@nestjs/common';

/**
 * Decorator personalizado para configurar límites de throttle específicos
 * Uso: @Throttle(5, 60) = 5 intentos por 60 segundos
 */
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata('throttler_limit', limit) && SetMetadata('throttler_ttl', ttl);
