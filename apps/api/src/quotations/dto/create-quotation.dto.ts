import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateQuotationItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @IsPositive()
  unitPrice!: number;
}

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items!: CreateQuotationItemDto[];

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
