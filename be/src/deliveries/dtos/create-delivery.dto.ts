import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  supplierId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  procurementId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;
}
