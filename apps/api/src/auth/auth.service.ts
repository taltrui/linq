import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Membership, User, MagicLink, Prisma } from '@prisma';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
    private readonly configService: ConfigService,
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

  async register(registerDto: Omit<RegisterDto, 'password'>) {
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

      await tx.membership.create({
        data: {
          userId: newUser.id,
          companyId: newCompany.id,
          role: Role.OWNER,
        },
      });

      // Create magic link within the transaction
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const magicLink = await tx.magicLink.create({
        data: {
          email: registerDto.email,
          userId: newUser.id,
          expiresAt,
        },
      });

      // Send emails after transaction succeeds
      await this.emailService.sendMagicLink(registerDto.email, magicLink.token);
      await this.emailService.sendWelcomeEmail(
        registerDto.email,
        registerDto.firstName,
      );

      return {
        message:
          'Account created successfully. Check your email for a magic link to sign in.',
        email: registerDto.email,
      };
    });
  }

  async requestMagicLink(email: string) {
    if (!email) {
      throw new BadRequestException({
        code: 'INVALID_EMAIL',
        message: 'Email is required',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message:
          'If an account exists with this email, a magic link has been sent.',
        email,
      };
    }

    const magicLink = await this.createMagicLink(email, user.id);
    await this.emailService.sendMagicLink(email, magicLink.token);

    return {
      message:
        'If an account exists with this email, a magic link has been sent.',
      email,
    };
  }

  private async createMagicLink(
    email: string,
    userId?: string,
    prismaClient: PrismaService | Prisma.TransactionClient = this.prisma,
  ): Promise<MagicLink> {
    // Expire any existing unused magic links for this email
    await prismaClient.magicLink.updateMany({
      where: {
        email,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      data: {
        expiresAt: new Date(),
      },
    });

    // Create new magic link
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    return prismaClient.magicLink.create({
      data: {
        email,
        userId,
        expiresAt,
      },
    });
  }

  async verifyMagicLink(token: string) {
    if (!token) {
      throw new BadRequestException({
        code: 'INVALID_TOKEN',
        message: 'Token is required',
      });
    }

    const magicLink = await this.prisma.magicLink.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (!magicLink) {
      throw new BadRequestException({
        code: 'INVALID_MAGIC_LINK',
        message: 'Invalid or expired magic link',
      });
    }

    if (magicLink.usedAt) {
      throw new BadRequestException({
        code: 'MAGIC_LINK_ALREADY_USED',
        message: 'This magic link has already been used',
      });
    }

    if (magicLink.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'MAGIC_LINK_EXPIRED',
        message: 'This magic link has expired',
      });
    }

    // Mark the magic link as used
    await this.prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { usedAt: new Date() },
    });

    // If user doesn't exist yet (shouldn't happen in normal flow)
    if (!magicLink.user) {
      throw new BadRequestException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return this.login(magicLink.user);
  }
}
