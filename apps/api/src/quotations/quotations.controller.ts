import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  type CurrentUserType,
} from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  create(
    @Body() createQuotationDto: CreateQuotationDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.quotationsService.create(createQuotationDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.quotationsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.quotationsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.quotationsService.update(id, updateQuotationDto, user);
  }

  @Post(':id/send-email')
  sendEmail(
    @Param('id') id: string,
    @Body('recipientEmail') email: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.quotationsService.sendEmail(id, email, user);
  }
}
