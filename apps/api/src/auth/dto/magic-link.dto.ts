import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestMagicLinkDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}

export class VerifyMagicLinkDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;
}
