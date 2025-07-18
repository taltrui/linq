import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import type { CreateSupplierDto, UpdateSupplierDto } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createDto: CreateSupplierDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.suppliersService.create(createDto, currentUser);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('search') search?: string
  ) {
    return this.suppliersService.findAll(currentUser, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.suppliersService.findOne(id, currentUser);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateDto: UpdateSupplierDto, 
    @CurrentUser() currentUser: CurrentUserType
  ) {
    return this.suppliersService.update(id, updateDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.suppliersService.remove(id, currentUser);
  }
}