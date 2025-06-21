import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JobStatus, Role } from '@prisma';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body() createJobDto: CreateJobDto,
    @CurrentUser() user: { id: string; companyId: string },
  ) {
    return this.jobsService.create(createJobDto, user.companyId, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: { companyId: string },
    @Query('status') status?: JobStatus,
    @Query('clientId') clientId?: string,
  ) {
    return this.jobsService.findAll(user.companyId, status, clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { companyId: string }) {
    return this.jobsService.findOne(id, user.companyId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.jobsService.update(id, updateJobDto, user.companyId);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: { companyId: string }) {
    return this.jobsService.remove(id, user.companyId);
  }
}
