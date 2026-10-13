"use server";

import connectDB from "../src/lib/db";
import Expense from "../src/models/Expense";
import { revalidatePath } from "next/cache";

// 1. Create Custom Split Expense
export async function createCustomExpense({
    title,
    totalAmount,
    paidById,
    memberIds,
}: {
    title: string;
    totalAmount: number;
    paidById: string;
    memberIds: string[];
}) {
    await connectDB();

    const shareAmount = totalAmount / memberIds.length;

    const splitBetween = memberIds.map((id) => ({
        user: id,
        amount: shareAmount,
        status: id === paidById ? "Paid" : "Pending", // Payer's share is automatically paid
        paidAt: id === paidById ? new Date() : undefined,
    }));

    await Expense.create({
        title,
        totalAmount,
        paidBy: paidById,
        splitBetween,
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true };
}

// 2. Settle Up / Mark Share as Paid (Porisodh Korun)
export async function settleExpenseShare(expenseId: string, userId: string) {
    await connectDB();

    const expense = await Expense.findById(expenseId);
    if (!expense) throw new Error("Expense not found");

    const share = expense.splitBetween.find(
        (s: { user: { toString: () => string } }) =>
            s.user.toString() === userId,
    );

    if (share) {
        share.status = "Paid";
        share.paidAt = new Date();
        await expense.save();
    }

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true };
}
