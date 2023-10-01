import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Audit } from 'src/common/schema/audit.schema';

@Schema({ collection: 'deliveries' })
export class Delivery extends Audit {
  @Prop()
  qty: number;
    
  @Prop()
  itemId: number;

  @Prop()
  supplierId: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
