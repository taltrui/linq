import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '@prisma';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findOne(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }
    return company;
  }

  async update(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: updateCompanyDto,
    });
  }

  async remove(companyId: string, userId: string) {
    const company = await this.findOne(companyId);

    if (company.ownerId !== userId) {
      throw new ForbiddenException('Solo el dueño puede eliminar la empresa');
    }

    return this.prisma.company.delete({ where: { id: companyId } });
  }
}
