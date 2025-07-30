import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

export interface CreateInventoryItemDto {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  supplierId?: string;
  initialQuantity?: number;
}

export interface UpdateInventoryItemDto {
  name?: string;
  description?: string;
  unitPrice?: number;
  supplierId?: string;
}

export interface AdjustStockDto {
  quantity: number;
  type: TransactionType;
  notes?: string;
}

export interface StockLevels {
  physicalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDto: CreateInventoryItemDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Check if SKU already exists for this company
    const existingItem = await this.prisma.inventoryItem.findFirst({
      where: { sku: createDto.sku, companyId },
    });

    if (existingItem) {
      throw new ForbiddenException(`SKU ${createDto.sku} already exists`);
    }

    // Verify supplier belongs to company if provided
    if (createDto.supplierId) {
      const supplier = await this.prisma.supplier.findFirst({
        where: { id: createDto.supplierId, companyId },
      });
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${createDto.supplierId} not found`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Create inventory item
      const item = await tx.inventoryItem.create({
        data: {
          sku: createDto.sku,
          name: createDto.name,
          description: createDto.description,
          unitPrice: createDto.unitPrice,
          companyId,
          supplierId: createDto.supplierId,
        },
        include: {
          supplier: true,
        },
      });

      // Create initial stock transaction if quantity provided
      if (createDto.initialQuantity && createDto.initialQuantity > 0) {
        await tx.inventoryTransaction.create({
          data: {
            itemId: item.id,
            quantity: createDto.initialQuantity,
            type: TransactionType.INITIAL_COUNT,
            notes: 'Initial stock count',
          },
        });
      }

      return item;
    });
  }

  async findAll(currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    const items = await this.prisma.inventoryItem.findMany({
      where: { companyId },
      include: {
        supplier: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stock levels for each item
    const itemsWithStock = await Promise.all(
      items.map(async (item) => {
        const stockLevels = await this.getAggregatedStockLevels(item.id);
        return {
          ...item,
          ...stockLevels,
        };
      }),
    );

    return itemsWithStock;
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, companyId },
      include: {
        supplier: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Latest 10 transactions
          include: {
            job: {
              select: { id: true, displayId: true },
            },
            quote: {
              select: { id: true, quotationNumber: true },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    const stockLevels = await this.getAggregatedStockLevels(id);

    return {
      ...item,
      ...stockLevels,
    };
  }

  async update(
    id: string,
    updateDto: UpdateInventoryItemDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Verify item exists and belongs to company
    const existingItem = await this.prisma.inventoryItem.findFirst({
      where: { id, companyId },
    });

    if (!existingItem) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    // Verify supplier belongs to company if provided
    if (updateDto.supplierId) {
      const supplier = await this.prisma.supplier.findFirst({
        where: { id: updateDto.supplierId, companyId },
      });
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${updateDto.supplierId} not found`,
        );
      }
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: updateDto,
      include: {
        supplier: true,
      },
    });
  }

  async remove(id: string, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, companyId },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  async adjustStock(
    id: string,
    adjustDto: AdjustStockDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, companyId },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return this.prisma.inventoryTransaction.create({
      data: {
        itemId: id,
        quantity: adjustDto.quantity,
        type: adjustDto.type,
        notes: adjustDto.notes,
      },
      include: {
        item: {
          select: {
            id: true,
            sku: true,
            name: true,
          },
        },
      },
    });
  }

  async getAggregatedStockLevels(itemId: string): Promise<StockLevels> {
    const transactions = await this.prisma.inventoryTransaction.findMany({
      where: { itemId },
    });

    let physicalQuantity = 0;
    let reservedQuantity = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case TransactionType.INITIAL_COUNT:
        case TransactionType.STOCK_IN:
        case TransactionType.AUDIT_ADJUSTMENT:
          physicalQuantity += transaction.quantity;
          break;
        case TransactionType.CONSUMPTION:
          physicalQuantity += transaction.quantity; // quantity is negative for consumption
          break;
        case TransactionType.RESERVATION:
          reservedQuantity += Math.abs(transaction.quantity); // store as positive
          break;
        case TransactionType.RESERVATION_COMPENSATION:
          reservedQuantity -= transaction.quantity; // quantity is positive for compensation
          break;
      }
    }

    const availableQuantity = physicalQuantity - reservedQuantity;

    return {
      physicalQuantity,
      reservedQuantity,
      availableQuantity,
    };
  }

  async createTransaction(data: {
    itemId: string;
    quantity: number;
    type: TransactionType;
    notes?: string;
    jobId?: string;
    quoteId?: string;
  }) {
    return this.prisma.inventoryTransaction.create({
      data,
      include: {
        item: {
          select: {
            id: true,
            sku: true,
            name: true,
          },
        },
      },
    });
  }

  async reserveMaterialsForJob(
    jobId: string,
    materials: Array<{ itemId: string; quantity: number }>,
  ) {
    const transactions = await Promise.all(
      materials.map((material) =>
        this.createTransaction({
          itemId: material.itemId,
          quantity: -material.quantity, // negative for reservation
          type: TransactionType.RESERVATION,
          jobId,
          notes: `Reserved for job ${jobId}`,
        }),
      ),
    );

    return transactions;
  }

  async consumeMaterialsForJob(
    jobId: string,
    materials: Array<{ itemId: string; quantity: number }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const transactions = [];

      for (const material of materials) {
        // 1. Compensate the reservation
        const compensationTransaction = await tx.inventoryTransaction.create({
          data: {
            itemId: material.itemId,
            quantity: material.quantity, // positive to cancel reservation
            type: TransactionType.RESERVATION_COMPENSATION,
            jobId,
            notes: `Reservation compensation for job ${jobId}`,
          },
        });

        // 2. Record the consumption
        const consumptionTransaction = await tx.inventoryTransaction.create({
          data: {
            itemId: material.itemId,
            quantity: -material.quantity, // negative for consumption
            type: TransactionType.CONSUMPTION,
            jobId,
            notes: `Material consumed in job ${jobId}`,
          },
        });

        transactions.push(compensationTransaction, consumptionTransaction);
      }

      return transactions;
    });
  }

  async cancelReservationsForJob(jobId: string) {
    // Find all reservation transactions for this job
    const reservations = await this.prisma.inventoryTransaction.findMany({
      where: {
        jobId,
        type: TransactionType.RESERVATION,
      },
    });

    // Create compensation transactions
    const compensations = await Promise.all(
      reservations.map((reservation) =>
        this.createTransaction({
          itemId: reservation.itemId,
          quantity: Math.abs(reservation.quantity), // positive to cancel negative reservation
          type: TransactionType.RESERVATION_COMPENSATION,
          jobId,
          notes: `Reservation cancelled for job ${jobId}`,
        }),
      ),
    );

    return compensations;
  }
}
