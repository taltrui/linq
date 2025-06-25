import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus, Prisma, Quotation } from '@prisma';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) { }

  async createFromQuotation(quotation: Quotation) {
    const { clientId, ...restOfDto } = quotation;

    return this.prisma.job.create({
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
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, companyId: string) {
    await this.findOne(id, companyId);
    const data: Prisma.JobUpdateInput = updateJobDto;

    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

}
