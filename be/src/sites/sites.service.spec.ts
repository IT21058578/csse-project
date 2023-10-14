import { Test } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { Site, SiteModel } from './site.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { MockUtils } from 'src/common/util/mock-util';
import { getModelToken } from '@nestjs/mongoose';

describe('Sites Test suite', () => {
  let service: SitesService;
  let companiesService: CompaniesService;
  let siteModel: SiteModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SitesService,
        { provide: CompaniesService, useValue: {} },
        {
          provide: getModelToken(Site.name),
          useValue: MockUtils.mockModel(siteModel),
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    siteModel = module.get<SiteModel>(getModelToken(Site.name));
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('should create site');
  it.todo(
    'should not create site and throw if site with same name already exists',
  );
  it.todo('should edit site');
  it.todo(
    'should not edit site and throw if site with same name already exists',
  );
  it.todo('should get site');
  it.todo('should not get site and throw if id is invalid');
});
