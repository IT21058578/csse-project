import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type SiteDocument = HydratedDocument<Site>;
export type SiteModel = Model<Site>;
export type FlatSite = FlattenMaps<Site> & { _id: string };

@Schema()
export class Site extends Audit {
  @Prop()
  companyId: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  siteManagerIds: string[];
}

export const SiteSchema = SchemaFactory.createForClass(Site);
