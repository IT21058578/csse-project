import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { ItemRequestsModule } from 'src/item-requests/item-requests.module';
import { ItemsModule } from 'src/items/items.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from './delivery.schema';

@Module({
  imports: [
    SuppliersModule,
    ItemRequestsModule,
    ItemsModule,
    CompaniesModule,
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService, MongooseModule],
})
export class DeliveriesModule {}
