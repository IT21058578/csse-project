import { Module, forwardRef } from '@nestjs/common';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { ItemRequestsModule } from 'src/item-requests/item-requests.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Approval, ApprovalSchema } from './approval.schema';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => ItemRequestsModule),
    MongooseModule.forFeature([
      { name: Approval.name, schema: ApprovalSchema },
    ]),
  ],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService, MongooseModule],
})
export class ApprovalsModule {}
