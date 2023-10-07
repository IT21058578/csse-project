import { Module, forwardRef } from '@nestjs/common';
import { ItemRequestsService } from './item-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemRequest, ItemRequestSchema } from './item-request.schema';
import { ItemRequestsController } from './item-requests.controller';
import { SitesModule } from 'src/sites/sites.module';
import { ItemsModule } from 'src/items/items.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { ApprovalsModule } from 'src/approvals/approvals.module';

@Module({
  imports: [
    SitesModule,
    ItemsModule,
    SuppliersModule,
    CompaniesModule,
    forwardRef(() => ApprovalsModule),
    MongooseModule.forFeature([
      { name: ItemRequest.name, schema: ItemRequestSchema },
    ]),
  ],
  providers: [ItemRequestsService],
  controllers: [ItemRequestsController],
  exports: [MongooseModule, ItemRequestsService],
})
export class ItemRequestsModule {}
