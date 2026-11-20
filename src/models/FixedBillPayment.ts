import mongoose, { Schema } from "mongoose";

export interface IFixedBillPayment {
  _id: string;
  paidMemberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FixedBillPaymentSchema = new Schema<IFixedBillPayment>(
  {
    _id: { type: String, required: true },
    paidMemberIds: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.models.FixedBillPayment ||
  mongoose.model<IFixedBillPayment>(
    "FixedBillPayment",
    FixedBillPaymentSchema,
  );
