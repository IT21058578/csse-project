import { Module } from '@nestjs/common';
import { ItemsService } from './ItemsService';
import { CompaniesModule } from 'src/companies/companies.module';
import { ItemsController } from './items.controller';

@Module({
  imports: [CompaniesModule],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
