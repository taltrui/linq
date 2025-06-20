import { Controller, Get, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Get('me')
    findOne(@CurrentUser() user: any) {
        return this.companiesService.findOne(user.companyId);
    }

    @Roles(Role.OWNER, Role.ADMIN)
    @Patch('me')
    update(@CurrentUser() user: any, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(user.companyId, updateCompanyDto);
    }

    @Roles(Role.OWNER)
    @Delete('me')
    remove(@CurrentUser() user: { id: string; companyId: string }) {
        return this.companiesService.remove(user.companyId, user.id);
    }
}