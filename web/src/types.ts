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

export interface Site extends Audit {
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

export interface Item extends Audit {
  _id: string;
  companyId: string;
  name: string;
  imageUrls: string[];
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  country: string;
  password: string;
  roles: UserRole[];
  companyId: string;
}

type UserRole =
  | "SYSTEM_ADMIN"
  | "COMPANY_ADMIN"
  | "PROCUREMENT_ADMIN"
  | "SITE_ADMIN";

export interface Approval {
  companyId: string;
  procurementId: string;
  approvedBy: string;
  status: keyof typeof ApprovalStatus;
  refferredTo?: string;
  description?: string;
}

const ApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DISAPPROVED: "DISAPPROVED",
} as const;

export interface ItemRequest {
  _id: string;
  companyId: string;
  supplierId: string;
  itemId: string;
  siteId: string;
  qty: number;
  status: keyof typeof ItemRequestStatus;
  price: number;
}

const ItemRequestStatus = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PARTIALLY_APPROVED: "PARTIALLY_APPROVED",
  APPROVED: "APPROVED",
  PARTIALLY_DELIVERED: "PARTIALLY_DELIVERED",
  DELIVERED: "DELIVERED",
  PENDING_INVOICE: "PENDING_INVOICE",
  COMPLETED: "COMPLETED",
  DISAPPROVED: "DISAPPROVED",
} as const;

export interface UserDocument extends Audit {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: UserRole[];
  isAuthorized: boolean;
  companyId: string;
  siteIds: string[];
}

export interface Delivery extends Audit {
  _id: string;
  supplierId: string;
  procurementId: string;
  companyId: string;
  itemId: string;
  qty: number;
}

export interface Invoice extends Audit {
  _id: string;
  companyId: string;
  procurementId: string;
  supplierId: string;
  itemId: string;
  invoiceUrls: string[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAuthorized: boolean;
  companyId: string;
  siteIds: string[];
}
