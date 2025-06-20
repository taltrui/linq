import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    // Si passport-jwt lanza un error (token expirado, firma inválida, etc.)
    // info será una instancia de JsonWebTokenError o TokenExpiredError
    if (info) {
      throw new UnauthorizedException({
        code: 'TOKEN_INVALID_OR_EXPIRED',
        message: info.message,
      });
    }

    // Si hay un error explícito o el usuario no se encuentra (desde la estrategia)
    if (err || !user) {
      throw err || new UnauthorizedException({ code: 'GENERIC_UNAUTHORIZED' });
    }
    
    return user;
  }
} 