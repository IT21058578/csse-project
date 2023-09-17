import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type CompanyDocument = HydratedDocument<Company>;
export type CompanyModel = Model<CompanyDocument> & {
  findBySiteId: (id: string) => Promise<CompanyDocument | null>;
  findBySupplierId: (id: string) => Promise<CompanyDocument | null>;
  findByItemId: (id: string) => Promise<CompanyDocument | null>;
};

@Schema()
class Item extends Audit {
  @Prop({ unique: true })
  name: string;

  @Prop([String])
  imageUrls: string[];
}

@Schema()
class Site extends Audit {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  address: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  siteManagerIds: string[];
}

@Schema()
class Supplier extends Audit {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  accountNumbers: string[];

  @Prop({ type: Map, of: { rate: Number }, default: {} })
  items: Record<string, { rate: number }>;
}

class CompanyConfig {
  @Prop([String])
  mustApproveItemIds?: string[];

  @Prop()
  approvalThreshold?: number;
}

const itemSchema = SchemaFactory.createForClass(Item);
const siteSchema = SchemaFactory.createForClass(Site);
const supplierSchema = SchemaFactory.createForClass(Supplier);

@Schema({})
export class Company extends Audit {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [itemSchema] })
  items: Types.DocumentArray<Item>;

  @Prop({ type: [siteSchema] })
  sites: Types.DocumentArray<Site>;

  @Prop({ type: [supplierSchema] })
  suppliers: Types.DocumentArray<Supplier>;

  @Prop({ default: {} })
  config: CompanyConfig;
}

const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.statics = {
  async findByItemId(id: string) {
    const companies = (await this.find({
      items: { $elemMatch: { id } },
    })) as CompanyDocument[];
    return companies.at(0) ?? null;
  },

  async findBySiteId(id: string) {
    const companies = (await this.find({
      sites: { $elemMatch: { id } },
    })) as CompanyDocument[];
    return companies.at(0) ?? null;
  },

  async findBySupplierId(id: string) {
    const companies = (await this.find({
      suppliers: { $elemMatch: { id } },
    })) as CompanyDocument[];
    return companies.at(0) ?? null;
  },
};

export { CompanySchema };
