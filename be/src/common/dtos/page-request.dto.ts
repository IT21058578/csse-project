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

export class PageRequest {
  pageNum: number;
  pageSize: number;
  sort?: {
    field: string;
    direction: SortOrder;
  };
  filter?: {
    [field: string]: { operator: CritieriaOperator; value: any };
  };
}
