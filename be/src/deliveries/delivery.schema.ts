import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type DeliveryDocument = HydratedDocument<Delivery>;
export type DeliveryModel = Model<Delivery>;
export type FlatDelivery = FlattenMaps<Delivery & { _id: string }>;

@Schema({ collection: 'deliveries' })
export class Delivery extends Audit {
  @Prop()
  supplierId: string;

  @Prop()
  procurementId: string;

  @Prop()
  companyId: string;

  @Prop()
  itemId: string;

  @Prop()
  qty: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
