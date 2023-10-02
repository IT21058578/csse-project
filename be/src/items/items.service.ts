import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { UserFlattened } from 'src/users/user.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { Item, ItemModel } from './item.schema';
import { CompaniesService } from 'src/companies/companies.service';

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
    }

    const newItem = new this.itemModel({
      name,
      imageUrls,
      companyId,
      createdAt: new Date(),
      createdBy: user._id,
    });
    const savedItem = await newItem.save();

    return savedItem;
  }

  async editItem(user: UserFlattened, editItemDto: CreateItemDto) {
    const { id, name, imageUrls } = editItemDto;

    if (id === undefined) {
      throw new BadRequestException();
    }

    const existingItem = await this.getItem(id);

    // Must definitely be present
    existingItem.name = name ?? existingItem.name;
    existingItem.imageUrls = imageUrls ?? existingItem.imageUrls;
    existingItem.updatedAt = new Date();
    existingItem.updatedBy = user._id;
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

  async getItemsPage(pageRequest: PageRequest) {}
}
