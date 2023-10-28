import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { FlattenedItem, Item, ItemModel } from './item.schema';
import { CompaniesService } from 'src/companies/companies.service';
import { PageBuilder } from 'src/common/util/page.util';
import { QueryUtil } from 'src/common/util/query.util';

@Injectable()
export class ItemsService {
  constructor(
    private readonly companiesService: CompaniesService,
    @InjectModel(Item.name) private readonly itemModel: ItemModel,
  ) {}

  async createItem(user: UserFlattened, createItemDto: CreateItemDto) {
    const { name, imageUrls, companyId } = createItemDto;
    const company = await this.companiesService.getCompany(companyId);

    if (company == null) {
      throw new BadRequestException(ErrorMessage.COMPANY_NOT_FOUND);
    }

    const hasItemWithSameName = await this.itemModel
      .find({ companyId, name })
      .count();
    if (hasItemWithSameName !== 0) {
      throw new BadRequestException(
        ErrorMessage.ITEM_ALREADY_EXISTS,
        `Item with name ${name} already exists`,
      );
    }

    const savedItem = await this.itemModel.create({
      name,
      imageUrls,
      companyId,
      createdAt: new Date(),
      createdBy: user?._id,
    });

    return savedItem;
  }

  async editItem(user: UserFlattened, id: string, editItemDto: CreateItemDto) {
    const { name, imageUrls } = editItemDto;
    const existingItem = await this.getItem(id);

    if (name) {
      const hasItemWithSameName = await this.itemModel
        .find({ companyId: existingItem.companyId, name })
        .count();
      if (hasItemWithSameName !== 0) {
        throw new BadRequestException(
          ErrorMessage.ITEM_ALREADY_EXISTS,
          `Item with name ${name} already exists`,
        );
      }
    }

    existingItem.name = name ?? existingItem.name;
    existingItem.imageUrls = imageUrls ?? existingItem.imageUrls;
    existingItem.updatedAt = new Date();
    existingItem.updatedBy = user?._id;
    const savedItem = await existingItem.save();

    return savedItem;
  }

  async getItem(id: string) {
    const existingItem = await this.itemModel.findById(id);

    if (existingItem == null) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Item with the id '${id}' was not found`,
      );
    }

    return existingItem;
  }

  async getItemsPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest) {
    const [content, totalDocuments] = await Promise.all([
      this.itemModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .sort(QueryUtil.buildSort(sort))
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.itemModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .count()
        .exec(),
    ]);
    const jsonContent = content.map((doc) =>
      doc.toJSON(),
    ) satisfies FlattenedItem[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
