import mongoose, { Schema, Document } from "mongoose";

export interface ISplitShare {
    user: mongoose.Types.ObjectId;
    amount: number;
    status: "Pending" | "Paid";
    paidAt?: Date;
}

export interface IExpense extends Document {
    title: string;
    totalAmount: number;
    paidBy: mongoose.Types.ObjectId;
    splitBetween: ISplitShare[];
    createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        title: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        splitBetween: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                amount: { type: Number, required: true },
                status: {
                    type: String,
                    enum: ["Pending", "Paid"],
                    default: "Pending",
                },
                paidAt: { type: Date },
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.models.Expense ||
    mongoose.model<IExpense>("Expense", ExpenseSchema);
