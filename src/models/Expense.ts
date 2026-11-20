import mongoose, { Schema, Document } from "mongoose";

export interface ISplitShare {
    user: string;
    amount: number;
    status: "Pending" | "Paid";
    paidAt?: Date;
    settledBy?: string;
}

export interface IExpense extends Document {
    title: string;
    totalAmount: number;
    paidBy: string;
    splitBetween: ISplitShare[];
    createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        title: { type: String, required: true, trim: true, maxlength: 100 },
        totalAmount: { type: Number, required: true },
        paidBy: { type: String, required: true },
        splitBetween: [
            {
                user: { type: String, required: true },
                amount: { type: Number, required: true },
                status: {
                    type: String,
                    enum: ["Pending", "Paid"],
                    default: "Pending",
                },
                paidAt: { type: Date },
                settledBy: { type: String },
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.models.Expense ||
    mongoose.model<IExpense>("Expense", ExpenseSchema);
