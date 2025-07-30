import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Post,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import type { AddMaterialToJobDto } from './jobs.service';
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

  // Material management endpoints
  @Get(':id/materials')
  getJobMaterials(
    @Param('id') id: string,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.jobsService.getJobMaterials(id, user.companyId);
  }

  @Post(':id/materials')
  @Roles(Role.OWNER, Role.ADMIN)
  addMaterialToJob(
    @Param('id') id: string,
    @Body() addMaterialDto: AddMaterialToJobDto,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.jobsService.addMaterialToJob(
      id,
      addMaterialDto,
      user.companyId,
    );
  }

  @Patch(':id/materials/:itemId')
  @Roles(Role.OWNER, Role.ADMIN)
  updateMaterialQuantity(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantityRequired: number; quantityUsed?: number },
    @CurrentUser() user: { companyId: string },
  ) {
    return this.jobsService.updateMaterialQuantity(
      id,
      itemId,
      body.quantityRequired,
      body.quantityUsed,
      user.companyId,
    );
  }

  @Delete(':id/materials/:itemId')
  @Roles(Role.OWNER, Role.ADMIN)
  removeMaterialFromJob(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.jobsService.removeMaterialFromJob(id, itemId, user.companyId);
  }

  @Post(':id/copy-materials-from-quotation')
  @Roles(Role.OWNER, Role.ADMIN)
  copyMaterialsFromQuotation(
    @Param('id') id: string,
    @Body('quotationId') quotationId: string,
  ) {
    return this.jobsService.copyMaterialsFromQuotation(id, quotationId);
  }
}
