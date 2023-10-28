import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UserFlattened } from 'src/users/user.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Supplier, SupplierModel } from './supplier.schema';
import { PageBuilder } from 'src/common/util/page.util';
import { FlatSite } from 'src/sites/site.schema';
import { QueryUtil } from 'src/common/util/query.util';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: SupplierModel,
  ) {}

  async createSupplier(
    user: UserFlattened,
    createSupplierDto: CreateSupplierDto,
  ) {
    const { accountNumbers, email, items, mobiles, name, companyId } =
      createSupplierDto;
    const suppliersWithSameName = await this.supplierModel.find({ name });

    if (suppliersWithSameName?.length > 0) {
      throw new BadRequestException(
        ErrorMessage.SITE_ALREADY_EXISTS,
        `A supplier with the name '${name}' already exists`,
      );
    }

    const newSupplier = new this.supplierModel({
      companyId,
      name,
      mobiles,
      accountNumbers,
      email,
      items,
      createdAt: new Date(),
      createdBy: user?._id,
    });
    const savedSupplier = await newSupplier.save();
    return savedSupplier.toJSON();
  }

  async editSupplier(
    user: UserFlattened,
    id: string,
    editSupplierDto: CreateSupplierDto,
  ) {
    const { accountNumbers, email, items, mobiles, name } = editSupplierDto;
    const supplier = await this.getSupplier(id);

    // Must definitely be present
    supplier.name = name;
    supplier.accountNumbers = accountNumbers;
    supplier.email = email;
    supplier.items = items;
    supplier.mobiles = mobiles;
    supplier.updatedAt = new Date();
    supplier.updatedBy = user?._id;

    const savedSupplier = await supplier.save();
    return savedSupplier.toJSON();
  }

  async deleteSupplier(id: string) {
    // Only company admin
    const deletedSupplier = await this.supplierModel.findByIdAndDelete(id);
    if (deletedSupplier == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }
  }

  async getSupplier(id: string) {
    const supplier = await this.supplierModel.findById(id);
    if (supplier == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }
    return supplier;
  }

  async getSuppliersPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest) {
    // const itemIdQuery = filter?.item?.value?.reduce(
    //   (obj = {}, id = '') => ({ ...obj, [`items.${id}`]: { $exists: true } }),
    //   {},
    // );

    const [content, totalDocuments] = await Promise.all([
      this.supplierModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .sort(QueryUtil.buildSort(sort))
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.supplierModel
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
