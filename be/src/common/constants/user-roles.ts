export const UserRole = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  PROCUREMENT_ADMIN: 'PROCUREMENT_ADMIN',
  SITE_ADMIN: 'SITE_ADMIN',
} as const;

export type UserRole = keyof typeof UserRole;