import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    CompaniesModule,
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService, MongooseModule],
})
export class ItemsModule {}
