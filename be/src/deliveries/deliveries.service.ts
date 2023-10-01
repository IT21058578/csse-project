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
import { Page } from 'src/common/util/page-builder';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CompaniesService } from 'src/companies/companies.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { ItemsService } from 'src/items/items.service';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';

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
    const { itemId, qty, supplierId, companyId, procurementId } =
      createDeliveryDto;
    const [item, company, supplier, procurement] = await Promise.all([
      this.itemsService.getItem(itemId),
      this.companiesService.getCompany(companyId),
      this.suppliersService.getSupplier(supplierId),
      this.procurementsService.getProcurement(procurementId),
    ]);

    if (item.companyId !== company.id) {
      throw new BadRequestException(
        ErrorMessage.ITEM_NOT_FOUND,
        `Item with id '${itemId}' was not found`,
      );
    }

    if (supplier.companyId !== company.id) {
      throw new BadRequestException(
        ErrorMessage.SITE_NOT_FOUND,
        `Supplier with id '${supplierId}' was not found`,
      );
    }

    if (procurement.companyId !== company.id) {
      throw new BadRequestException(
        ErrorMessage.PROCUREMENT_NOT_FOUND,
        `Procurement with id '${procurementId}' was not found`,
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
        `This procurement is currently in '${procurement.status}' status which means it is no longer applicable for deliveries`,
      );
    }

    if (Object.keys(supplier.items).includes(item.id)) {
      throw new ConflictException(
        ErrorMessage.INVALID_SUPPLIER_ITEM,
        `Item with id '${itemId}' does not belong to supplier with id '${supplierId}' was not found`,
      );
    }

    const newDelivery = new this.deliveryModel({
      companyId,
      itemId,
      procurementId,
      qty,
      supplierId,
      createdAt: new Date(),
      createdBy: user.id,
    });
    const savedDelivery = await newDelivery.save();

    // If procurement qty is fulfilled, change its status.
    const allDeliveries = await this.deliveryModel.find({ procurementId });
    const totalQty = allDeliveries
      .map((delivery) => delivery.qty)
      .reduce((a, b) => a + b);
    
    if (totalQty >= procurement.qty) {
      procurement.status = ItemRequestStatus.PENDING_INVOICE;
      await procurement.save();
    }

    return savedDelivery;
  }

  async getDeliveriesPage(
    pageRequest: PageRequest,
  ): Promise<Page<FlatDelivery>> {}
}
