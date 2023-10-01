import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Audit } from 'src/common/schema/audit.schema';

@Schema({ collection: 'invoices' })
export class Invoice extends Audit {
  @Prop()
  invoiceUrls: string[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
