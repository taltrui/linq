import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma } from '@prisma';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, companyId: string) {
    const lastClient = await this.prisma.client.findFirst({
      where: { companyId },
      orderBy: { displayId: 'desc' },
      select: { displayId: true },
    });

    const address = await this.prisma.address.create({
      data: createClientDto.address,
    });

    const newDisplayId = lastClient
      ? (parseInt(lastClient.displayId, 10) + 1).toString()
      : '1';

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        address: {
          connect: { id: address.id },
        },
        displayId: newDisplayId,
        company: {
          connect: { id: companyId },
        },
      },
      include: {
        address: true,
      },
    });
  }

  findAll(companyId: string, search?: string) {
    const where: Prisma.ClientWhereInput = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        {
          address: {
            street: { contains: search, mode: 'insensitive' },
            city: { contains: search, mode: 'insensitive' },
            state: { contains: search, mode: 'insensitive' },
            zipCode: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    return this.prisma.client.findMany({
      where,
      include: {
        address: true,
      },
    });
  }

  async findOne(id: string, companyId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id, companyId },
      include: {
        address: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    companyId: string,
  ) {
    await this.findOne(id, companyId); // a validation to check if the client exists and belongs to the company
    const { address, ...clientData } = updateClientDto;

    const data: Prisma.ClientUpdateInput = {
      ...clientData,
      address: address ? { update: address } : undefined,
    };

    return this.prisma.client.update({
      where: { id },
      data,
      include: {
        address: true,
      },
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
