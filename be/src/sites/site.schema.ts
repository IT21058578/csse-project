import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type FlatSupplier = FlattenMaps<Site> & { _id: string };

@Schema()
export class Site extends Audit {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  siteManagerIds: string[];
}

export const siteSchema = SchemaFactory.createForClass(Site);
