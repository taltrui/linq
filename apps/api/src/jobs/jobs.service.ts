import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus, Prisma, Quotation, Job } from '@prisma';

export interface AddMaterialToJobDto {
  itemId: string;
  quantityRequired: number;
}

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  async createFromQuotation(quotation: Quotation) {
    const { clientId, ...restOfDto } = quotation;

    return this.prisma.$transaction(async (tx) => {
      // Create the job
      const job = await tx.job.create({
        data: {
          ...restOfDto,
          companyId: quotation.companyId,
          clientId: clientId,
          quotations: {
            connect: { id: quotation.id },
          },
          status: 'PENDING',
        },
      });

      // Copy materials from quotation to job
      await this.copyMaterialsFromQuotation(job.id, quotation.id);

      return job;
    });
  }

  findAll(companyId: string, status?: JobStatus, clientId?: string) {
    const where: Prisma.JobWhereInput = { companyId };

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.job.findMany({
      where,
      include: {
        client: true,
      },
    });
  }

  async findOne(id: string, companyId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        assignedWorkers: { include: { user: true } },
        history: { include: { changedBy: true } },
        materials: {
          include: {
            item: {
              include: {
                supplier: true,
              },
            },
          },
        },
        inventoryTransactions: {
          include: {
            item: {
              select: {
                id: true,
                sku: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, companyId: string) {
    const existingJob = await this.findOne(id, companyId);

    // Check if status is changing and handle inventory lifecycle
    if (updateJobDto.status && updateJobDto.status !== existingJob.status) {
      return this.updateJobWithInventoryLifecycle(
        id,
        updateJobDto,
        existingJob,
      );
    }

    // Regular update without status change
    const data: Prisma.JobUpdateInput = updateJobDto;
    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  private async updateJobWithInventoryLifecycle(
    jobId: string,
    updateJobDto: UpdateJobDto,
    existingJob: Job,
  ) {
    const newStatus = updateJobDto.status;
    const oldStatus = existingJob.status;

    return this.prisma.$transaction(async (tx) => {
      // Handle status transitions
      if (oldStatus === 'PENDING' && newStatus === 'IN_PROGRESS') {
        await this.handleJobStart(jobId, existingJob, tx);
      } else if (oldStatus === 'IN_PROGRESS' && newStatus === 'COMPLETED') {
        await this.handleJobCompletion(jobId, existingJob, tx);
      } else if (newStatus === 'CANCELED' && oldStatus === 'IN_PROGRESS') {
        await this.handleJobCancellation(jobId);
      }

      // Update the job status
      return tx.job.update({
        where: { id: jobId },
        data: updateJobDto,
        include: {
          client: true,
          materials: {
            include: {
              item: true,
            },
          },
        },
      });
    });
  }

  private async handleJobStart(
    jobId: string,
    _job: Job,
    tx: Prisma.TransactionClient,
  ) {
    // Get materials for this job
    const materials = await tx.jobMaterial.findMany({
      where: { jobId },
      include: { item: true },
    });

    if (materials.length === 0) {
      // No materials to reserve
      return;
    }

    // Check material availability before reserving
    for (const material of materials) {
      const stockLevels = await this.inventoryService.getAggregatedStockLevels(
        material.itemId,
      );

      if (stockLevels.availableQuantity < material.quantityRequired) {
        throw new BadRequestException(
          `Insufficient stock for ${material.item.name}. Available: ${stockLevels.availableQuantity}, Required: ${material.quantityRequired}`,
        );
      }
    }

    // Reserve materials
    const materialData = materials.map((m) => ({
      itemId: m.itemId,
      quantity: m.quantityRequired,
    }));

    await this.inventoryService.reserveMaterialsForJob(jobId, materialData);
  }

  private async handleJobCompletion(
    jobId: string,
    _job: Job,
    tx: Prisma.TransactionClient,
  ) {
    // Get materials for this job
    const materials = await tx.jobMaterial.findMany({
      where: { jobId },
    });

    if (materials.length === 0) {
      return;
    }

    // Consume materials (this will compensate reservations and record consumption)
    const materialData = materials.map((m) => ({
      itemId: m.itemId,
      quantity: m.quantityUsed || m.quantityRequired, // Use actual quantity used or planned quantity
    }));

    await this.inventoryService.consumeMaterialsForJob(jobId, materialData);
  }

  private async handleJobCancellation(jobId: string) {
    // Cancel reservations
    await this.inventoryService.cancelReservationsForJob(jobId);
  }

  async addMaterialToJob(
    jobId: string,
    addMaterialDto: AddMaterialToJobDto,
    companyId: string,
  ) {
    // Verify job exists and belongs to company
    const job = await this.findOne(jobId, companyId);

    if (job.status !== 'PENDING') {
      throw new BadRequestException(
        'Cannot add materials to a job that is not pending',
      );
    }

    // Check if material already exists in job
    const existingMaterial = await this.prisma.jobMaterial.findFirst({
      where: {
        jobId,
        itemId: addMaterialDto.itemId,
      },
    });

    if (existingMaterial) {
      throw new BadRequestException('Material already exists in this job');
    }

    // Create the material relationship
    return this.prisma.jobMaterial.create({
      data: {
        jobId,
        itemId: addMaterialDto.itemId,
        quantityRequired: addMaterialDto.quantityRequired,
      },
      include: {
        item: {
          include: {
            supplier: true,
          },
        },
      },
    });
  }

  async removeMaterialFromJob(
    jobId: string,
    itemId: string,
    companyId: string,
  ) {
    const job = await this.findOne(jobId, companyId);

    if (job.status !== 'PENDING') {
      throw new BadRequestException(
        'Cannot remove materials from a job that is not pending',
      );
    }

    const jobMaterial = await this.prisma.jobMaterial.findFirst({
      where: { jobId, itemId },
    });

    if (!jobMaterial) {
      throw new NotFoundException('Material not found in this job');
    }

    return this.prisma.jobMaterial.delete({
      where: { id: jobMaterial.id },
    });
  }

  async updateMaterialQuantity(
    jobId: string,
    itemId: string,
    quantityRequired: number,
    quantityUsed?: number,
    companyId?: string,
  ) {
    if (companyId) {
      await this.findOne(jobId, companyId);
    }

    const jobMaterial = await this.prisma.jobMaterial.findFirst({
      where: { jobId, itemId },
    });

    if (!jobMaterial) {
      throw new NotFoundException('Material not found in this job');
    }

    return this.prisma.jobMaterial.update({
      where: { id: jobMaterial.id },
      data: {
        quantityRequired,
        ...(quantityUsed !== undefined && { quantityUsed }),
      },
      include: {
        item: {
          include: {
            supplier: true,
          },
        },
      },
    });
  }

  async getJobMaterials(jobId: string, companyId: string) {
    await this.findOne(jobId, companyId);

    return this.prisma.jobMaterial.findMany({
      where: { jobId },
      include: {
        item: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        item: {
          name: 'asc',
        },
      },
    });
  }

  async copyMaterialsFromQuotation(jobId: string, quotationId: string) {
    // Get materials from the quotation
    const quoteMaterials = await this.prisma.quoteMaterial.findMany({
      where: { quotationId },
    });

    if (quoteMaterials.length === 0) {
      return [];
    }

    // Create job materials based on quotation materials
    const jobMaterialsData = quoteMaterials.map((qm) => ({
      jobId,
      itemId: qm.itemId,
      quantityRequired: qm.quantity,
    }));

    return this.prisma.jobMaterial.createMany({
      data: jobMaterialsData,
    });
  }
}
