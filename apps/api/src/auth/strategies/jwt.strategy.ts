import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { CurrentUserType } from '../decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    companyId: string;
    role: string;
  }) {
    const user = await this.usersService.findOne({ id: payload.sub }, { memberships: true });

    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
      });
    }

    const { hashedPassword, ...result } = user as CurrentUserType;

    return { ...result, companyId: payload.companyId, role: payload.role };
  }
}
