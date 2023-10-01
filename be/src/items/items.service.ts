import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Company,
  CompanyModel,
  FlattenedItem,
} from 'src/companies/company.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { SortOrder } from 'mongoose';
import { PageBuilder } from 'src/common/util/page-builder';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: CompanyModel,
  ) {}

  async createItem(user: UserFlattened, createItemDto: CreateItemDto) {
    const { name, imageUrls, companyId } = createItemDto;
    const company = await this.companyModel.findById(companyId);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    const hasItemWithName = company.items.some((item) => item.name === name);
    if (hasItemWithName) {
      throw new BadRequestException(
        ErrorMessage.ITEM_ALREADY_EXISTS,
        `A item with the name '${name}' already exists`,
      );
    }

    company.items.push({
      name,
      imageUrls,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedCompany = await company.save();
    const savedItem = savedCompany.items.find((item) => item.name === name);

    if (savedItem === undefined) {
      throw new InternalServerErrorException();
    }

    return savedItem;
  }

  async editItem(user: UserFlattened, id: string, editItemDto: CreateItemDto) {
    const { name, imageUrls } = editItemDto;
    const company = await this.companyModel.findByItemId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Item with the id '${id}' was not found`,
      );
    }

    // Must definitely be present
    const itemIdx = company.items.findIndex((item) => item.id === id);
    company.items[itemIdx].name = name;
    company.items[itemIdx].imageUrls = imageUrls;
    company.items[itemIdx].updatedAt = new Date();
    company.items[itemIdx].updatedBy = user._id;
    const savedCompany = await company.save();

    const savedItem = savedCompany.items[itemIdx];

    if (savedItem === undefined) {
      throw new InternalServerErrorException();
    }

    return savedItem;
  }

  async deleteItem(id: string) {
    // Only company admin
    const company = await this.companyModel.findByItemId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Item with the id '${id}' was not found`,
      );
    }

    // Must definetely be present
    const deletedItem = await company.items.id(id)?.deleteOne()!;
    await company.save();
    return deletedItem;
  }

  async getItem(id: string) {
    const company = await this.companyModel.findByItemId(id);

    if (company == null) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Item with the id '${id}' was not found`,
      );
    }

    return company.items.id(id)!;
  }

  async getItemsPage(pageRequest: PageRequest) {
    const { pageNum, pageSize, filter, sort } = pageRequest;

    let query = {};
    let querySort: [string, SortOrder][] = [];

    if (filter !== undefined) {
      if (filter['companyId']) {
        query = { ...query, companyId: filter['companyId'].value };
      }
    }

    if (sort !== undefined) {
      if (sort.field === 'name') querySort.push(['name', sort.direction]);
    }

    const companies = await this.companyModel.find(query).sort(querySort);
    const items: FlattenedItem[] = [];

    // Iterate through and select only necessary items
    const start = (pageNum - 1) * pageSize;
    const end = pageNum * pageSize;
    let current = 0;
    companies.forEach((company) => {
      company.items.forEach((item) => {
        if (current >= start && current < end) {
          items.push(item.toJSON());
        }
        current += 1;
      });
    });

    const itemsPage = PageBuilder.buildPage(items, {
      pageNum,
      pageSize,
      sort,
      totalDocuments: current + 1,
    });

    return itemsPage;
  }
}
