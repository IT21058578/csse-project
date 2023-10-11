import { Test } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getModelToken } from 'nestjs-typegoose';
import { MockUtils } from 'src/common/util/mock-util';
import { Company, CompanyModel } from './company.schema';

describe('Companies Test suite', () => {
  let service: CompaniesService;
  let companyModel: CompanyModel;
  
    beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [
            CompaniesService,
            {
              provide: getModelToken(Company.name),
              useValue: MockUtils.mockModelValue(companyModel),
            },
          ],
        }).compile();

      service = module.get<CompaniesService>(CompaniesService);
      companyModel = module.get<CompanyModel>(getModelToken(Company.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});