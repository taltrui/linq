import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
}