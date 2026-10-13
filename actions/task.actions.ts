"use server";

import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

// 1. Get all Queue Tasks
export async function getQueueTasks() {
    await connectDB();
    const tasks = await Task.find({})
        .populate("currentAssignee", "name image email")
        .populate("queue", "name image email")
        .sort({ updatedAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(tasks));
}

// 2. Mark Task as Done / Kinlam
export async function completeTask(taskId: string, userId: string) {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    // Type safe index search without 'any'
    const currentIndex = task.queue.findIndex(
        (id: mongoose.Types.ObjectId | string) =>
            id.toString() === task.currentAssignee.toString(),
    );
    const nextIndex = (currentIndex + 1) % task.queue.length;

    task.history.push({
        user: userId,
        action: "Completed",
        timestamp: new Date(),
    });

    task.currentAssignee = task.queue[nextIndex];
    await task.save();

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
}

// 3. Skip Task / Porer Jon Kinbe
export async function skipTask(taskId: string, userId: string) {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");

    const currentIndex = task.queue.findIndex(
        (id: mongoose.Types.ObjectId | string) =>
            id.toString() === task.currentAssignee.toString(),
    );
    const nextIndex = (currentIndex + 1) % task.queue.length;

    task.history.push({
        user: userId,
        action: "Skipped",
        timestamp: new Date(),
    });

    task.currentAssignee = task.queue[nextIndex];
    await task.save();

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    return { success: true };
}
