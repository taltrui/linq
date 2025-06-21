import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus, Prisma } from '@prisma';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createJobDto: CreateJobDto, companyId: string, userId: string) {
    // a validation to check if the client exists and belongs to the company
    const client = await this.prisma.client.findUnique({
      where: { id: createJobDto.clientId, companyId },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID "${createJobDto.clientId}" not found or does not belong to your company`,
      );
    }

    const lastJob = await this.prisma.job.findFirst({
      where: { companyId },
      orderBy: { displayId: 'desc' },
      select: { displayId: true },
    });

    const newDisplayId = lastJob
      ? (parseInt(lastJob.displayId, 10) + 1).toString()
      : '1';

    // Prisma's Decimal type expects a string or number. The DTO provides a string.
    const price = new Prisma.Decimal(createJobDto.price);

    const { clientId, ...restOfDto } = createJobDto;

    return this.prisma.job.create({
      data: {
        ...restOfDto,
        price,
        displayId: newDisplayId,
        company: {
          connect: { id: companyId },
        },
        createdBy: {
          connect: { id: userId },
        },
        client: {
          connect: { id: clientId },
        },
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

    const { price, ...restOfDto } = updateJobDto;
    const data: Prisma.JobUpdateInput = { ...restOfDto };

    if (price) {
      data.price = new Prisma.Decimal(price);
    }

    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
