import { type Address } from '@prisma';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: Address;

  @IsEmail()
  @IsOptional()
  email?: string;
}
