export const FIXED_BILL_KEYS = ["wifi", "moyla", "rent"] as const;
export type FixedBillKey = (typeof FIXED_BILL_KEYS)[number];

export interface FixedBillView {
  key: FixedBillKey;
  paidMemberIds: string[];
}
