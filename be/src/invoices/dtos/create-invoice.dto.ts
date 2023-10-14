import { IsArray, IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  procurementId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUrl({}, {each: true})
  invoiceUrls: string[];
}
