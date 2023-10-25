import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'mongoose';

export const CriteriaOperator = {
  EQUALS: 'EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  NOT_EQUAL: 'NOT_EQUAL',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  LIKE: 'LIKE',
} as const;

export type CritieriaOperator = keyof typeof CriteriaOperator;

class Sort {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([1, -1, 'asc', 'ascending', 'desc', 'descending'])
  direction: SortOrder;
}

export class PageRequest {
  @IsNumber()
  @IsOptional()
  pageNum: number;

  @IsNumber()
  @IsOptional()
  pageSize: number;

  @IsOptional()
  @IsObject()
  @Type(() => Sort)
  sort?: Sort;

  @IsOptional()
  @IsObject()
  filter?: {
    [field: string]: { operator: CritieriaOperator; value: any };
  };
}
