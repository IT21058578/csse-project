import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { Audit } from 'src/common/schema/audit.schema';

export type ItemRequestDocument = HydratedDocument<ItemRequest>;
export type ItemRequestModel = Model<ItemRequestDocument>;
export type FlatProcurement = FlattenMaps<ItemRequest & { _id: string }>;

@Schema({ collection: 'item-requests' })
export class ItemRequest extends Audit {
  @Prop({ type: String, required: true })
  companyId: string;

  @Prop({ type: String, required: true })
  supplierId: string;

  @Prop({ type: String, required: true })
  itemId: string;

  @Prop({ type: String, required: true })
  siteId: string;

  @Prop({ type: String, required: true })
  qty: number;

  @Prop({
    type: String,
    enum: Object.values(ItemRequestStatus),
    required: true,
  })
  status: ItemRequestStatus;

  @Prop()
  price: number;
}

export const ItemRequestSchema = SchemaFactory.createForClass(ItemRequest);
