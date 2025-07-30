import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestMagicLinkDto, VerifyMagicLinkDto } from './dto/magic-link.dto';
import {
  CurrentUser,
  type CurrentUserType,
} from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@CurrentUser() user: CurrentUserType) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: Omit<RegisterDto, 'password'>) {
    return this.authService.register(registerDto);
  }

  @Post('request-magic-link')
  async requestMagicLink(@Body() requestMagicLinkDto: RequestMagicLinkDto) {
    return this.authService.requestMagicLink(requestMagicLinkDto.email);
  }

  @Post('verify-magic-link')
  async verifyMagicLink(@Body() verifyMagicLinkDto: VerifyMagicLinkDto) {
    return this.authService.verifyMagicLink(verifyMagicLinkDto.token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
