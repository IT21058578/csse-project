import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Audit } from 'src/common/schema/audit.schema';

export type ItemRequestDocument = HydratedDocument<ItemRequest>;
export type ItemRequestModel = Model<ItemRequestDocument> & {
  findByInvoiceId: (id: string) => Promise<ItemRequestDocument | null>;
  findByApprovalId: (id: string) => Promise<ItemRequestDocument | null>;
  findByDeliveryId: (id: string) => Promise<ItemRequestDocument | null>;
};

export const ItemRequestStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  PARTIALLY_APPROVED: 'PARTIALLY_APPROVED',
  APPROVED: 'APPROVED',
  PARTIALLY_DELIVERED: 'PARTIALLY_DELIVERED',
  DELIVERED: 'DELIVERED',
  PENDING_INVOICE: 'PENDING_INVOICE',
  COMPLETED: 'COMPLETED',
} as const;

export type ItemRequestStatus = keyof typeof ItemRequestStatus;

class Approval extends Audit {
  @Prop()
  approvedBy: string;

  @Prop()
  isApproved: boolean;

  @Prop()
  refferredTo?: string;

  @Prop()
  description?: string;
}

class Delivery extends Audit {
  @Prop()
  qty: number;
}

class Invoice extends Audit {
  @Prop()
  invoiceUrls: string[];
}

const ApprovalSchema = SchemaFactory.createForClass(Approval);
const DeliverySchema = SchemaFactory.createForClass(Delivery);
const InvoiceSchema = SchemaFactory.createForClass(Invoice);

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

  @Prop(InvoiceSchema)
  invoice: Invoice;

  @Prop({ type: [ApprovalSchema], default: [] })
  approvals: Types.DocumentArray<Approval>;

  @Prop({ type: [DeliverySchema], default: [] })
  deliveries: Types.DocumentArray<Delivery>;
}

const ItemRequestSchema = SchemaFactory.createForClass(ItemRequest);

ItemRequestSchema.statics = {
  async findByInvoiceId(id: string) {
    const itemRequests = (await this.find({
      'invoice.id': id,
    })) as ItemRequest[];
    return itemRequests.at(0) ?? null;
  },

  async findByApprovalId(id: string) {
    const itemRequests = (await this.find({
      approvals: { $elemMatch: { id } },
    })) as ItemRequest[];
    return itemRequests.at(0) ?? null;
  },

  async findByDeliveryId(id: string) {
    const itemRequests = (await this.find({
      deliveries: { $elemMatch: { id } },
    })) as ItemRequest[];
    return itemRequests.at(0) ?? null;
  },
};

export { ItemRequestSchema };
