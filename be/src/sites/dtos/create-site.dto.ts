import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  mobiles: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  siteManagerIds: string[];
}
