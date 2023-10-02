import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Invoice,
  InvoiceDocument,
  InvoiceModel,
  FlatInvoice,
} from './invoice.schema';
import { UserDocument } from 'src/users/user.schema';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { Page } from 'src/common/util/page-builder';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly procurementsService: ItemRequestsService,
    @InjectModel(Invoice.name) private readonly invoiceModel: InvoiceModel,
  ) {}

  async getInvoice(id: string): Promise<InvoiceDocument> {
    const existingInvoice = await this.invoiceModel.findById(id);
    if (existingInvoice === null) {
      throw new BadRequestException(
        ErrorMessage.INVOICE_NOT_FOUND,
        `Invoice with the id '${id}' was not found`,
      );
    }
    return existingInvoice;
  }

  async createInvoice(
    user: UserDocument,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceDocument> {
    const { companyId, itemId, procurementId, supplierId, invoiceUrls } =
      createInvoiceDto;
    const procurement = await this.procurementsService.getProcurement(
      procurementId,
    );

    if (procurement.itemId !== itemId) {
      throw new BadRequestException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Procurement with the id '${procurementId}' and item with the id '${itemId}' does not match`,
      );
    }

    if (procurement.supplierId !== supplierId) {
      throw new BadRequestException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Procurement with the id '${procurementId}' and supplier with the id '${supplierId}' does not match`,
      );
    }

    if (procurement.companyId !== companyId) {
      throw new BadRequestException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Procurement with the id '${procurementId}' and company with the id '${companyId}' does not match`,
      );
    }

    if (procurement.status !== ItemRequestStatus.PENDING_INVOICE) {
      throw new BadRequestException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Procurement with the id '${procurementId}' is currently in '${procurement.status}' status`,
      );
    }

    procurement.status = ItemRequestStatus.COMPLETED;
    procurement.updatedAt = new Date();
    procurement.updatedBy = user.id;
    const newInvoice = new this.invoiceModel({
      invoiceUrls,
      createdAt: new Date(),
      createdBy: user.id,
    });
    const [savedInvoice] = await Promise.all([
      newInvoice.save(),
      procurement.save(),
    ]);

    return savedInvoice;
  }

  async getInvoicesPage(pageRequest: PageRequest): Promise<Page<FlatInvoice>> {}
}
