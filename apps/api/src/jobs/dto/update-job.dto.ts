import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from '@prisma';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
} 