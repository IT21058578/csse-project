import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;
export type InvoiceModel = Model<Invoice>;
export type FlatInvoice = FlattenMaps<Invoice & { _id: string }>;

@Schema({ collection: 'invoices' })
export class Invoice extends Audit {
  @Prop()
  companyId: string;
  @Prop()
  procurementId: string;
  @Prop()
  supplierId: string;
  @Prop()
  itemId: string;
  @Prop([String])
  invoiceUrls: string[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
