import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  mobiles: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  accountNumbers: string[];

  @IsString()
  companyId: string;

  @Type()
  @IsObject()
  @IsNotEmptyObject()
  items: Record<string, { rate: number }>;
}
