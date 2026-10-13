import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
    title: string;
    totalAmount: number;
    perPersonAmount: number;
    dueDate: Date;
    status: "Unpaid" | "Overdue" | "Paid";
    paidBy: mongoose.Types.ObjectId[]; // List of User IDs who paid
    createdAt: Date;
    updatedAt: Date;
}

const BillSchema = new Schema<IBill>(
    {
        title: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        perPersonAmount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["Unpaid", "Overdue", "Paid"],
            default: "Unpaid",
        },
        paidBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true },
);

export default mongoose.models.Bill ||
    mongoose.model<IBill>("Bill", BillSchema);
