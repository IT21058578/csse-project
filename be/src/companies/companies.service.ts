import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Company, FlatCompany } from './company.schema';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserDocument } from 'src/users/user.schema';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { PageBuilder } from 'src/common/util/page-builder';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async createCompany(user: UserDocument, { name }: CreateCompanyDto) {
    const existingCompany = await this.companyModel.findOne({ name });

    if (existingCompany != null) {
      throw new BadRequestException(
        ErrorMessage.COMPANY_ALREADY_EXISTS,
        `Company with the name ${name} already exists`,
      );
    }

    const savedCompany = await this.companyModel.create({
      name,
      createdBy: user?.id,
      createdAt: new Date(),
      config: {},
    });
    return savedCompany;
  }

  async editCompany(
    user: UserDocument,
    id: string,
    { name }: CreateCompanyDto,
  ) {
    const companyWithSameName = await this.companyModel.findOne({ name });

    if (companyWithSameName != null) {
      throw new BadRequestException(
        ErrorMessage.COMPANY_ALREADY_EXISTS,
        'Company with this name already exists',
      );
    }

    const company = await this.getCompany(id);
    company.name = name;
    company.updatedBy = user.id;
    company.updatedAt = new Date();
    return await company.save();
  }

  async deleteCompany(id: string) {
    const company = await this.companyModel.findByIdAndDelete(id);
    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    // TODO: Delete all corresponding

    return company;
  }

  async getCompany(id: string) {
    const company = await this.companyModel.findById(id);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    return company;
  }

  async getCompaniesPage({
    pageNum = 1,
    pageSize = 10,
    sort,
    filter,
  }: PageRequest) {
    const query = this.companyModel.find({
      name: filter?.name?.value,
      siteIds: { $in: filter?.siteIds?.value },
      itemsIds: { $in: filter?.itemsIds?.value },
      supplierIds: { $in: filter?.supplierIds.value },
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
    const jsonContent = content.map((doc) =>
      doc.toJSON(),
    ) satisfies FlatCompany[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
