// Interface for CompanyConfig
interface CompanyConfig {
  mustApproveItemIds?: string[];
  approvalThreshold?: number;
}

// Interface for Audit
interface Audit {
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Interface for Company
export interface Company extends Audit {
  _id: string;
  name: string;
  config: CompanyConfig;
}


export interface Site extends Audit{
  _id: string;
  companyId: string;
  name: string;
  address: string;
  mobiles: string[];
  siteManagerIds: string[];
}

export interface Supplier extends Audit {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  mobiles: string[];
  accountNumbers: string[];
  items: Record<string, { rate: number }>;
}

export interface Item extends Audit{
  _id: string;
  companyId: string;
  name: string;
  imageUrls: string[];
}


