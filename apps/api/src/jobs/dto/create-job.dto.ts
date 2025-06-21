import { IsDateString, IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDecimal()
  @IsNotEmpty()
  price!: string; // Prisma uses Decimal, but class-validator expects a string for IsDecimal

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  clientId!: string;
}
