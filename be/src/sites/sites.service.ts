import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSiteDto } from './dtos/create-site.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { FlatSite, Site, SiteModel } from './site.schema';
import { SortOrder } from 'mongoose';
import { PageBuilder } from 'src/common/util/page-builder';

@Injectable()
export class SitesService {
  constructor(
    private readonly companiesService: CompaniesService,
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

  async getSitesPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest) {
    const query = this.siteModel.find({
      companyId: filter?.companyId?.value,
      mobiles: { $in: [...filter?.mobiles?.value] },
      siteManagerIds: { $in: [...filter?.siteManagerIds?.value] },
      name:
        filter?.companyId?.operator === 'LIKE'
          ? { $regex: filter?.companyId?.value }
          : filter?.companyId?.value,
      address:
        filter?.address?.operator === 'LIKE'
          ? { $regex: filter?.address?.value }
          : filter?.address?.value,
    });
    const sortArr: [string, SortOrder][] = Object.entries(sort ?? {}).map(
      ([key, value]) => [key, value as SortOrder],
    );
    const [content, totalDocuments] = await Promise.all([
      query
        .clone()
        .sort(sortArr)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      query.clone().count().exec(),
    ]);
    const jsonContent = content.map((doc) => doc.toJSON()) satisfies FlatSite[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
