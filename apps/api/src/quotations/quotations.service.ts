import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { CurrentUserType } from 'src/auth/decorators/current-user.decorator';

@Injectable()
export class QuotationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async create(
    createQuotationDto: CreateQuotationDto,
    currentUser: CurrentUserType,
  ) {
    const { clientId, items, notes, title, description } = createQuotationDto;
    const companyId = currentUser.companyId;

    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found.`);
    }

    const totalAmount = items.reduce((acc, item) => {
      const subTotal = item.quantity * parseFloat(item.unitPrice);
      return acc + subTotal;
    }, 0);

    return this.prisma.quotation.create({
      data: {
        companyId,
        clientId,
        notes,
        totalAmount,
        status: 'PENDING',
        createdById: currentUser.id,
        title,
        description,
        quotationItems: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { quotationItems: true, client: true },
    });
  }

  async findAll(currentUser: CurrentUserType) {
    return this.prisma.quotation.findMany({
      where: { companyId: currentUser.companyId },
      include: { client: true, quotationItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const quotation = await this.prisma.quotation.findFirst({
      where: { id, companyId: currentUser.companyId },
      include: { client: true, quotationItems: true },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found.`);
    }

    return quotation;
  }

  async update(
    id: string,
    updateQuotationDto: UpdateQuotationDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    const existingQuotation = await this.prisma.quotation.findFirst({
      where: { id, companyId },
    });

    if (!existingQuotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found.`);
    }

    if (existingQuotation.status !== 'PENDING') {
      throw new ForbiddenException(
        `Cannot update a quotation with status ${existingQuotation.status}.`,
      );
    }

    if (
      updateQuotationDto.status === 'APPROVED' &&
      existingQuotation.status === 'PENDING'
    ) {
      await this.jobsService.createFromQuotation(existingQuotation);
      return this.prisma.quotation.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedByUserId: currentUser.id,
        },
      });
    }

    return this.prisma.quotation.update({
      where: { id },
      data: {
        ...updateQuotationDto,
      },
    });
  }

  async sendEmail(
    id: string,
    recipientEmail: string,
    currentUser: CurrentUserType,
  ) {
    // Lógica para enviar email
    throw new Error('Not implemented');
  }
}
