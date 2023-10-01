export class CreateInvoiceDto {
  companyId: string;
  procurementId: string;
  supplierId: string;
  itemId: string;
  invoiceUrls: string[];
}