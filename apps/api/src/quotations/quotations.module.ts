import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { JobsModule } from '../jobs/jobs.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [JobsModule, InventoryModule],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
