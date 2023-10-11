import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  Delivery,
  DeliveryDocument,
  DeliveryModel,
  FlatDelivery,
} from './delivery.schema';
import { UserDocument } from 'src/users/user.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CompaniesService } from 'src/companies/companies.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { ItemsService } from 'src/items/items.service';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { SortOrder } from 'mongoose';

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly suppliersService: SuppliersService,
    private readonly itemsService: ItemsService,
    private readonly procurementsService: ItemRequestsService,
    @InjectModel(Delivery.name) private readonly deliveryModel: DeliveryModel,
  ) {}

  async getDelivery(id: string): Promise<DeliveryDocument> {
    const existingDelivery = await this.deliveryModel.findById(id);
    if (existingDelivery === null) {
      throw new BadRequestException(
        ErrorMessage.DELIVERY_NOT_FOUND,
        `Delivery with the id ${id} was not found`,
      );
    }
    return existingDelivery;
  }

  async createDelivery(
    user: UserDocument,
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<DeliveryDocument> {
    const { itemId, qty, supplierId, procurementId } = createDeliveryDto;
    const [item, procurement] = await Promise.all([
      this.itemsService.getItem(itemId),
      this.procurementsService.getProcurement(procurementId),
    ]);
    const supplier = await this.suppliersService.getSupplier(
      procurement.supplierId,
    );

    if (procurement.companyId !== item.companyId) {
      throw new BadRequestException(
        ErrorMessage.PROCUREMENT_NOT_FOUND,
        `Procurement with id '${procurementId}' does not belong to this company`,
      );
    }

    if (procurement.itemId !== item.id) {
      throw new ConflictException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Item with id '${itemId}' does not belong to procurement with id '${procurementId}'`,
      );
    }

    if (
      ![
        ItemRequestStatus.PARTIALLY_DELIVERED,
        ItemRequestStatus.APPROVED,
      ].includes(procurement.status as any)
    ) {
      throw new ConflictException(
        ErrorMessage.INVALID_PROCUREMENT_STATUS,
        `This procurement is in '${procurement.status}' status which means it is not applicable for deliveries`,
      );
    }

    if (!Object.keys(supplier.items).includes(item.id)) {
      throw new ConflictException(
        ErrorMessage.INVALID_SUPPLIER_ITEM,
        `Item with id '${itemId}' does not belong to supplier with id '${supplierId}'`,
      );
    }

    const newDelivery = await this.deliveryModel.create({
      companyId: item.companyId,
      itemId,
      procurementId,
      qty,
      supplierId,
      createdAt: new Date(),
      createdBy: user?.id,
    });

    // If procurement qty is fulfilled, change its status.
    const allDeliveries = await this.deliveryModel.find({ procurementId });
    const totalQty = allDeliveries
      .map((delivery) => delivery.qty)
      .reduce((a, b) => a + b);

    if (totalQty >= procurement.qty) {
      procurement.status = ItemRequestStatus.PENDING_INVOICE;
      await procurement.save();
    }

    return newDelivery;
  }

  async getDeliveriesPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest): Promise<Page<FlatDelivery>> {
    const query = this.deliveryModel.find({
      companyId: filter?.companyId?.value,
      itemId: filter?.itemId?.value,
      supplierId: filter?.supplierId?.value,
      procurementId: filter?.procurementId?.value,
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
    ) satisfies FlatDelivery[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
