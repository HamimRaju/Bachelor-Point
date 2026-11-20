import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getCurrentMember } from "@/lib/current-member";
import { ensureRotationTasks } from "@/lib/task-store";
import Bill from "@/models/Bill";

export async function GET() {
    return NextResponse.json(
        { success: false, error: "Use POST to initialize the database." },
        { status: 405 },
    );
}

export async function POST() {
    const member = await getCurrentMember();
    if (!member) {
        return NextResponse.json(
            { success: false, error: "Authentication required." },
            { status: 401 },
        );
    }

    try {
        await ensureRotationTasks();
        await connectDB();

        if ((await Bill.countDocuments()) === 0) {
            const now = new Date();
            await Bill.insertMany([
                {
                    title: "WiFi Bill",
                    totalAmount: 1200,
                    perPersonAmount: 240,
                    dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
                },
                {
                    title: "Moyla (Trash)",
                    totalAmount: 300,
                    perPersonAmount: 60,
                    dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
                },
                {
                    title: "Basha Vara (Rent)",
                    totalAmount: 25000,
                    perPersonAmount: 5000,
                    dueDate: new Date(now.getFullYear(), now.getMonth(), 1),
                },
            ]);
        }

        return NextResponse.json({
            success: true,
            message: "Default tasks and bills are ready.",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
