export const ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
} as const;

export type ApprovalStatus = keyof typeof ApprovalStatus;
