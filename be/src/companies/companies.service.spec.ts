import { Test } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock.util';
import { Company, CompanyModel } from './company.schema';
import { when } from 'jest-when';
import { UserDocument } from 'src/users/user.schema';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('Companies Test suite', () => {
  let service: CompaniesService;
  let companyModel: CompanyModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: MockUtils.mockModel(companyModel),
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyModel = module.get<CompanyModel>(getModelToken(Company.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a company', async () => {
    const companyName = 'new-company';

    const createdCompany = when((arg1: Company) => {
      const isCorrectName = arg1.name === companyName;
      return isCorrectName;
    });
    const companyModel_findOne = jest.spyOn(companyModel, 'findOne');
    when(companyModel_findOne)
      .expectCalledWith(createdCompany)
      .mockResolvedValue(null as never);
    const companyModel_create = jest.spyOn(companyModel, 'create');
    when(companyModel_create)
      .expectCalledWith(createdCompany)
      .mockResolvedValue({
        name: companyName,
      } as never);

    const result = await service.createCompany({} as UserDocument, {
      name: companyName,
    });

    expect(result.name).toBe(companyName);
    expect(companyModel_findOne).toBeCalledTimes(1);
    expect(companyModel_create).toBeCalledTimes(1);
  });

  it('should not create a company and throw if name already exists', async () => {
    const companyName = 'new-company';

    const createdCompany = when((arg1: Company) => {
      const isCorrectName = arg1.name === companyName;
      return isCorrectName;
    });
    const companyModel_findOne = jest.spyOn(companyModel, 'findOne');
    when(companyModel_findOne)
      .expectCalledWith(createdCompany)
      .mockResolvedValue({ name: companyName } as never);

    const fn = async () =>
      await service.createCompany({} as UserDocument, {
        name: companyName,
      });

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.COMPANY_ALREADY_EXISTS);
    expect(companyModel_findOne).toBeCalledTimes(2);
  });

  it('should edit a company', async () => {
    const companyName = 'new-company-name';
    const oldCompanyName = 'company-name';
    const companyId = faker.database.mongodbObjectId();

    const createdCompany = when((arg1: Company) => {
      const isCorrectName = arg1.name === companyName;
      return isCorrectName;
    });
    const companyModel_findOne = jest.spyOn(companyModel, 'findOne');
    when(companyModel_findOne)
      .expectCalledWith(createdCompany)
      .mockResolvedValue(null as never);
    const companyModel_findById = jest.spyOn(companyModel, 'findById');
    when(companyModel_findById)
      .expectCalledWith(companyId)
      .mockResolvedValue({
        name: oldCompanyName,
        save: jest.fn().mockReturnThis(),
      } as never);

    const result = await service.editCompany({} as UserDocument, companyId, {
      name: companyName,
    } as Company);

    expect(result.name).toBe(companyName);
    expect(result.save).toBeCalledTimes(1);
    expect(companyModel_findOne).toBeCalledTimes(1);
    expect(companyModel_findById).toBeCalledTimes(1);
  });

  it('should not edit a company and throw if another company with name already exists', async () => {
    const companyName = 'new-company';
    const companyId = faker.database.mongodbObjectId();

    const createdCompany = when((arg1: Company) => {
      const isCorrectName = arg1.name === companyName;
      return isCorrectName;
    });
    const companyModel_findOne = jest.spyOn(companyModel, 'findOne');
    when(companyModel_findOne)
      .expectCalledWith(createdCompany)
      .mockResolvedValue({ name: companyName } as never);

    const fn = async () =>
      await service.editCompany({} as UserDocument, companyId, {
        name: companyName,
      });

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.COMPANY_ALREADY_EXISTS);
    expect(companyModel_findOne).toBeCalledTimes(2);
  });

  it('should delete a company', async () => {
    const companyId = faker.database.mongodbObjectId();
    const companyModel_findByIdAndDelete = jest.spyOn(
      companyModel,
      'findByIdAndDelete',
    );
    when(companyModel_findByIdAndDelete)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);

    const result = await service.deleteCompany(companyId);

    expect(result.id).toBe(companyId);
    expect(companyModel_findByIdAndDelete).toBeCalledTimes(1);
  });

  it('should not delete a company and throw if id is invalid', async () => {
    const companyId = faker.database.mongodbObjectId();
    const companyModel_findByIdAndDelete = jest.spyOn(
      companyModel,
      'findByIdAndDelete',
    );
    when(companyModel_findByIdAndDelete)
      .expectCalledWith(companyId)
      .mockResolvedValue(null as never);

    const fn = async () => await service.deleteCompany(companyId);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.COMPANY_NOT_FOUND);
    expect(companyModel_findByIdAndDelete).toBeCalledTimes(2);
  });

  it('should get a company', async () => {
    const companyId = faker.database.mongodbObjectId();
    const companyModel_findById = jest.spyOn(companyModel, 'findById');
    when(companyModel_findById)
      .expectCalledWith(companyId)
      .mockResolvedValue({ id: companyId } as never);

    const result = await service.getCompany(companyId);

    expect(result.id).toBe(companyId);
    expect(companyModel_findById).toBeCalledTimes(1);
  });

  it('should not get a company and throw if id is invalid', async () => {
    const companyId = faker.database.mongodbObjectId();
    const companyModel_findById = jest.spyOn(companyModel, 'findById');
    when(companyModel_findById)
      .expectCalledWith(companyId)
      .mockResolvedValue(null as never);

    const fn = async () => await service.getCompany(companyId);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.COMPANY_NOT_FOUND);
    expect(companyModel_findById).toBeCalledTimes(2);
  });
});
