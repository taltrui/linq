import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { CurrentUserType } from 'src/auth/decorators/current-user.decorator';

export interface AddMaterialToQuotationDto {
  itemId: string;
  quantity: number;
}

@Injectable()
export class QuotationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly inventoryService: InventoryService,
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
      include: { 
        client: true, 
        quotationItems: true,
        materials: {
          include: {
            item: {
              include: {
                supplier: true,
              },
            },
          },
        },
      },
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

  async addMaterialToQuotation(
    quotationId: string,
    addMaterialDto: AddMaterialToQuotationDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Verify quotation exists and belongs to company
    const quotation = await this.prisma.quotation.findFirst({
      where: { id: quotationId, companyId },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${quotationId} not found`);
    }

    if (quotation.status !== 'PENDING') {
      throw new ForbiddenException(
        `Cannot add materials to a quotation with status ${quotation.status}`
      );
    }

    // Verify inventory item exists and belongs to company
    const inventoryItem = await this.inventoryService.findOne(addMaterialDto.itemId, currentUser);

    // Check stock availability
    const stockLevels = await this.inventoryService.getAggregatedStockLevels(addMaterialDto.itemId);
    
    const stockWarning = stockLevels.availableQuantity < addMaterialDto.quantity
      ? {
          message: `Insufficient stock. Available: ${stockLevels.availableQuantity}, Requested: ${addMaterialDto.quantity}`,
          availableQuantity: stockLevels.availableQuantity,
          requestedQuantity: addMaterialDto.quantity,
        }
      : null;

    // Check if material already exists in quotation
    const existingMaterial = await this.prisma.quoteMaterial.findFirst({
      where: {
        quotationId,
        itemId: addMaterialDto.itemId,
      },
    });

    if (existingMaterial) {
      throw new BadRequestException('Material already exists in this quotation');
    }

    // Create the material relationship
    const quoteMaterial = await this.prisma.quoteMaterial.create({
      data: {
        quotationId,
        itemId: addMaterialDto.itemId,
        quantity: addMaterialDto.quantity,
        unitPriceAtTimeOfQuote: inventoryItem.unitPrice,
      },
      include: {
        item: {
          include: {
            supplier: true,
          },
        },
      },
    });

    return {
      quoteMaterial,
      stockWarning,
    };
  }

  async removeMaterialFromQuotation(
    quotationId: string,
    itemId: string,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Verify quotation exists and belongs to company
    const quotation = await this.prisma.quotation.findFirst({
      where: { id: quotationId, companyId },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${quotationId} not found`);
    }

    if (quotation.status !== 'PENDING') {
      throw new ForbiddenException(
        `Cannot remove materials from a quotation with status ${quotation.status}`
      );
    }

    // Find and delete the material relationship
    const quoteMaterial = await this.prisma.quoteMaterial.findFirst({
      where: {
        quotationId,
        itemId,
      },
    });

    if (!quoteMaterial) {
      throw new NotFoundException('Material not found in this quotation');
    }

    return this.prisma.quoteMaterial.delete({
      where: {
        id: quoteMaterial.id,
      },
    });
  }

  async updateMaterialQuantity(
    quotationId: string,
    itemId: string,
    quantity: number,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Verify quotation exists and belongs to company
    const quotation = await this.prisma.quotation.findFirst({
      where: { id: quotationId, companyId },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${quotationId} not found`);
    }

    if (quotation.status !== 'PENDING') {
      throw new ForbiddenException(
        `Cannot update materials in a quotation with status ${quotation.status}`
      );
    }

    // Find the material relationship
    const quoteMaterial = await this.prisma.quoteMaterial.findFirst({
      where: {
        quotationId,
        itemId,
      },
    });

    if (!quoteMaterial) {
      throw new NotFoundException('Material not found in this quotation');
    }

    // Check stock availability for new quantity
    const stockLevels = await this.inventoryService.getAggregatedStockLevels(itemId);
    
    const stockWarning = stockLevels.availableQuantity < quantity
      ? {
          message: `Insufficient stock. Available: ${stockLevels.availableQuantity}, Requested: ${quantity}`,
          availableQuantity: stockLevels.availableQuantity,
          requestedQuantity: quantity,
        }
      : null;

    // Update the quantity
    const updatedMaterial = await this.prisma.quoteMaterial.update({
      where: {
        id: quoteMaterial.id,
      },
      data: {
        quantity,
      },
      include: {
        item: {
          include: {
            supplier: true,
          },
        },
      },
    });

    return {
      quoteMaterial: updatedMaterial,
      stockWarning,
    };
  }

  async getQuotationMaterials(quotationId: string, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    // Verify quotation exists and belongs to company
    const quotation = await this.prisma.quotation.findFirst({
      where: { id: quotationId, companyId },
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${quotationId} not found`);
    }

    return this.prisma.quoteMaterial.findMany({
      where: { quotationId },
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
}
