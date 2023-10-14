import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type ItemDocument = HydratedDocument<Item>;
export type ItemModel = Model<Item>;
export type FlattenedItem = FlattenMaps<Item> & { _id: string };

@Schema()
export class Item extends Audit {
  @Prop()
  companyId: string;

  @Prop()
  name: string;

  @Prop([String])
  imageUrls: string[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
