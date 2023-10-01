import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type FlatSupplier = FlattenMaps<Supplier> & { _id: string };
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

  @Prop({ type: Map, of: { rate: Number }, default: {} })
  items: Types.Map<{ rate: number }>;
}

export const supplierSchema = SchemaFactory.createForClass(Supplier);
