import { Test } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { Invoice, InvoiceDocument, InvoiceModel } from './invoice.schema';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock.util';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { faker } from '@faker-js/faker';
import { ItemRequestDocument } from 'src/item-requests/item-request.schema';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { when } from 'jest-when';
import { UserDocument } from 'src/users/user.schema';
import { BadRequestException } from '@nestjs/common';
import ErrorMessage from 'src/common/enums/error-message.enum';

describe('Invoices Test suite', () => {
  let service: InvoicesService;
  let procurementsService: ItemRequestsService;
  let invoiceModel: InvoiceModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: MockUtils.mockModel(invoiceModel),
        },
        {
          provide: ItemRequestsService,
          useValue: {
            getProcurement: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    invoiceModel = module.get<InvoiceModel>(getModelToken(Invoice.name));
    procurementsService = module.get<ItemRequestsService>(ItemRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get invoice', async () => {
    const invoiceId = faker.database.mongodbObjectId();
    const invoice: Partial<InvoiceDocument> = {
      id: invoiceId,
    };
    const invoiceModel_findById = jest.spyOn(invoiceModel, 'findById');
    when(invoiceModel_findById)
      .expectCalledWith(invoiceId)
      .mockResolvedValue(invoice as never);

    const result = await service.getInvoice(invoiceId);

    expect(result).toBeDefined();
    expect(result.id).toBe(invoiceId);
    expect(invoiceModel_findById).toBeCalledTimes(1);
  });

  it('should not get invoice and throw if id is invalid', async () => {
    const invoiceId = faker.database.mongodbObjectId();
    const invoiceModel_findById = jest.spyOn(invoiceModel, 'findById');
    when(invoiceModel_findById)
      .expectCalledWith(invoiceId)
      .mockResolvedValue(null as never);

    const fn = async () => await service.getInvoice(invoiceId);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.INVOICE_NOT_FOUND);
    expect(invoiceModel_findById).toBeCalledTimes(2);
  });

  it('should create invoice', async () => {
    const procurementId = faker.database.mongodbObjectId();
    const invoiceUrl = faker.internet.url();
    const createInvoiceDto: CreateInvoiceDto = {
      procurementId,
      invoiceUrls: [invoiceUrl],
    };
    const procurement: Partial<ItemRequestDocument> = {
      id: procurementId,
      status: ItemRequestStatus.PENDING_INVOICE,
      save: jest.fn(),
    };
    const procurementsService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementsService_getProcurement)
      .expectCalledWith(procurementId)
      .mockResolvedValue(procurement as never);
    const invoiceModel_create = jest
      .spyOn(invoiceModel, 'create')
      .mockImplementation((arg1: any) => arg1);

    const result = await service.createInvoice(
      {} as UserDocument,
      createInvoiceDto,
    );

    expect(result).toBeDefined();
    expect(result.invoiceUrls).toContain(invoiceUrl);
    expect(result.createdAt).toBeDefined();
    expect(invoiceModel_create).toBeCalledTimes(1);
    expect(procurementsService_getProcurement).toBeCalledTimes(1);
  });

  it('should not create invoice and throw if procurement is in invalid status', async () => {
    const procurementId = faker.database.mongodbObjectId();
    const invoiceUrl = faker.internet.url();
    const createInvoiceDto: CreateInvoiceDto = {
      procurementId,
      invoiceUrls: [invoiceUrl],
    };
    const procurement: Partial<ItemRequestDocument> = {
      id: procurementId,
      status: ItemRequestStatus.APPROVED,
      save: jest.fn(),
    };
    const procurementsService_getProcurement = jest.spyOn(
      procurementsService,
      'getProcurement',
    );
    when(procurementsService_getProcurement)
      .expectCalledWith(procurementId)
      .mockResolvedValue(procurement as never);
    const invoiceModel_create = jest
      .spyOn(invoiceModel, 'create')
      .mockImplementation((arg1: any) => arg1);

    const fn = async () =>
      await service.createInvoice({} as UserDocument, createInvoiceDto);

    expect(fn).rejects.toThrow(BadRequestException);
    expect(fn).rejects.toThrow(ErrorMessage.INVALID_PROCUREMENT_ITEM);
    expect(procurementsService_getProcurement).toBeCalledTimes(2);
  });
});
