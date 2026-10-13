"use server";

import connectDB from "../src/lib/db";
import Bill from "../src/models/Bill";
import { revalidatePath } from "next/cache";

// Get All Monthly Bills
export async function getBills() {
    await connectDB();

    const bills = await Bill.find({}).populate("paidBy", "name email").lean();

    return JSON.parse(JSON.stringify(bills));
}

// Mark Individual Bill as Paid
export async function markBillAsPaid(billId: string, userId: string) {
    await connectDB();

    const bill = await Bill.findById(billId);

    if (!bill) {
        throw new Error("Bill not found");
    }

    // Avoid adding the same user more than once
    const alreadyPaid = bill.paidBy.some(
        (id: { toString(): string }) => id.toString() === userId,
    );

    if (!alreadyPaid) {
        bill.paidBy.push(userId);
        await bill.save();
    }

    revalidatePath("/bills");
    revalidatePath("/dashboard");

    return { success: true };
}
