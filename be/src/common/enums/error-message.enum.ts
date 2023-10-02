const ErrorMessage = {
  // Not Found
  PRODUCT_NOT_FOUND: 'Product not found',
  USER_NOT_FOUND: 'User not found',
  TOKEN_NOT_FOUND: 'Token not found',
  REVIEW_NOT_FOUND: 'Review not found',
  FILE_NOT_FOUND: 'File not found',
  COMPANY_NOT_FOUND: 'Company not found',
  SITE_NOT_FOUND: 'Site not found',
  SUPPLIER_NOT_FOUND: 'Supplier not found',
  ITEM_NOT_FOUND: 'Item not found',
  PROCUREMENT_NOT_FOUND: 'Procurement not found',
  APPROVAL_NOT_FOUND: 'Approval not found',
  DELIVERY_NOT_FOUND: 'Delivery not found',
  INVOICE_NOT_FOUND: 'Invoice not found',

  // Already exists
  PRODUCT_ALREADY_EXISTS: 'Product already exists',
  USER_ALREADY_EXISTS: 'User already exists',
  COMPANY_ALREADY_EXISTS: 'Company already exists',
  SITE_ALREADY_EXISTS: 'Site already exists',
  SUPPLIER_ALREADY_EXISTS: 'Supplier already exists',
  ITEM_ALREADY_EXISTS: 'Item already exists',
  PROCUREMENT_ALREADY_EXISTS: 'Procurement already exists',
  APPROVAL_ALREADY_EXISTS: 'Approval already exists',
  DELIVERY_ALREADY_EXISTS: 'Delivery already exists',

  // Authoriztion
  INVALID_CREDENTIALS: 'Invalid credentials',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  NOT_AUTHENTICATED: 'Not authenticated',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_NOT_VERIFIEd: 'Email not verified',

  // Misc
  NOT_ENOUGH_STOCK: 'Not enough stock',
  INVALID_FILE_NAME: 'Invalid file name',
  NO_PROCUREMENT_ADMIN_CONFIGURED: 'No procurement administrator configured',
  PROCUREMENT_ALREADY_APPROVED: 'Procurement already approved',
  INVALID_PROCUREMENT_ITEM: 'Invalid procurement item',
  INVALID_SUPPLIER_ITEM: 'Invalid supplier item',
  INVALID_PROCUREMENT_STATUS: 'Invalid procurement status',
  INVALID_PROCUREMENT_COMPANY: 'Invalid procurement company',
  INVALID_PROCUREMENT_SUPPLIER: 'Invalid procurement supplier',
} as const;

export default ErrorMessage;
