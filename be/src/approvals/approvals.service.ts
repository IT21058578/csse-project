import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { User, UserDocument, UsersModel } from 'src/users/user.schema';
import {
  Approval,
  ApprovalDocument,
  ApprovalModel,
  FlatApproval,
} from './approval.schema';
import { CreateApprovalDto } from './dtos/create-approval.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import { ArrayUtils } from 'src/common/util/array-utils';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { SortOrder } from 'mongoose';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';

@Injectable()
export class ApprovalsService {
  constructor(
    @Inject(forwardRef(() => ItemRequestsService))
    private readonly itemRequestsService: ItemRequestsService,
    @InjectModel(User.name) private readonly userModel: UsersModel,
    @InjectModel(Approval.name) private readonly approvalModel: ApprovalModel,
  ) {}

  async getApproval(id: string): Promise<ApprovalDocument> {
    const existingApproval = await this.approvalModel.findById(id);
    if (existingApproval === null) {
      throw new BadRequestException(
        ErrorMessage.APPROVAL_NOT_FOUND,
        `Approval with the id ${id} was not found`,
      );
    }
    return existingApproval;
  }

  async passApproval(
    user: UserDocument,
    editApprovalDto: CreateApprovalDto,
  ): Promise<ApprovalDocument> {
    const { approvalId, description, refferredTo, isApproved } =
      editApprovalDto;
    const approval = await this.getApproval(approvalId);
    const procurement = await this.itemRequestsService.getProcurement(
      approval.procurementId,
    );

    if (
      ![
        ItemRequestStatus.PARTIALLY_APPROVED,
        ItemRequestStatus.PENDING_APPROVAL,
      ].includes(procurement.status as any)
    ) {
      throw new BadRequestException(ErrorMessage.PROCUREMENT_ALREADY_APPROVED);
    }

    approval.description = description;
    approval.refferredTo = refferredTo;
    approval.status = isApproved
      ? ApprovalStatus.APPROVED
      : ApprovalStatus.DISAPPROVED;
    approval.updatedBy = user?.id;
    approval.updatedAt = new Date();
    const savedApproval = await approval.save();

    if (approval.status === ApprovalStatus.DISAPPROVED) {
      procurement.status = ItemRequestStatus.DISAPPROVED;
      await procurement.save();
      return savedApproval;
    }

    if (approval.refferredTo === undefined) {
      procurement.status = ItemRequestStatus.APPROVED;
      await procurement.save();
      return savedApproval;
    }

    // If not disapproved or not referred. We need to create the next approval
    procurement.status = ItemRequestStatus.PARTIALLY_APPROVED;
    const selectedAdmin = await this.selectRandomProcurementAdmin(
      procurement.companyId,
      [approval.approvedBy],
    );
    const nextApprovalPromise = this.approvalModel.create({
      companyId: procurement.companyId,
      approvedBy: selectedAdmin.id,
      status: ApprovalStatus.PENDING,
      procurementId: procurement.id,
      createdAt: new Date(),
      createdBy: user?.id,
    });
    await Promise.all([procurement.save(), nextApprovalPromise]);
    return savedApproval;
  }

  async getApprovalsPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest): Promise<Page<FlatApproval>> {
    const query = this.approvalModel.find({
      companyId: filter?.company?.value,
      procurementId: filter?.procurementId?.value,
      approvedBy: filter?.approvedBy?.value,
      status: filter?.status?.value,
      refferredTo: filter?.status?.value,
    });
    const sortArr: [string, SortOrder][] = Object.entries(sort ?? {}).map(
      ([key, value]) => [key, value as SortOrder],
    );
    const [content, totalDocuments] = await Promise.all([
      query
        .clone()
        .sort(sortArr)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      query.clone().count().exec(),
    ]);
    const jsonContent = content.map((doc) =>
      doc.toJSON(),
    ) satisfies FlatApproval[];
    const approvalsPage = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return approvalsPage;
  }

  async selectRandomProcurementAdmin(
    companyId: string,
    excludedIds?: string[],
  ) {
    const allAdmins = await this.userModel.find({
      companyId,
      roles: { $in: [UserRole.COMPANY_ADMIN, UserRole.PROCUREMENT_ADMIN] },
      ...(excludedIds ? { _id: { $nin: excludedIds } } : {}),
    });
    const procurementAdmins = allAdmins.filter((user) =>
      user.roles.includes(UserRole.PROCUREMENT_ADMIN),
    );
    const selectedAdmin =
      ArrayUtils.selectRandomOne(procurementAdmins) ??
      ArrayUtils.selectRandomOne(allAdmins);
    if (selectedAdmin === undefined) {
      throw new ConflictException(
        ErrorMessage.NO_PROCUREMENT_ADMIN_CONFIGURED,
        `The company with id '${companyId}' does not have any valid procurement admins configured.`,
      );
    }
    return selectedAdmin;
  }
}
