import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateApprovalDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  refferredTo?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
