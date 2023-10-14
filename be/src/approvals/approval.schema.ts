import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import { Audit } from 'src/common/schema/audit.schema';

export type ApprovalModel = Model<Approval>;
export type ApprovalDocument = HydratedDocument<Approval>;
export type FlatApproval = FlattenMaps<Approval & { _id: string }>;

@Schema({ collection: 'approvals' })
export class Approval extends Audit {
  @Prop()
  companyId: string;

  @Prop()
  procurementId: string;

  @Prop()
  approvedBy: string;

  @Prop({
    type: String,
    enum: Object.values(ApprovalStatus),
    required: true,
  })
  status: ApprovalStatus;

  @Prop()
  refferredTo?: string;

  @Prop()
  description?: string;
}

export const ApprovalSchema = SchemaFactory.createForClass(Approval);
