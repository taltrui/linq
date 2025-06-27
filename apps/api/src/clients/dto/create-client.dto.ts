import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddressDto } from './address-dto';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsNotEmpty()
  address!: AddressDto;

  @IsEmail()
  @IsOptional()
  email?: string;
}
