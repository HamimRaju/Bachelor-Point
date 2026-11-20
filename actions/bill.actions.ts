"use server";

import connectDB from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentMember } from "@/lib/current-member";
import { FLAT_MEMBERS } from "@/lib/members";
import FixedBillPayment from "@/models/FixedBillPayment";
import {
    FIXED_BILL_KEYS,
    type FixedBillKey,
    type FixedBillView,
} from "@/lib/bill-view";

type FixedBillPaymentRecord = {
    _id: string;
    paidMemberIds?: string[];
};

async function requireCurrentMember() {
    const member = await getCurrentMember();
    if (!member) throw new Error("Sign in to manage monthly bills.");
    return member;
}

export async function getFixedBills() {
    const member = await requireCurrentMember();
    await connectDB();

    const payments = await FixedBillPayment.find({
        _id: { $in: [...FIXED_BILL_KEYS] },
    }).lean().exec() as unknown as FixedBillPaymentRecord[];
    const paymentsByKey = new Map(
        payments.map((payment) => [
            payment._id,
            (payment.paidMemberIds ?? []).map(String),
        ]),
    );

    return {
        memberId: member.id,
        bills: FIXED_BILL_KEYS.map((key) => ({
            key,
            paidMemberIds: paymentsByKey.get(key) ?? [],
        })),
    };
}

export async function markFixedBillAsPaid(billKey: string) {
    const member = await requireCurrentMember();
    if (!FIXED_BILL_KEYS.includes(billKey as FixedBillKey)) {
        throw new Error("This bill could not be found.");
    }
    const key = billKey as FixedBillKey;

    await connectDB();
    const update = await FixedBillPayment.updateOne(
        { _id: key },
        { $addToSet: { paidMemberIds: member.id } },
        { upsert: true, setDefaultsOnInsert: true },
    ).exec();
    const payment = await FixedBillPayment.findById(key).lean().exec() as unknown as
        | FixedBillPaymentRecord
        | null;
    if (!payment) throw new Error("Could not record this bill payment.");

    const knownMemberIds = new Set(FLAT_MEMBERS.map((flatmate) => flatmate.id));
    const paidMemberIds = [
        ...new Set(
            (payment.paidMemberIds ?? [])
                .map(String)
                .filter((memberId) =>
                    knownMemberIds.has(memberId as typeof FLAT_MEMBERS[number]["id"]),
                ),
        ),
    ];

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    revalidatePath("/bills");

    return {
        memberId: member.id,
        bill: { key, paidMemberIds } satisfies FixedBillView,
        alreadyPaid: update.modifiedCount === 0 && update.upsertedCount === 0,
    };
}
