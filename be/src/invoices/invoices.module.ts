import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { ItemRequestsModule } from 'src/item-requests/item-requests.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [
    ItemRequestsModule,
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
})
export class InvoicesModule {}
