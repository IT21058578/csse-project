import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/constants/error-message';
import { Company, CompanyModel } from 'src/companies/company.schema';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UserFlattened } from 'src/users/user.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: CompanyModel,
  ) {}

  async createSupplier(
    user: UserFlattened,
    createSupplierDto: CreateSupplierDto,
  ) {
    const { accountNumbers, email, items, mobiles, name, companyId } =
      createSupplierDto;
    const company = await this.companyModel.findById(companyId);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    const hasSupplierWithName = company.suppliers.some(
      (supplier) => supplier.name === name,
    );
    if (hasSupplierWithName) {
      throw new BadRequestException(
        ErrorMessage.SITE_ALREADY_EXISTS,
        `A supplier with the name '${name}' already exists`,
      );
    }

    company.suppliers.push({
      name,
      mobiles,
      accountNumbers,
      email,
      items,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedCompany = await company.save();
    const savedSupplier = savedCompany.suppliers.find(
      (supplier) => supplier.name === name,
    );

    if (savedSupplier === undefined) {
      throw new InternalServerErrorException();
    }

    return savedSupplier;
  }

  async editSupplier(
    user: UserFlattened,
    id: string,
    editSupplierDto: CreateSupplierDto,
  ) {
    const { accountNumbers, email, items, mobiles, name } = editSupplierDto;
    const company = await this.companyModel.findBySupplierId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }

    // Must definitely be present
    const supplierIdx = company.suppliers.findIndex((supplier) => supplier.id === id);
    company.suppliers[supplierIdx].name = name;
    company.suppliers[supplierIdx].accountNumbers = accountNumbers;
    company.suppliers[supplierIdx].email = email;
    company.suppliers[supplierIdx].items = items;
    company.suppliers[supplierIdx].mobiles = mobiles;
    company.suppliers[supplierIdx].updatedAt = new Date();
    company.suppliers[supplierIdx].updatedBy = user._id;
    const savedCompany = await company.save();

    const savedSupplier = savedCompany.suppliers[supplierIdx];

    if (savedSupplier === undefined) {
      throw new InternalServerErrorException();
    }

    return savedSupplier;
  }

  async deleteSupplier(id: string) {
    // Only company admin
    const company = await this.companyModel.findBySupplierId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }

    // Must definetely be present
    const deletedSupplier = await company.suppliers.id(id)?.deleteOne()!;
    await company.save();
    return deletedSupplier;
  }

  async getSupplier(id: string) {
    const company = await this.companyModel.findBySupplierId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }

    return company.suppliers.id(id)!;
  }

  async getSuppliersPage(pageRequest: PageRequest) {}
}
