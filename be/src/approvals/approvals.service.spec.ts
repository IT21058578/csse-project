import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalsService } from 'src/approvals/approvals.service';
import {
  Approval,
  ApprovalDocument,
  ApprovalModel,
} from 'src/approvals/approval.schema';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { User, UserDocument, UsersModel } from 'src/users/user.schema';
import { getModelToken } from 'nestjs-typegoose';
import { faker } from '@faker-js/faker';
import { when } from 'jest-when';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ItemRequestDocument } from 'src/item-requests/item-request.schema';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { isEmpty, xor } from 'lodash';
import { MockUtils } from 'src/common/util/mock-util';

describe('ApprovalsService', () => {
  let service: ApprovalsService;
  let itemRequestsService: ItemRequestsService;
  let userModel: UsersModel;
  let approvalModel: ApprovalModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalsService,
        {
          provide: ItemRequestsService,
          useValue: {
            getProcurement: jest.fn(),
          } satisfies Partial<ItemRequestsService>,
        },
        {
          provide: getModelToken(User.name),
          useValue: MockUtils.mockModel(userModel),
        },
        {
          provide: getModelToken(Approval.name),
          useValue: MockUtils.mockModel(approvalModel),
        },
      ],
    }).compile();

    service = module.get<ApprovalsService>(ApprovalsService);
    itemRequestsService = module.get<ItemRequestsService>(ItemRequestsService);
    approvalModel = module.get<ApprovalModel>(getModelToken(Approval.name));
    userModel = module.get<UsersModel>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get approval by id', async () => {
    const approvalId = faker.database.mongodbObjectId();
    const approvalModelFindById = jest.spyOn(approvalModel, 'findById');
    when(approvalModelFindById)
      .calledWith(approvalId)
      .mockResolvedValue(new Approval() as never);
    const result = await service.getApproval(approvalId);
    expect(result).toBeDefined();
  });

  it('should not get approval by id and throw when id is invalid', async () => {
    const approvalModelFindById = jest.spyOn(approvalModel, 'findById');
    when(approvalModelFindById)
      .calledWith(expect.any(String))
      .mockResolvedValue(null as never);

    const fn = async () => await service.getApproval('');
    await expect(fn).rejects.toThrow(BadRequestException);
  });

  it('should pass approval when no referral', async () => {
    const approvalId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const approval = {
      procurementId,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ApprovalDocument>;
    const procurement = {
      status: ItemRequestStatus.PENDING_APPROVAL,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ItemRequestDocument>;

    const approvalModel_findById = jest.spyOn(approvalModel, 'findById');
    when(approvalModel_findById)
      .calledWith(approvalId)
      .mockResolvedValue(approval as never);
    const itemRequestsService_getProcurement = jest.spyOn(
      itemRequestsService,
      'getProcurement',
    );
    when(itemRequestsService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as never);

    const result = await service.passApproval({} as UserDocument, {
      approvalId,
      isApproved: true,
    });

    expect(result.status).toBe(ApprovalStatus.APPROVED);
    expect(procurement.status).toBe(ItemRequestStatus.APPROVED);
    expect(result.procurementId).toBe(procurementId);
    expect(approval.save).toBeCalledTimes(1);
    expect(procurement.save).toBeCalledTimes(1);
    expect(itemRequestsService_getProcurement).toBeCalledTimes(1);
    expect(approvalModel_findById).toBeCalledTimes(1);
  });

  it('should pass approval when disapproved', async () => {
    const approvalId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const approval = {
      procurementId,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ApprovalDocument>;
    const procurement = {
      status: ItemRequestStatus.PARTIALLY_APPROVED,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ItemRequestDocument>;

    const approvalModel_findById = jest.spyOn(approvalModel, 'findById');
    when(approvalModel_findById)
      .calledWith(approvalId)
      .mockResolvedValue(approval as never);
    const itemRequestsService_getProcurement = jest.spyOn(
      itemRequestsService,
      'getProcurement',
    );
    when(itemRequestsService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as never);

    const result = await service.passApproval({} as UserDocument, {
      approvalId,
      isApproved: false,
    });

    expect(result.status).toBe(ApprovalStatus.DISAPPROVED);
    expect(procurement.status).toBe(ItemRequestStatus.DISAPPROVED);
    expect(result.procurementId).toBe(procurementId);
    expect(approval.save).toBeCalledTimes(1);
    expect(procurement.save).toBeCalledTimes(1);
    expect(itemRequestsService_getProcurement).toBeCalledTimes(1);
    expect(approvalModel_findById).toBeCalledTimes(1);
  });

  it('should pass approval when refferal present', async () => {
    const approvalId = faker.database.mongodbObjectId();
    const refferredTo = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const procurementAdminId = faker.database.mongodbObjectId();
    const approval = {
      procurementId,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ApprovalDocument>;
    const procurement = {
      status: ItemRequestStatus.PENDING_APPROVAL,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ItemRequestDocument>;

    const approvalModel_findById = jest.spyOn(approvalModel, 'findById');
    when(approvalModel_findById)
      .calledWith(approvalId)
      .mockResolvedValue(approval as never);
    const itemRequestsService_getProcurement = jest.spyOn(
      itemRequestsService,
      'getProcurement',
    );
    when(itemRequestsService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as never);
    const userModel_find = jest
      .spyOn(userModel, 'find')
      .mockResolvedValue([
        { id: procurementAdminId, roles: [UserRole.PROCUREMENT_ADMIN] },
      ]);
    const approvalModel_create = jest.spyOn(approvalModel, 'create');
    const isNewApprovalCorrect = when((arg1: ApprovalDocument) => {
      const isProcIdCorrect = arg1.procurementId == procurementId;
      const isStatusCorrect = arg1.status == ApprovalStatus.PENDING;
      const isApprovedByCorrect = arg1.approvedBy == procurementAdminId;
      return isProcIdCorrect && isStatusCorrect && isApprovedByCorrect;
    });
    when(approvalModel_create).expectCalledWith(isNewApprovalCorrect);

    const result = await service.passApproval({} as UserDocument, {
      approvalId,
      isApproved: true,
      refferredTo,
    });

    expect(result.status).toBe(ApprovalStatus.APPROVED);
    expect(result.refferredTo).toBe(refferredTo);
    expect(procurement.status).toBe(ItemRequestStatus.PARTIALLY_APPROVED);
    expect(result.procurementId).toBe(procurementId);
    expect(approval.save).toBeCalledTimes(1);
    expect(procurement.save).toBeCalledTimes(1);
    expect(itemRequestsService_getProcurement).toBeCalledTimes(1);
    expect(approvalModel_findById).toBeCalledTimes(1);
    expect(approvalModel_create).toBeCalledTimes(1);
    expect(userModel_find).toBeCalledTimes(1);
  });

  it('should not pass approval and throw when procurement already approved', async () => {
    const approvalId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const approval = {
      procurementId,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ApprovalDocument>;
    const procurement = {
      status: ItemRequestStatus.APPROVED,
      save: jest.fn().mockReturnThis(),
    } satisfies Partial<ItemRequestDocument>;

    const approvalModel_findById = jest.spyOn(approvalModel, 'findById');
    when(approvalModel_findById)
      .calledWith(approvalId)
      .mockResolvedValue(approval as never);
    const itemRequestsService_getProcurement = jest.spyOn(
      itemRequestsService,
      'getProcurement',
    );
    when(itemRequestsService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as never);

    const fn = async () =>
      await service.passApproval({} as UserDocument, {
        approvalId,
        isApproved: false,
      });

    await expect(fn).rejects.toThrow(BadRequestException);
    await expect(fn).rejects.toThrow(ErrorMessage.PROCUREMENT_ALREADY_APPROVED);
    expect(itemRequestsService_getProcurement).toBeCalledTimes(2); // As the fn executes twice.
    expect(approvalModel_findById).toBeCalledTimes(2);
  });

  it('should select random procurement admins', async () => {
    const companyId = faker.database.mongodbObjectId();
    const procurementAdminId = faker.database.mongodbObjectId();
    const companyAdminId = faker.database.mongodbObjectId();

    const userModel_find = jest.spyOn(userModel, 'find');
    const isProperQuery = when((arg1) => {
      const isCompanyCorrect = arg1.companyId === companyId;
      const isRolesSame = isEmpty(
        xor(arg1.roles.$in, [
          UserRole.COMPANY_ADMIN,
          UserRole.PROCUREMENT_ADMIN,
        ]),
      );
      return isCompanyCorrect && isRolesSame;
    });
    when(userModel_find)
      .expectCalledWith(isProperQuery as any)
      .mockResolvedValue([
        { id: companyAdminId, roles: [UserRole.COMPANY_ADMIN] },
        { id: procurementAdminId, roles: [UserRole.PROCUREMENT_ADMIN] },
      ] satisfies Partial<UserDocument>[]);

    const result = await service.selectRandomProcurementAdmin(companyId);

    expect(result.id).toBe(procurementAdminId);
    expect(userModel_find).toBeCalledTimes(1);
  });

  it('should not select random procurement admin and throw if no admin exists', async () => {
    const companyId = faker.database.mongodbObjectId();

    const userModel_find = jest.spyOn(userModel, 'find');
    const isProperQuery = when((arg1) => {
      const isCompanyCorrect = arg1.companyId === companyId;
      const isRolesSame = isEmpty(
        xor(arg1.roles.$in, [
          UserRole.COMPANY_ADMIN,
          UserRole.PROCUREMENT_ADMIN,
        ]),
      );
      return isCompanyCorrect && isRolesSame;
    });
    when(userModel_find)
      .expectCalledWith(isProperQuery as any)
      .mockResolvedValue([] satisfies Partial<UserDocument>[]);

    const fn = async () =>
      await service.selectRandomProcurementAdmin(companyId);
    await expect(fn).rejects.toThrow(ConflictException);
    await expect(fn).rejects.toThrow(
      ErrorMessage.NO_PROCUREMENT_ADMIN_CONFIGURED,
    );
    expect(userModel_find).toBeCalledTimes(2); // As the fn executes twice.
  });
});
