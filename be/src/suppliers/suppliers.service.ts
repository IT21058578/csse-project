import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UserFlattened } from 'src/users/user.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Types } from 'mongoose';
import { Supplier, SupplierModel } from './supplier.schema';

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
      createdBy: user._id,
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
    const supplier = await this.supplierModel.findById(id);

    if (supplier == null) {
      throw new BadRequestException(
        ErrorMessage.SUPPLIER_NOT_FOUND,
        `Supplier with the id '${id}' was not found`,
      );
    }

    // Must definitely be present
    supplier.name = name;
    supplier.accountNumbers = accountNumbers;
    supplier.email = email;
    supplier.items = new Types.Map(Object.entries(items));
    supplier.mobiles = mobiles;
    supplier.updatedAt = new Date();
    supplier.updatedBy = user._id;
  
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

    return deletedSupplier.toJSON();
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

  async getSuppliersPage(pageRequest: PageRequest) {}
}
