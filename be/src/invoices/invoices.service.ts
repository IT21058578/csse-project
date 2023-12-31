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
import { Page, PageBuilder } from 'src/common/util/page.util';
import { InjectModel } from '@nestjs/mongoose';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { ItemRequestsService } from 'src/item-requests/item-requests.service';
import { ItemRequestStatus } from 'src/common/enums/item-request-status.enum';
import { QueryUtil } from 'src/common/util/query.util';

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
    const { procurementId, invoiceUrls } = createInvoiceDto;
    const procurement = await this.procurementsService.getProcurement(
      procurementId,
    );

    if (procurement.status !== ItemRequestStatus.PENDING_INVOICE) {
      throw new BadRequestException(
        ErrorMessage.INVALID_PROCUREMENT_ITEM,
        `Procurement with the id '${procurementId}' is currently in '${procurement.status}' status`,
      );
    }

    procurement.status = ItemRequestStatus.COMPLETED;
    procurement.updatedAt = new Date();
    procurement.updatedBy = user.id;
    const newInvoicePromise = this.invoiceModel.create({
      invoiceUrls,
      createdAt: new Date(),
      createdBy: user.id,
    });
    const [savedInvoice] = await Promise.all([
      newInvoicePromise,
      procurement.save(),
    ]);

    return savedInvoice;
  }

  async getInvoicesPage({
    pageNum = 1,
    pageSize = 10,
    filter,
    sort,
  }: PageRequest): Promise<Page<FlatInvoice>> {
    const [content, totalDocuments] = await Promise.all([
      this.invoiceModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .sort(QueryUtil.buildSort(sort))
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.invoiceModel
        .find(QueryUtil.buildQueryFromFilter(filter))
        .count()
        .exec(),
    ]);
    const jsonContent = content.map((doc) =>
      doc.toJSON(),
    ) satisfies FlatInvoice[];
    const page = PageBuilder.buildPage(jsonContent, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });
    return page;
  }
}
