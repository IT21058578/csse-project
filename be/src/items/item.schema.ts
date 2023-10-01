import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

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

export const itemSchema = SchemaFactory.createForClass(Item);
