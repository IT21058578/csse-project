import {
  IsArray,
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserRole } from '../enums/user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsIn(Object.values(UserRole), { each: true })
  roles: UserRole[];

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  companyId: string;
}
