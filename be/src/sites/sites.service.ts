import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSiteDto } from './dtos/create-site.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { FlatSite, Site, SiteModel } from './site.schema';
import { PageBuilder } from 'src/common/util/page.util';
import { QueryUtil } from 'src/common/util/query.util';

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
    const [content, totalDocuments] = await Promise.all([
      this.siteModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .sort(QueryUtil.buildSort(sort))
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.siteModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .count()
        .exec(),
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
