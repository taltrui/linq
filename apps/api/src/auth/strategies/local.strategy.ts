import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Membership, User } from '@prisma';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'hashedPassword'> & { memberships: Membership[] }> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
      });
    }
    return user;
  }
}
