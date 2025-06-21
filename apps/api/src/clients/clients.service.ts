import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, companyId: string) {
    const lastClient = await this.prisma.client.findFirst({
      where: { companyId },
      orderBy: { displayId: 'desc' },
      select: { displayId: true },
    });

    const newDisplayId = lastClient
      ? (parseInt(lastClient.displayId, 10) + 1).toString()
      : '1';

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        displayId: newDisplayId,
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.client.findMany({
      where: { companyId },
    });
  }

  async findOne(id: string, companyId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id, companyId },
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
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
