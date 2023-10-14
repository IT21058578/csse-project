import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  imageUrls: string[];
}
