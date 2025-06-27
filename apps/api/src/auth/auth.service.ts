import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Membership, User } from '@prisma';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<
    User & { memberships: Membership[] },
    'hashedPassword'
  > | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: true },
    });
    if (
      user &&
      user.hashedPassword &&
      (await bcrypt.compare(pass, user.hashedPassword))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User & { memberships: Membership[] }) {
    if (!user.memberships?.length) {
      throw new UnauthorizedException({
        code: 'USER_NOT_IN_COMPANY',
      });
    }
    const membership = user.memberships[0]!;
    const payload = {
      email: user.email,
      sub: user.id,
      companyId: membership.companyId,
      role: membership.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException({
        code: 'USER_ALREADY_EXISTS',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: registerDto.email,
          hashedPassword: await bcrypt.hash(registerDto.password, 10),
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });

      const newCompany = await tx.company.create({
        data: {
          name: registerDto.companyName,
          ownerId: newUser.id,
        },
      });

      const newMembership = await tx.membership.create({
        data: {
          userId: newUser.id,
          companyId: newCompany.id,
          role: Role.OWNER,
        },
      });

      return this.login({ ...newUser, memberships: [newMembership] });
    });
  }
}
