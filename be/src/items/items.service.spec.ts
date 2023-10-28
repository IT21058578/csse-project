import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { CompaniesService } from 'src/companies/companies.service';
import { Item, ItemDocument, ItemModel } from './item.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MockUtils } from 'src/common/util/mock.util';
import { when } from 'jest-when';
import { CompanyDocument } from 'src/companies/company.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { UserFlattened } from 'src/users/user.schema';
import { faker } from '@faker-js/faker';
import { BadRequestException, HttpException } from '@nestjs/common';
import ErrorMessage from 'src/common/enums/error-message.enum';

describe('Items Test suite', () => {
  let service: ItemsService;
  let companiesService: CompaniesService;
  let itemModel: ItemModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: CompaniesService,
          useValue: {
            getCompany: jest.fn(),
          },
        },
        {
          provide: getModelToken(Item.name),
          useValue: MockUtils.mockModel(itemModel),
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    itemModel = module.get<ItemModel>(getModelToken(Item.name));
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create item', async () => {
    const companyId = faker.database.mongodbObjectId();
    const user: Partial<UserFlattened> = {
      _id: 'user-id',
    };

    const createItemDto: CreateItemDto = {
      name: 'New Item',
      imageUrls: ['image-url-1', 'image-url-2'],
      companyId,
    };

    const company: Partial<CompanyDocument> = {
      id: companyId,
    };

    const itemModel_find = jest.spyOn(itemModel, 'find');
    when(itemModel_find)
      .calledWith(
        expect.objectContaining({ companyId, name: createItemDto.name }),
      )
      .mockReturnValue({ count: jest.fn().mockReturnValue(0) } as any);

    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .calledWith(companyId)
      .mockResolvedValue(company as any);

    const itemModel_create = jest.spyOn(itemModel, 'create');
    when(itemModel_create)
      .expectCalledWith(
        expect.objectContaining({
          name: createItemDto.name,
          imageUrls: createItemDto.imageUrls,
          companyId,
          createdBy: expect.any(String),
          createdAt: expect.any(Date),
        }),
      )
      .mockImplementation(async (arg1: any) => arg1);

    const result = await service.createItem(user as any, createItemDto);

    expect(result).toBeDefined();
    expect(result.name).toBe(createItemDto.name);
    expect(result.imageUrls).toEqual(createItemDto.imageUrls);
    expect(result.companyId).toBe(createItemDto.companyId);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdBy).toBe(user?._id);
    expect(companiesService_getCompany).toBeCalledTimes(1);
    expect(itemModel_create).toBeCalledTimes(1);
  });

  it('should not create item and throw if item with same name already exists', async () => {
    const companyId = faker.database.mongodbObjectId();
    const user: Partial<UserFlattened> = {
      _id: 'user-id',
    };

    const createItemDto: CreateItemDto = {
      name: 'New Item',
      imageUrls: ['image-url-1', 'image-url-2'],
      companyId,
    };

    const company: Partial<CompanyDocument> = {
      id: companyId,
    };

    const itemModel_find = jest.spyOn(itemModel, 'find');
    when(itemModel_find)
      .calledWith(
        expect.objectContaining({ companyId, name: createItemDto.name }),
      )
      .mockReturnValue({ count: jest.fn().mockReturnValue(1) } as any);

    const companiesService_getCompany = jest.spyOn(
      companiesService,
      'getCompany',
    );
    when(companiesService_getCompany)
      .calledWith(companyId)
      .mockResolvedValue(company as any);

    let error: HttpException | undefined = undefined;
    try {
      await service.createItem(user as any, createItemDto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_ALREADY_EXISTS);
    expect(companiesService_getCompany).toBeCalledTimes(1);
  });

  it('should edit item', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const user: Partial<UserFlattened> = {
      _id: 'user-id',
    };
    const editItemDto: CreateItemDto = {
      name: 'New Item Edited',
      imageUrls: ['new-image-url-1'],
      companyId,
    };
    const existingItem: Partial<ItemDocument> = {
      name: 'Existing Item',
      imageUrls: ['Bruh'],
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const itemModel_findById = jest.spyOn(itemModel, 'findById');
    when(itemModel_findById)
      .expectCalledWith(itemId)
      .mockResolvedValue(existingItem as never);
    const itemModel_find = jest.spyOn(itemModel, 'find');
    when(itemModel_find)
      .expectCalledWith(
        expect.objectContaining({ companyId, name: editItemDto.name }),
      )
      .mockReturnValue({ count: jest.fn().mockReturnValue(0) } as any);

    const result = await service.editItem(user as any, itemId, editItemDto);

    expect(result).toBeDefined();
    expect(result.name).toBe(editItemDto.name);
    expect(result.imageUrls).toEqual(editItemDto.imageUrls);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.updatedBy).toBe(user?._id);
    expect(result.save).toBeCalledTimes(1);
    expect(itemModel_findById).toBeCalledTimes(1);
    expect(itemModel_find).toBeCalledTimes(1);
  });

  it('should not edit item and throw if item with same name already exists', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const user: Partial<UserFlattened> = {
      _id: 'user-id',
    };
    const editItemDto: CreateItemDto = {
      name: 'New Item Edited',
      imageUrls: ['new-image-url-1'],
      companyId,
    };
    const existingItem: Partial<ItemDocument> = {
      name: 'Existing Item',
      imageUrls: ['Bruh'],
      companyId,
      save: jest.fn().mockReturnThis(),
    };

    const itemModel_findById = jest.spyOn(itemModel, 'findById');
    when(itemModel_findById)
      .expectCalledWith(itemId)
      .mockResolvedValue(existingItem as never);
    const itemModel_find = jest.spyOn(itemModel, 'find');
    when(itemModel_find)
      .expectCalledWith(
        expect.objectContaining({ companyId, name: editItemDto.name }),
      )
      .mockReturnValue({ count: jest.fn().mockReturnValue(1) } as any);

    let error: HttpException | undefined = undefined;
    try {
      await service.editItem(user as any, itemId, editItemDto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_ALREADY_EXISTS);
    expect(itemModel_findById).toBeCalledTimes(1);
    expect(itemModel_find).toBeCalledTimes(1);
  });

  it('should get item', async () => {
    const companyId = faker.database.mongodbObjectId();
    const itemId = faker.database.mongodbObjectId();
    const existingItem: Partial<ItemDocument> = {
      name: 'Existing Item',
      imageUrls: ['Bruh'],
      companyId,
    };

    const itemModel_findById = jest.spyOn(itemModel, 'findById');
    when(itemModel_findById)
      .expectCalledWith(itemId)
      .mockResolvedValue(existingItem as never);

    const result = await service.getItem(itemId);

    expect(result).toBeDefined();
    expect(itemModel_findById).toBeCalledTimes(1);
  });

  it('should not get item and throw if id is invalid', async () => {
    const itemId = faker.database.mongodbObjectId();

    const itemModel_findById = jest.spyOn(itemModel, 'findById');
    when(itemModel_findById)
      .expectCalledWith(itemId)
      .mockResolvedValue(null as never);

    let error: HttpException | undefined = undefined;
    try {
      await service.getItem(itemId);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe(ErrorMessage.ITEM_NOT_FOUND);
    expect(itemModel_findById).toBeCalledTimes(1);
  });
});
