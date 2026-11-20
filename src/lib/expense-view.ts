export type ExpenseShareStatus = "Pending" | "Paid";

export interface ExpenseShareView {
  memberId: string;
  memberName: string;
  amount: number;
  status: ExpenseShareStatus;
  paidAt: string | null;
  settledBy: string | null;
  settledByName: string | null;
}

export interface ExpenseView {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string;
  paidByName: string;
  createdAt: string;
  splitBetween: ExpenseShareView[];
}
