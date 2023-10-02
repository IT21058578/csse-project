import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyModel } from 'src/companies/company.schema';
import { CreateSiteDto } from './dtos/create-site.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { Site, SiteModel } from './site.schema';

@Injectable()
export class SitesService {
  constructor(
    private readonly companiesService: CompaniesService,
    @InjectModel(Company.name) private readonly companyModel: CompanyModel,
    @InjectModel(Site.name) private readonly siteModel: SiteModel,
  ) {}

  async createSite(user: UserFlattened, createSiteDto: CreateSiteDto) {
    const { address, companyId, mobiles, name, siteManagerIds } = createSiteDto;
    await this.companiesService.getCompany(companyId); // Verification
    const hasSiteWithSameName = await this.siteModel
      .find({ companyId, name })
      .count();
    if (hasSiteWithSameName !== 0) {
    }

    const newSite = new this.siteModel({
      name,
      address,
      mobiles,
      companyId,
      siteManagerIds,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedSite = await newSite.save();

    return savedSite;
  }

  async editSite(user: UserFlattened, id: string, editSiteDto: CreateSiteDto) {
    const { address, mobiles, name, siteManagerIds } = editSiteDto;
    const existingSite = await this.getSite(id);
    const hasSiteWithSameName = await this.siteModel
      .find({ companyId: existingSite.companyId, name })
      .count();
    if (hasSiteWithSameName !== 0) {
    }

    existingSite.name = name;
    existingSite.address = address;
    existingSite.mobiles = mobiles;
    existingSite.siteManagerIds = siteManagerIds;
    existingSite.updatedAt = new Date();
    existingSite.updatedBy = user._id;

    const savedSite = await existingSite.save();
    return savedSite;
  }

  async getSite(id: string) {
    const existingSite = await this.siteModel.findById(id);

    if (existingSite == null) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Site with the id '${id}' was not found`,
      );
    }

    return existingSite;
  }

  async getSitesPage(pageRequest: PageRequest) {}
}
