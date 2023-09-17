import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyModel } from 'src/companies/company.schema';
import { CreateSiteDto } from './dtos/create-site.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/constants/error-message';
import { UserFlattened } from 'src/users/user.schema';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: CompanyModel,
  ) {}

  async createSite(user: UserFlattened, createSiteDto: CreateSiteDto) {
    const { address, companyId, mobiles, name, siteManagerIds } = createSiteDto;
    const company = await this.companyModel.findById(companyId);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    const hasSiteWithName = company.sites.some((site) => site.name === name);
    if (hasSiteWithName) {
      throw new BadRequestException(
        ErrorMessage.SITE_ALREADY_EXISTS,
        `A site with the name '${name}' already exists`,
      );
    }

    company.sites.push({
      name,
      address,
      mobiles,
      siteManagerIds,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedCompany = await company.save();
    const savedSite = savedCompany.sites.find((site) => site.name === name);

    if (savedSite === undefined) {
      throw new InternalServerErrorException();
    }

    return savedSite;
  }

  async editSite(user: UserFlattened, id: string, editSiteDto: CreateSiteDto) {
    const { address, mobiles, name, siteManagerIds } = editSiteDto;
    const company = await this.companyModel.findBySiteId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Site with the id '${id}' was not found`,
      );
    }

    // Must definitely be present
    const siteIdx = company.sites.findIndex((site) => site.id === id);
    company.sites[siteIdx].name = name;
    company.sites[siteIdx].address = address;
    company.sites[siteIdx].mobiles = mobiles;
    company.sites[siteIdx].siteManagerIds = siteManagerIds;
    company.sites[siteIdx].updatedAt = new Date();
    company.sites[siteIdx].updatedBy = user._id;
    const savedCompany = await company.save();

    const savedSite = savedCompany.sites[siteIdx];

    if (savedSite === undefined) {
      throw new InternalServerErrorException();
    }

    return savedSite;
  }

  async deleteSite(id: string) {
    // Only company admin
    const company = await this.companyModel.findBySiteId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Site with the id '${id}' was not found`,
      );
    }

    // Must definetely be present
    const deletedSite = await company.sites.id(id)?.deleteOne()!;
    await company.save();
    return deletedSite;
  }

  async getSite(id: string) {
    const company = await this.companyModel.findBySiteId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Site with the id '${id}' was not found`,
      );
    }

    return company.sites.id(id)!;
  }

  async getSitesPage(pageRequest: PageRequest) {}
}
