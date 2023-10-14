import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProcurementDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  supplierId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  siteId: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;
}
