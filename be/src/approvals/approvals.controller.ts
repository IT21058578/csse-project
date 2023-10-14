import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { ApprovalsService } from './approvals.service';
import { UserDocument } from 'src/users/user.schema';
import { User } from 'src/common/decorators/user.decorator';
import { CreateApprovalDto } from './dtos/create-approval.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get(':id')
  @Roles(...Object.values(UserRole))
  async getApproval(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.approvalsService.getApproval(id);
  }

  @Put(':id/pass')
  @Roles(UserRole.PROCUREMENT_ADMIN, UserRole.COMPANY_ADMIN)
  async passApproval(
    @User() user: UserDocument,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Query('is-approved', ParseBoolPipe) isApproved: boolean,
    @Body() approvalDto: CreateApprovalDto,
  ) {
    return await this.approvalsService.passApproval(
      user,
      id,
      isApproved,
      approvalDto,
    );
  }
}
