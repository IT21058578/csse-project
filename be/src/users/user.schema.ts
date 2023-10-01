import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlattenMaps, HydratedDocument, Model } from 'mongoose';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { Audit } from 'src/common/schema/audit.schema';

export type UserDocument = HydratedDocument<User>;
export type UsersModel = Model<User>
export type UserFlattened = FlattenMaps<User & { _id: string }>;

@Schema({ collection: 'users' })
export class User extends Audit {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop([String])
  roles: UserRole[];

  @Prop()
  isAuthorized: boolean;

  @Prop()
  companyId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
