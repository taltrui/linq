import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

export interface CreateSupplierDto {
  name: string;
  contactInfo?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  contactInfo?: string;
}

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateSupplierDto, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    return this.prisma.supplier.create({
      data: {
        name: createDto.name,
        contactInfo: createDto.contactInfo,
        companyId,
      },
    });
  }

  async findAll(currentUser: CurrentUserType, search?: string) {
    const companyId = currentUser.companyId;

    const where = {
      companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { contactInfo: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    return this.prisma.supplier.findMany({
      where,
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    const supplier = await this.prisma.supplier.findFirst({
      where: { id, companyId },
      include: {
        items: {
          select: {
            id: true,
            sku: true,
            name: true,
            unitPrice: true,
            createdAt: true,
          },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(
    id: string,
    updateDto: UpdateSupplierDto,
    currentUser: CurrentUserType,
  ) {
    const companyId = currentUser.companyId;

    // Verify supplier exists and belongs to company
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: { id, companyId },
    });

    if (!existingSupplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string, currentUser: CurrentUserType) {
    const companyId = currentUser.companyId;

    const supplier = await this.prisma.supplier.findFirst({
      where: { id, companyId },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Check if supplier has associated inventory items
    if (supplier._count.items > 0) {
      throw new ForbiddenException(
        `Cannot delete supplier. It has ${supplier._count.items} associated inventory items.`,
      );
    }

    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
