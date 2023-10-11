import { Test } from '@nestjs/testing';
import { DeliveriesService } from './deliveries.service';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock-util';
import { Delivery, DeliveryDocument, DeliveryModel } from './delivery.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { ItemsService } from 'src/items/items.service';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { faker } from '@faker-js/faker';
import { when } from 'jest-when';
import { BadRequestException, ConflictException } from '@nestjs/common';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { ItemRequestDocument } from 'src/item-requests/item-request.schema';
import { SupplierDocument } from 'src/suppliers/supplier.schema';
import { ItemDocument } from 'src/items/item.schema';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { UserDocument } from 'src/users/user.schema';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';

describe('Deliveries Test suite', () => {
  let service: DeliveriesService;
  let deliveryModel: DeliveryModel;
  let suppliersService: SuppliersService;
  let procurementsService: ItemRequestsService;
  let itemsService: ItemsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: getModelToken(Delivery.name),
          useValue: MockUtils.mockModel(deliveryModel),
        },
        {
          provide: CompaniesService,
          useValue: {
            getCompany: jest.fn(),
          },
        },
        {
          provide: SuppliersService,
          useValue: {
            getSupplier: jest.fn(),
          },
        },
        {
          provide: ItemsService,
          useValue: {
            getItem: jest.fn(),
          },
        },
        {
          provide: ItemRequestsService,
          useValue: {
            getProcurement: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    deliveryModel = module.get<DeliveryModel>(getModelToken(Delivery.name));
    suppliersService = module.get<SuppliersService>(SuppliersService);
    itemsService = module.get<ItemsService>(ItemsService);
    procurementsService = module.get<ItemRequestsService>(ItemRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get delivery', async () => {
    const deliveryId = faker.database.mongodbObjectId();

    const deliveryModel_findById = jest.spyOn(deliveryModel, 'findById');
    when(deliveryModel_findById)
      .calledWith(deliveryId)
      .mockResolvedValue({
        id: deliveryId,
      } satisfies Partial<DeliveryDocument> as never);

    const result = await service.getDelivery(deliveryId);

    expect(result.id).toBe(deliveryId);
    expect(deliveryModel_findById).toBeCalledTimes(1);
  });

  it('should not get delivery and throw if id is invalid', async () => {
    const deliveryId = faker.database.mongodbObjectId();

    const deliveryModel_findById = jest.spyOn(deliveryModel, 'findById');
    when(deliveryModel_findById)
      .calledWith(deliveryId)
      .mockResolvedValue(null as never);

    const fn = async () => await service.getDelivery(deliveryId);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.DELIVERY_NOT_FOUND);
    expect(deliveryModel_findById).toBeCalledTimes(2);
  });

  it('should create delivery', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const rate = 10;
    const createDeliveryDto = {
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as CreateDeliveryDto;
    const existingDelivery = {
      id: faker.database.mongodbObjectId(),
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as Partial<DeliveryDocument>;
    const procurement = {
      id: procurementId,
      itemId,
      companyId,
      supplierId,
      qty: 20,
      status: ItemRequestStatus.PARTIALLY_DELIVERED,
      save: jest.fn(),
    } as Partial<ItemRequestDocument>;
    const supplier = {
      id: supplierId,
      items: { [itemId]: { rate } },
    } as Partial<SupplierDocument>;
    const item = { id: itemId, companyId } as Partial<ItemDocument>;

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .calledWith(itemId)
      .mockResolvedValue(item as any);
    const procurementService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as any);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .calledWith(supplierId)
      .mockResolvedValue(supplier as any);
    const deliveryModel_create = jest
      .spyOn(deliveryModel, 'create')
      .mockImplementation(async (arg1: any) => arg1);
    const isCorrectQuery = when((arg1: any) => {
      const isProcurementIdCorrect = arg1.procurementId === procurementId;
      return isProcurementIdCorrect;
    });
    const deliveryModel_find = jest.spyOn(deliveryModel, 'find');
    when(deliveryModel_find)
      .expectCalledWith(isCorrectQuery as any)
      .mockResolvedValue([existingDelivery, { qty: createDeliveryDto.qty }]);

    const result = await service.createDelivery(
      {} as UserDocument,
      createDeliveryDto,
    );

    expect(result).toBeDefined();
    expect(result.qty).toBe(createDeliveryDto.qty);
    expect(result.itemId).toBe(itemId);
    expect(result.companyId).toBe(companyId);
    expect(result.procurementId).toBe(procurementId);
    expect(result.supplierId).toBe(supplierId);
    expect(result.createdAt).toBeDefined();
    expect(itemsService_getItem).toBeCalledTimes(1);
    expect(procurementService_getProcurement).toBeCalledTimes(1);
    expect(suppliersService_getSupplier).toBeCalledTimes(1);
    expect(deliveryModel_create).toBeCalledTimes(1);
    expect(deliveryModel_find).toBeCalledTimes(1);
    expect(procurement.save).toBeCalledTimes(1);
    expect(procurement.status).toBe(ItemRequestStatus.PENDING_INVOICE);
  });

  it('should not create delivery and throw if procurement not from same company', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const rate = 10;
    const createDeliveryDto = {
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as CreateDeliveryDto;
    const procurement = {
      id: procurementId,
      itemId,
      companyId: 'incorrect-company-id',
      supplierId,
      qty: 20,
      status: ItemRequestStatus.PARTIALLY_DELIVERED,
      save: jest.fn(),
    } as Partial<ItemRequestDocument>;
    const supplier = {
      id: supplierId,
      items: { [itemId]: { rate } },
    } as Partial<SupplierDocument>;
    const item = { id: itemId, companyId } as Partial<ItemDocument>;

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .calledWith(itemId)
      .mockResolvedValue(item as any);
    const procurementService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as any);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .calledWith(supplierId)
      .mockResolvedValue(supplier as any);

    const fn = async () =>
      await service.createDelivery({} as UserDocument, createDeliveryDto);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.PROCUREMENT_NOT_FOUND);
    expect(itemsService_getItem).toBeCalledTimes(2);
    expect(procurementService_getProcurement).toBeCalledTimes(2);
  });

  it('should not create delivery and throw if procurement item id does not match', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const rate = 10;
    const createDeliveryDto = {
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as CreateDeliveryDto;
    const procurement = {
      id: procurementId,
      itemId: 'incorrect-item-id',
      companyId,
      supplierId,
      qty: 20,
      status: ItemRequestStatus.PARTIALLY_DELIVERED,
      save: jest.fn(),
    } as Partial<ItemRequestDocument>;
    const supplier = {
      id: supplierId,
      items: { [itemId]: { rate } },
    } as Partial<SupplierDocument>;
    const item = { id: itemId, companyId } as Partial<ItemDocument>;

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .calledWith(itemId)
      .mockResolvedValue(item as any);
    const procurementService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as any);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .calledWith(supplierId)
      .mockResolvedValue(supplier as any);

    const fn = async () =>
      await service.createDelivery({} as UserDocument, createDeliveryDto);

    expect(fn).rejects.toThrow(ConflictException);
    expect(fn).rejects.toThrow(ErrorMessage.INVALID_PROCUREMENT_ITEM);
    expect(itemsService_getItem).toBeCalledTimes(2);
    expect(procurementService_getProcurement).toBeCalledTimes(2);
  });

  it('should not create delivery and throw if procurement is in invalid status', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const rate = 10;
    const createDeliveryDto = {
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as CreateDeliveryDto;
    const procurement = {
      id: procurementId,
      itemId,
      companyId,
      supplierId,
      qty: 20,
      status: ItemRequestStatus.COMPLETED,
      save: jest.fn(),
    } as Partial<ItemRequestDocument>;
    const supplier = {
      id: supplierId,
      items: { [itemId]: { rate } },
    } as Partial<SupplierDocument>;
    const item = { id: itemId, companyId } as Partial<ItemDocument>;

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .calledWith(itemId)
      .mockResolvedValue(item as any);
    const procurementService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as any);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .calledWith(supplierId)
      .mockResolvedValue(supplier as any);

    const fn = async () =>
      await service.createDelivery({} as UserDocument, createDeliveryDto);

    expect(fn).rejects.toThrow(ConflictException);
    expect(fn).rejects.toThrow(ErrorMessage.INVALID_PROCUREMENT_STATUS);
    expect(itemsService_getItem).toBeCalledTimes(2);
    expect(procurementService_getProcurement).toBeCalledTimes(2);
  });

  it('should not create delivery and throw if supplier does not have item', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const procurementId = faker.database.mongodbObjectId();
    const supplierId = faker.database.mongodbObjectId();
    const createDeliveryDto = {
      itemId,
      procurementId,
      qty: 10,
      supplierId,
    } as CreateDeliveryDto;
    const procurement = {
      id: procurementId,
      itemId,
      companyId,
      supplierId,
      qty: 20,
      status: ItemRequestStatus.PARTIALLY_DELIVERED,
      save: jest.fn(),
    } as Partial<ItemRequestDocument>;
    const supplier = {
      id: supplierId,
      items: {},
    } as Partial<SupplierDocument>;
    const item = { id: itemId, companyId } as Partial<ItemDocument>;

    const itemsService_getItem = jest.spyOn(itemsService, 'getItem');
    when(itemsService_getItem)
      .calledWith(itemId)
      .mockResolvedValue(item as any);
    const procurementService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementService_getProcurement)
      .calledWith(procurementId)
      .mockResolvedValue(procurement as any);
    const suppliersService_getSupplier = jest.spyOn(
      suppliersService,
      'getSupplier',
    );
    when(suppliersService_getSupplier)
      .calledWith(supplierId)
      .mockResolvedValue(supplier as any);

    const fn = async () =>
      await service.createDelivery({} as UserDocument, createDeliveryDto);

    expect(fn).rejects.toThrow(ConflictException);
    expect(fn).rejects.toThrow(ErrorMessage.INVALID_SUPPLIER_ITEM);
    expect(itemsService_getItem).toBeCalledTimes(2);
    expect(procurementService_getProcurement).toBeCalledTimes(2);
  });
});
