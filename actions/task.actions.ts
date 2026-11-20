"use server";

import { getCurrentMember } from "@/lib/current-member";
import { getTaskRotationViews, updateTaskRotation } from "@/lib/task-store";
import type { TaskAction, TaskRotationView } from "@/lib/task-rotation";

async function requireMember() {
    const member = await getCurrentMember();
    if (!member) {
        throw new Error("Please sign in with an authorized flatmate account.");
    }
    return member;
}

export async function getTaskRotations(): Promise<{
    memberId: string;
    tasks: TaskRotationView[];
}> {
    const member = await requireMember();
    const tasks = await getTaskRotationViews();

    return { memberId: member.id, tasks };
}

async function performTaskAction(
    taskKey: string,
    cycleId: string,
    action: TaskAction,
) {
    const member = await requireMember();
    const result = await updateTaskRotation(taskKey, cycleId, member, action);

    return result;
}

export async function completeTask(taskKey: string, cycleId: string) {
    return performTaskAction(taskKey, cycleId, "Completed");
}

export async function skipTask(taskKey: string, cycleId: string) {
    return performTaskAction(taskKey, cycleId, "Skipped");
}
