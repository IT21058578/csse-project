export class CreateSupplierDto {
  name: string;
  email: string;
  mobiles: string[];
  accountNumbers: string[];
  companyId: string;
  items: Record<string, { rate: number }>;
}
