import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type FlatSupplier = FlattenMaps<Supplier> & { _id: string };
export type SupplierDocument = HydratedDocument<Supplier>;
export type SupplierModel = Model<Supplier>;

@Schema()
export class Supplier extends Audit {
  @Prop()
  companyId: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  accountNumbers: string[];

  @Prop({ type: Object, default: {} })
  items: Record<string, { rate: number }>;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
