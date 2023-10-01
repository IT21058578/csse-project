import { Injectable } from '@nestjs/common';
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

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: InvoiceModel,
  ) {}

  async getInvoice(id: string): Promise<InvoiceDocument> {}

  async createInvoice(
    user: UserDocument,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceDocument> {}

  async getInvoicesPage(pageRequest: PageRequest): Promise<Page<FlatInvoice>> {}
}
