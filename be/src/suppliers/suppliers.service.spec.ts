import { Test } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { Supplier, SupplierModel } from './supplier.schema';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock.util';

describe('Suppliers Test suite', () => {
  let service: SuppliersService;
  let supplierModel: SupplierModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getModelToken(Supplier.name),
          useValue: MockUtils.mockModel(supplierModel),
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    supplierModel = module.get<SupplierModel>(getModelToken(Supplier.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('should create supplier');
  it.todo(
    'should not create supplier and throw if supplier with same name already exists',
  );
  it.todo('should edit supplier');
  it.todo(
    'should not edit supplier and throw if supplier with same name already exists',
  );
  it.todo('should get supplier');
  it.todo('should not get supplier and throw if id is invalid');
});
