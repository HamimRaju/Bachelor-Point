import mongoose, { Schema, type Document } from "mongoose";
import type {
    MemberResponsibility,
    RotationCycle,
    TaskActivity,
} from "@/lib/task-rotation";

export interface ITask extends Document {
    title: string;
    category: "Shopping" | "Cleaning" | "Bills" | "Others";
    currentAssignee?: mongoose.Types.ObjectId;
    queue: mongoose.Types.ObjectId[];
    status: "Pending" | "Completed";
    history: {
        user: mongoose.Types.ObjectId;
        action: "Completed" | "Skipped";
        timestamp: Date;
    }[];
    rotationKey?: string;
    activeCycle?: RotationCycle;
    archivedCycles: RotationCycle[];
    createdAt: Date;
    updatedAt: Date;
}

const ResponsibilitySchema = new Schema<MemberResponsibility>(
    {
        memberId: { type: String, required: true },
        status: {
            type: String,
            enum: ["Pending", "Skipped", "Completed"],
            required: true,
        },
        completedAt: Date,
        lastSkippedAt: Date,
    },
    { _id: false },
);

const ActivitySchema = new Schema<TaskActivity>(
    {
        id: { type: String, required: true },
        taskId: { type: String, required: true },
        authUserId: { type: String, required: true },
        cycleId: { type: String, required: true },
        memberId: { type: String, required: true },
        memberName: { type: String, required: true },
        action: { type: String, enum: ["Completed", "Skipped"], required: true },
        occurredAt: { type: Date, required: true },
    },
    { _id: false },
);

const RotationCycleSchema = new Schema<RotationCycle>(
    {
        cycleId: { type: String, required: true },
        cycleNumber: { type: Number, required: true, min: 1 },
        startedAt: { type: Date, required: true },
        completedAt: Date,
        status: { type: String, enum: ["Active", "Completed"], required: true },
        currentMemberId: { type: String, default: null },
        responsibilities: {
            type: [ResponsibilitySchema],
            required: true,
            validate: {
                validator: (items: MemberResponsibility[]) => items.length === 5,
                message: "A rotation cycle must contain all five members.",
            },
        },
        history: { type: [ActivitySchema], default: [] },
    },
    { _id: false },
);

const LegacyHistorySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        action: { type: String, enum: ["Completed", "Skipped"] },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false },
);

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ["Shopping", "Cleaning", "Bills", "Others"],
            default: "Shopping",
        },
        // Retained for compatibility with pre-rotation task records.
        currentAssignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        queue: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        history: { type: [LegacyHistorySchema], default: [] },
        rotationKey: { type: String, unique: true, sparse: true },
        activeCycle: { type: RotationCycleSchema, default: undefined },
        archivedCycles: { type: [RotationCycleSchema], default: [] },
    },
    { timestamps: true },
);

export default mongoose.models.Task ||
    mongoose.model<ITask>("Task", TaskSchema);
