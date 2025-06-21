import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  companyName!: string;
}
