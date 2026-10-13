import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  category: "Shopping" | "Cleaning" | "Bills" | "Others";
  currentAssignee: mongoose.Types.ObjectId; // User whose turn it currently is
  queue: mongoose.Types.ObjectId[];        // Array of User IDs defining rotation order
  status: "Pending" | "Completed";
  history: {
    user: mongoose.Types.ObjectId;
    action: "Completed" | "Skipped";
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Shopping", "Cleaning", "Bills", "Others"],
      default: "Shopping",
    },
    currentAssignee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    queue: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    history: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        action: { type: String, enum: ["Completed", "Skipped"] },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);