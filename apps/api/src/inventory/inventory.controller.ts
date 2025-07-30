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
import { InventoryService } from './inventory.service';
import type {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  AdjustStockDto,
} from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('items')
  create(
    @Body() createDto: CreateInventoryItemDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.inventoryService.create(createDto, currentUser);
  }

  @Get('items')
  findAll(@CurrentUser() currentUser: CurrentUserType) {
    return this.inventoryService.findAll(currentUser);
  }

  @Get('items/:id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.inventoryService.findOne(id, currentUser);
  }

  @Patch('items/:id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInventoryItemDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.inventoryService.update(id, updateDto, currentUser);
  }

  @Delete('items/:id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.inventoryService.remove(id, currentUser);
  }

  @Post('items/:id/adjust-stock')
  adjustStock(
    @Param('id') id: string,
    @Body() adjustDto: AdjustStockDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.inventoryService.adjustStock(id, adjustDto, currentUser);
  }

  @Get('items/:id/stock-levels')
  getStockLevels(@Param('id') id: string) {
    return this.inventoryService.getAggregatedStockLevels(id);
  }
}
