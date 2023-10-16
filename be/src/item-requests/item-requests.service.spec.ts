import { Test } from '@nestjs/testing';
import { ItemRequestsService } from './item-requests.service';
import { faker } from '@faker-js/faker';
import {
  ItemRequest,
  ItemRequestDocument,
  ItemRequestModel,
} from './item-request.schema';
import { when } from 'jest-when';
import { SitesService } from 'src/sites/sites.service';
import { ItemsService } from 'src/items/items.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CompaniesService } from 'src/companies/companies.service';
import { ApprovalsService } from 'src/approvals/approvals.service';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock.util';
import {
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { ApprovalStatus } from 'src/common/enums/approval-status.enum';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';

describe('ItemRequests Test suite', () => {
  let service: ItemRequestsService;
  let sitesService: SitesService;
  let itemsService: ItemsService;
  let suppliersService: SuppliersService;
  let companiesService: CompaniesService;
  let approvalsService: ApprovalsService;
  let procurementModel: ItemRequestModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemRequestsService,
        {
          provide: SitesService,
          useValue: {
            getSite: jest.fn(),
          },
        },
        {
          provide: ItemsService,
          useValue: {
            getItem: jest.fn(),
          },
        },
        {
          provide: SuppliersService,
          useValue: {
            getSupplier: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            getCompany: jest.fn(),
          },
        },
        {
          provide: ApprovalsService,
          useValue: {
            selectRandomProcurementAdmin: jest.fn(),
            createInitialApproval: jest.fn(),
          },
        },
        {
          provide: getModelToken(ItemRequest.name),
          useValue: MockUtils.mockModel(procurementModel),
        },
      ],
    }).compile();

    service = module.get<ItemRequestsService>(ItemRequestsService);
    sitesService = module.get<SitesService>(SitesService);
    itemsService = module.get<ItemsService>(ItemsService);
    suppliersService = module.get<SuppliersService>(SuppliersService);
    companiesService = module.get<CompaniesService>(CompaniesService);
    approvalsService = module.get<ApprovalsService>(ApprovalsService);
    procurementModel = module.get<ItemRequestModel>(
      getModelToken(ItemRequest.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get procurement', async () => {
    const procurementId = faker.database.mongodbObjectId();
    const procurement: Partial<ItemRequestDocument> = {
      id: procurementId,
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(procurementId)
      .mockResolvedValue(procurement as never);

    const result = await service.getProcurement(procurementId);

    expect(result).toBeDefined();
    expect(result.id).toBe(procurementId);
    expect(procurementModel_findById).toBeCalledTimes(1);
  });

  it('should not get procurement and throw if id is invalid', async () => {
    const procurementId = 'invalid-id';

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(procurementId)
      .mockResolvedValue(null as never);

    let error: HttpException | undefined = undefined;
    try {
      await service.getProcurement(procurementId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.PROCUREMENT_NOT_FOUND);
    expect(procurementModel_findById).toBeCalledTimes(1);
  });

  it('should create procurement when needing approval', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const siteId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const createProcurementDto: CreateProcurementDto = {
      itemId,
      qty: faker.number.int(),
      siteId,
      supplierId,
    };

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    const sitesService_getSite = jest.spyOn(sitesService, 'getSite');
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    const approvalsService_selectRandomProcurementAdmin = jest.spyOn(
      approvalsService,
      'selectRandomProcurementAdmin',
    );
    const approvalsService_createInitialApproval = jest.spyOn(
      approvalsService,
      'createInitialApproval',
    );
    const procurementModel_create = jest.spyOn(procurementModel, 'create');

    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ id: itemId, companyId } as any); // Mock item data as needed
    when(companiesService_getCompany)
      .expectCalledWith(companyId) // Pass appropriate companyId based on item data
      .mockResolvedValue({
        id: companyId,
        config: { approvalThreshold: 100000, mustApproveItemIds: [] },
      } as any); // Mock company data as needed
    when(sitesService_getSite)
      .expectCalledWith(siteId)
      .mockResolvedValue({ companyId } as any); // Mock site data as needed
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({
        companyId,
        items: {
          [itemId]: { rate: faker.number.float() },
        },
      } as never);
    when(approvalsService_createInitialApproval).expectCalledWith(
      expect.objectContaining({
        companyId,
        status: ApprovalStatus.PENDING,
        qty: createProcurementDto.qty,
        approvedBy: expect.any(String),
        createdAt: expect.any(Date),
        createdBy: user._id,
      }),
    );
    when(approvalsService_selectRandomProcurementAdmin)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: faker.database.mongodbObjectId() } as any); // Mock selected admin data as needed
    when(procurementModel_create)
      .expectCalledWith(
        expect.objectContaining({
          companyId,
          itemId,
          qty: createProcurementDto.qty,
          siteId,
          supplierId,
          price: expect.any(Number),
          status: ItemRequestStatus.PENDING_APPROVAL,
          createdAt: expect.any(Date),
          createdBy: user._id,
        }),
      )
      .mockImplementation((arg1: any) => arg1);

    const result = await service.createProcurement(
      user as any,
      createProcurementDto,
    );

    expect(result).toBeDefined();
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(sitesService_getSite).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
    expect(approvalsService_selectRandomProcurementAdmin).toBeCalledTimes(1);
    expect(approvalsService_createInitialApproval).toBeCalledTimes(1);
    expect(procurementModel_create).toBeCalledTimes(1);
  });

  it.todo('should create procurement when not needing approval');

  it('should not create procurement and throw if site does not belong to company', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const siteId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const createProcurementDto: CreateProcurementDto = {
      itemId,
      qty: faker.number.int(),
      siteId,
      supplierId,
    };

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    const sitesService_getSite = jest.spyOn(sitesService, 'getSite');
    const approvalsService_createInitialApproval = jest.spyOn(
      approvalsService,
      'createInitialApproval',
    );

    const procurementModel_create = jest.spyOn(procurementModel, 'create');

    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ id: itemId, companyId } as any); // Mock item data as needed
    when(companiesService_getCompany)
      .expectCalledWith(companyId) // Pass appropriate companyId based on item data
      .mockResolvedValue({
        id: companyId,
      } as any); // Mock company data as needed
    when(sitesService_getSite)
      .expectCalledWith(siteId)
      .mockResolvedValue({ companyId: 'wrong-company-id' } as any); // Mock site data as needed

    let error: HttpException | undefined = undefined;
    try {
      await service.createProcurement(user as any, createProcurementDto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.SITE_NOT_FOUND);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(sitesService_getSite).toBeCalledTimes(1);
    expect(approvalsService_createInitialApproval).toBeCalledTimes(0);
    expect(procurementModel_create).toBeCalledTimes(0);
  });

  it('should not create procurement and throw if supplier does not belong to company', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const siteId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const createProcurementDto: CreateProcurementDto = {
      itemId,
      qty: faker.number.int(),
      siteId,
      supplierId,
    };

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    const sitesService_getSite = jest.spyOn(sitesService, 'getSite');
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    const approvalsService_createInitialApproval = jest.spyOn(
      approvalsService,
      'createInitialApproval',
    );
    const procurementModel_create = jest.spyOn(procurementModel, 'create');

    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ id: itemId, companyId } as any); // Mock item data as needed
    when(companiesService_getCompany)
      .expectCalledWith(companyId) // Pass appropriate companyId based on item data
      .mockResolvedValue({
        id: companyId,
      } as any); // Mock company data as needed
    when(sitesService_getSite)
      .expectCalledWith(siteId)
      .mockResolvedValue({ companyId } as any); // Mock site data as needed
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({
        companyId: 'wrong-company-id',
        items: {
          [itemId]: { rate: faker.number.float() },
        },
      } as never);
    let error: HttpException | undefined = undefined;
    try {
      await service.createProcurement(user as any, createProcurementDto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.SUPPLIER_NOT_FOUND);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(sitesService_getSite).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
    expect(approvalsService_createInitialApproval).toBeCalledTimes(0);
    expect(procurementModel_create).toBeCalledTimes(0);
  });

  it('should not create procurement and throw if supplier does not provide item', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const siteId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const createProcurementDto: CreateProcurementDto = {
      itemId,
      qty: faker.number.int(),
      siteId,
      supplierId,
    };

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    const sitesService_getSite = jest.spyOn(sitesService, 'getSite');
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    const approvalsService_createInitialApproval = jest.spyOn(
      approvalsService,
      'createInitialApproval',
    );
    const procurementModel_create = jest.spyOn(procurementModel, 'create');

    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ id: itemId, companyId } as any);
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({
        id: companyId,
      } as any);
    when(sitesService_getSite)
      .expectCalledWith(siteId)
      .mockResolvedValue({ companyId } as any);
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({
        companyId,
        items: {},
      } as never);
    let error: HttpException | undefined = undefined;
    try {
      await service.createProcurement(user as any, createProcurementDto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_NOT_FOUND);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(sitesService_getSite).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
    expect(approvalsService_createInitialApproval).toBeCalledTimes(0);
    expect(procurementModel_create).toBeCalledTimes(0);
  });

  it('should edit procurement', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };

    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const editProcurementDto: Partial<CreateProcurementDto> = {
      qty: 10,
      supplierId,
      itemId,
    };

    const existingProcurement: Partial<ItemRequestDocument> = {
      id: faker.database.mongodbObjectId(),
      status: ItemRequestStatus.PENDING_APPROVAL,
      qty: 5,
      supplierId: 'previous-supplier-id',
      itemId: 'previous-item-id',
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(existingProcurement.id)
      .mockResolvedValue(existingProcurement as never);
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ companyId: companyId, id: itemId } as never);

    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({
        companyId: companyId,
        items: {
          [itemId]: {},
        },
      } as never);

    const result = await service.editProcurement(
      user as any,
      existingProcurement.id,
      editProcurementDto,
    );

    expect(result).toBeDefined();
    expect(result.qty).toBe(editProcurementDto.qty);
    expect(result.supplierId).toBe(editProcurementDto.supplierId);
    expect(result.itemId).toBe(editProcurementDto.itemId);
    expect(result.updatedBy).toBe(user._id);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(existingProcurement.save).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
  });

  it('should not edit procurement and throw if procurement has begun approval', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };

    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const editProcurementDto: Partial<CreateProcurementDto> = {
      qty: 10,
      supplierId,
      itemId,
    };

    const existingProcurement: Partial<ItemRequestDocument> = {
      id: faker.database.mongodbObjectId(),
      status: ItemRequestStatus.PARTIALLY_APPROVED,
      qty: 5,
      supplierId: 'previous-supplier-id',
      itemId: 'previous-item-id',
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(existingProcurement.id)
      .mockResolvedValue(existingProcurement as never);
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({ companyId: companyId, id: itemId } as never);

    let error: HttpException | undefined = undefined;
    try {
      await service.editProcurement(
        user as any,
        existingProcurement.id,
        editProcurementDto,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(ConflictException);
    expect(error?.message).toBe(ErrorMessage.PROCUREMENT_ALREADY_APPROVED);
    expect(procurementModel_findById).toBeCalledTimes(1);
  });

  it('should not edit procurement and throw if item does not belong to company', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };

    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const editProcurementDto: Partial<CreateProcurementDto> = {
      qty: 10,
      supplierId,
      itemId,
    };

    const existingProcurement: Partial<ItemRequestDocument> = {
      id: faker.database.mongodbObjectId(),
      status: ItemRequestStatus.PENDING_APPROVAL,
      qty: 5,
      supplierId: 'previous-supplier-id',
      itemId: 'previous-item-id',
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(existingProcurement.id)
      .mockResolvedValue(existingProcurement as never);
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);
    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({
        companyId: 'wrong-company-id',
        id: itemId,
      } as never);

    let error: HttpException | undefined = undefined;
    try {
      await service.editProcurement(
        user as any,
        existingProcurement.id,
        editProcurementDto,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_NOT_FOUND);
    expect(procurementModel_findById).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(itemsService_getItem).toBeCalledTimes(1);
  });

  it('should not edit procurement and throw if supplier does not belong to company', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };

    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const editProcurementDto: Partial<CreateProcurementDto> = {
      qty: 10,
      supplierId,
      itemId,
    };

    const existingProcurement: Partial<ItemRequestDocument> = {
      id: faker.database.mongodbObjectId(),
      status: ItemRequestStatus.PENDING_APPROVAL,
      qty: 5,
      supplierId: 'previous-supplier-id',
      itemId: 'previous-item-id',
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(existingProcurement.id)
      .mockResolvedValue(existingProcurement as never);
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);
    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({
        companyId,
        id: itemId,
      } as never);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({ companyId: 'wrong-company-id' } as any);

    let error: HttpException | undefined = undefined;
    try {
      await service.editProcurement(
        user as any,
        existingProcurement.id,
        editProcurementDto,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.SUPPLIER_NOT_FOUND);
    expect(procurementModel_findById).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
  });

  it('should not edit procurement and throw if supplier does not provide item', async () => {
    const user: Partial<UserFlattened> = {
      _id: faker.database.mongodbObjectId(),
    };

    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const editProcurementDto: Partial<CreateProcurementDto> = {
      qty: 10,
      supplierId,
      itemId,
    };

    const existingProcurement: Partial<ItemRequestDocument> = {
      id: faker.database.mongodbObjectId(),
      status: ItemRequestStatus.PENDING_APPROVAL,
      qty: 5,
      supplierId: 'previous-supplier-id',
      itemId: 'previous-item-id',
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(existingProcurement.id)
      .mockResolvedValue(existingProcurement as never);
    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);
    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .expectCalledWith(itemId)
      .mockResolvedValue({
        companyId,
        id: itemId,
      } as never);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .expectCalledWith(supplierId)
      .mockResolvedValue({ companyId, items: {} } as any);

    let error: HttpException | undefined = undefined;
    try {
      await service.editProcurement(
        user as any,
        existingProcurement.id,
        editProcurementDto,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_NOT_FOUND);
    expect(procurementModel_findById).toBeCalledTimes(1);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
  });

  it('should delete procurement', async () => {
    const procurementId = faker.database.mongodbObjectId();
    const procurement: Partial<ItemRequestDocument> = {
      id: procurementId,
      status: ItemRequestStatus.PENDING_APPROVAL,
      deleteOne: jest.fn(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(procurementId)
      .mockResolvedValue(procurement as never);

    await service.deleteProcurement(procurementId);

    expect(procurement.deleteOne).toBeCalledTimes(1);
    expect(procurementModel_findById).toBeCalledTimes(1);
  });

  it('should not delete procurement and throw if procurement has begun approval', async () => {
    const procurementId = faker.database.mongodbObjectId();
    const procurement: Partial<ItemRequestDocument> = {
      id: procurementId,
      status: ItemRequestStatus.PARTIALLY_APPROVED,
      deleteOne: jest.fn(),
    };

    const procurementModel_findById = jest.spyOn(procurementModel, 'findById');
    when(procurementModel_findById)
      .expectCalledWith(procurementId)
      .mockResolvedValue(procurement as never);

    let error: HttpException | undefined = undefined;
    try {
      await service.deleteProcurement(procurementId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(ConflictException);
    expect(error?.message).toBe(ErrorMessage.PROCUREMENT_ALREADY_APPROVED);
    expect(procurement.deleteOne).toBeCalledTimes(0);
    expect(procurementModel_findById).toBeCalledTimes(1);
  });
});
