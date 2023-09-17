import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.schema';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserDocument } from 'src/users/user.schema';
import ErrorMessage from 'src/common/constants/error-message';
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

    const company = new this.companyModel();
    company.name = name;
    company.createdBy = user.id;
    company.createdAt = new Date();
    company.config = {};
    return await company.save();
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

    const company = await this.companyModel.findById(id);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    company.name = name;
    company.updatedBy = user.id;
    company.updatedAt = new Date();
    return await company.save();
  }

  async deleteCompany(id: string) {
    const company = await this.companyModel.findByIdAndDelete(id);
    const etst = await this.companyModel.find()
    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    return company;
  }

  async getCompany(id: string) {
    const company = await this.companyModel.findById(id);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    return company;
  }

  async getCompaniesPage({ pageNum = 1, pageSize = 10, sort }: PageRequest) {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, companies] = await Promise.all([
      this.companyModel.count({}),
      this.companyModel
        .find({})
        .select({ password: 0 })
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort?.field ?? '_id']: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const companiesPage = PageBuilder.buildPage(
      companies.map((company) => company.toJSON()),
      {
        pageNum,
        pageSize,
        totalDocuments,
        sort,
      },
    );

    return companiesPage;
  }
}
