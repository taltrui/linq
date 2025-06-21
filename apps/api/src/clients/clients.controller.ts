import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.clientsService.create(createClientDto, user.companyId);
  }

  @Get()
  findAll(@CurrentUser() user: { companyId: string }) {
    return this.clientsService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { companyId: string }) {
    return this.clientsService.findOne(id, user.companyId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: { companyId: string },
  ) {
    return this.clientsService.update(id, updateClientDto, user.companyId);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: { companyId: string }) {
    return this.clientsService.remove(id, user.companyId);
  }
}
