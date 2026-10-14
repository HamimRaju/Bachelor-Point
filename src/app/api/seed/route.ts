import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Bill from "@/models/Bill";

export async function GET() {
    try {
        await connectDB();

        // 1. Seed Default Cyclic Tasks if empty
        const taskCount = await Task.countDocuments();
        if (taskCount === 0) {
            await Task.insertMany([
                { title: "Polythene ana", status: "Pending", rotationOrder: 1 },
                { title: "Vimbar kena", status: "Pending", rotationOrder: 2 },
                { title: "Harpic ana", status: "Pending", rotationOrder: 3 },
                {
                    title: "Washroom clean",
                    status: "Pending",
                    rotationOrder: 4,
                },
                { title: "Jharu dewa", status: "Pending", rotationOrder: 5 },
                { title: "Lobon kena", status: "Pending", rotationOrder: 6 },
            ]);
        }

        // 2. Seed Default Monthly Bills if empty
        const billCount = await Bill.countDocuments();
        if (billCount === 0) {
            await Bill.insertMany([
                {
                    title: "WiFi Bill",
                    amount: 1200,
                    dueDate: "10th of every month",
                },
                {
                    title: "Moyla (Trash)",
                    amount: 300,
                    dueDate: "15th of every month",
                },
                {
                    title: "Basha Vara (Rent)",
                    amount: 25000,
                    dueDate: "1st of every month",
                },
            ]);
        }

        return NextResponse.json({
            success: true,
            message:
                "Bachelor Point database successfully seeded with initial tasks and bills!",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";

        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
