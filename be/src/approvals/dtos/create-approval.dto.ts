import { ApprovalStatus } from "src/common/enums/approval-status.enum";

export class CreateApprovalDto {
  approvalId: string;
  isApproved: boolean;
  refferredTo?: string;
  description?: string;
}