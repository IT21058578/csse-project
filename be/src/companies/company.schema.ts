import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type CompanyDocument = HydratedDocument<Company>;
export type CompanyModel = Model<Company>;
export type FlatCompany = FlattenMaps<Company & { _id: string }>;

class CompanyConfig {
  @Prop([String])
  mustApproveItemIds?: string[];

  @Prop()
  approvalThreshold?: number;
}

@Schema({})
export class Company extends Audit {
  @Prop({ unique: true })
  name: string;

  @Prop({ default: {} })
  config: CompanyConfig;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
