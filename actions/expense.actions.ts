"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { getCurrentMember } from "@/lib/current-member";
import { FLAT_MEMBERS, getMemberByEmail } from "@/lib/members";
import type { ExpenseView } from "@/lib/expense-view";
import Expense from "@/models/Expense";

type StoredShare = {
  user: unknown;
  amount: number;
  status: "Pending" | "Paid";
  paidAt?: Date | string | null;
  settledBy?: unknown;
};

type StoredExpense = {
  _id: { toString(): string };
  title: string;
  totalAmount: number;
  paidBy: unknown;
  splitBetween: StoredShare[];
  createdAt: Date | string;
};

function storedId(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

function toIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toExpenseView(expense: StoredExpense): ExpenseView {
  const payerId = storedId(expense.paidBy);
  const payer = getMemberByEmail(payerId);

  return {
    id: expense._id.toString(),
    title: expense.title,
    totalAmount: expense.totalAmount,
    paidBy: payerId,
    paidByName: payer?.name ?? "Flatmate",
    createdAt: toIsoDate(expense.createdAt) ?? new Date().toISOString(),
    splitBetween: expense.splitBetween.map((share) => {
      const memberId = storedId(share.user);
      const settledBy = share.settledBy ? storedId(share.settledBy) : null;
      const member = getMemberByEmail(memberId);
      const settledByMember = settledBy ? getMemberByEmail(settledBy) : null;

      return {
        memberId,
        memberName: member?.name ?? "Flatmate",
        amount: share.amount,
        status: share.status,
        paidAt: toIsoDate(share.paidAt),
        settledBy,
        settledByName: settledByMember?.name ?? null,
      };
    }),
  };
}

async function requireCurrentMember() {
  const member = await getCurrentMember();
  if (!member) throw new Error("Sign in to manage shared expenses.");
  return member;
}

export async function getExpenses() {
  const member = await requireCurrentMember();
  await connectDB();

  const expenses = await Expense.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return {
    memberId: member.id,
    expenses: expenses.map((expense) =>
      toExpenseView(expense as unknown as StoredExpense),
    ),
  };
}

export async function createCustomExpense({
  title,
  totalAmount,
}: {
  title: string;
  totalAmount: number;
}) {
  const member = await requireCurrentMember();
  const cleanTitle = title.trim();

  if (!cleanTitle || cleanTitle.length > 100) {
    throw new Error("Enter an expense name between 1 and 100 characters.");
  }
  if (
    !Number.isSafeInteger(totalAmount) ||
    totalAmount <= 0 ||
    totalAmount > 100_000_000
  ) {
    throw new Error("Enter a valid whole amount greater than zero.");
  }

  await connectDB();
  const now = new Date();
  const baseShare = Math.floor(totalAmount / FLAT_MEMBERS.length);
  let remainder = totalAmount % FLAT_MEMBERS.length;
  const splitBetween = FLAT_MEMBERS.map((flatmate) => {
    const amount = baseShare + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;

    // The payer has already covered their part. A zero-value share is not a debt.
    const isSettled = flatmate.id === member.id || amount === 0;
    return {
      user: flatmate.id,
      amount,
      status: isSettled ? ("Paid" as const) : ("Pending" as const),
      paidAt: isSettled ? now : undefined,
      settledBy: isSettled ? member.id : undefined,
    };
  });

  const created = await Expense.create({
    title: cleanTitle,
    totalAmount,
    paidBy: member.id,
    splitBetween,
    createdAt: now,
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    memberId: member.id,
    expense: toExpenseView(created.toObject() as unknown as StoredExpense),
  };
}

export async function settleExpenseShare(expenseId: string) {
  const member = await requireCurrentMember();
  if (!mongoose.isValidObjectId(expenseId)) {
    throw new Error("This expense could not be found.");
  }

  await connectDB();
  const paidAt = new Date();
  const result = await Expense.updateOne(
    {
      _id: expenseId,
      splitBetween: {
        $elemMatch: { user: member.id, status: "Pending" },
      },
    },
    {
      $set: {
        "splitBetween.$.status": "Paid",
        "splitBetween.$.paidAt": paidAt,
        "splitBetween.$.settledBy": member.id,
      },
    },
    { runValidators: true },
  ).exec();

  const expense = await Expense.findById(expenseId).lean().exec();
  if (!expense) throw new Error("Expense not found.");

  const storedExpense = expense as unknown as StoredExpense;
  const share = storedExpense.splitBetween.find(
    (item: StoredShare) => storedId(item.user) === member.id,
  );
  if (!share) throw new Error("You do not have a share in this expense.");

  const alreadyPaid = result.modifiedCount === 0;
  if (alreadyPaid && share.status !== "Paid") {
    throw new Error("This payment could not be recorded. Please refresh and try again.");
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    expense: toExpenseView(storedExpense),
    alreadyPaid,
  };
}
