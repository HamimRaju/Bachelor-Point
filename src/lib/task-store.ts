import "server-only";

import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db";
import { FLAT_MEMBERS, type FlatMember } from "@/lib/members";
import {
    applyRotationAction,
    createRotationCycle,
    ROTATING_TASKS,
    type RotationCycle,
    type TaskAction,
    type TaskRotationView,
} from "@/lib/task-rotation";
import Task, { type ITask } from "@/models/Task";

declare global {
    var taskRotationInitialization: Promise<void> | undefined;
}

function isDuplicateKeyError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
}

async function ensureTask(definition: (typeof ROTATING_TASKS)[number]) {
    const titles = [definition.title, ...definition.aliases];
    const existing = await Task.findOne({
        $or: [
            { rotationKey: definition.key },
            { title: { $in: titles.map((title) => new RegExp(`^${title}$`, "i")) } },
        ],
    })
        .collation({ locale: "en", strength: 2 })
        .exec();

    if (existing) {
        if (existing.rotationKey && existing.rotationKey !== definition.key) {
            return;
        }

        const updates: Record<string, unknown> = {};
        const filter: QueryFilter<ITask> = { _id: existing._id };

        if (!existing.rotationKey) {
            updates.rotationKey = definition.key;
            filter.rotationKey = { $exists: false };
        }
        if (!existing.activeCycle) {
            updates.activeCycle = createRotationCycle();
            filter.activeCycle = { $exists: false };
        }
        if (!existing.archivedCycles) {
            updates.archivedCycles = [];
            filter.archivedCycles = { $exists: false };
        }

        if (Object.keys(updates).length > 0) {
            await Task.updateOne(
                filter,
                { $set: updates, $inc: { __v: 1 } },
                { runValidators: true },
            );
        }
        return;
    }

    try {
        await Task.updateOne(
            { rotationKey: definition.key },
            {
                $setOnInsert: {
                    title: definition.title,
                    category: definition.category,
                    rotationKey: definition.key,
                    activeCycle: createRotationCycle(),
                    archivedCycles: [],
                },
            },
            { upsert: true, setDefaultsOnInsert: true, runValidators: true },
        );
    } catch (error) {
        // Another app instance may have created this task concurrently.
        if (!isDuplicateKeyError(error)) throw error;
    }
}

async function initializeRotationTasks() {
    await connectDB();
    await Task.init();

    for (const definition of ROTATING_TASKS) {
        await ensureTask(definition);
    }
}

export async function ensureRotationTasks() {
    if (!globalThis.taskRotationInitialization) {
        globalThis.taskRotationInitialization = initializeRotationTasks().catch(
            (error: unknown) => {
                globalThis.taskRotationInitialization = undefined;
                throw error;
            },
        );
    }

    await globalThis.taskRotationInitialization;
}

function toTaskRotationView(
    task: ITask & { _id: { toString(): string }; __v?: number },
    definition: (typeof ROTATING_TASKS)[number],
): TaskRotationView {
    const cycle = task.activeCycle;
    if (!cycle) {
        throw new Error(`Rotation data is missing for "${definition.title}".`);
    }

    const responsibilities = FLAT_MEMBERS.map((member) => {
        const saved = cycle.responsibilities.find(
            (item) => item.memberId === member.id,
        );

        return {
            memberId: member.id,
            name: member.name,
            image: member.image,
            status: saved?.status ?? "Pending",
            completedAt: saved?.completedAt?.toISOString() ?? null,
        };
    });

    return {
        id: task._id.toString(),
        version: task.__v ?? 0,
        key: definition.key,
        title: definition.title,
        category: definition.category,
        cycleId: cycle.cycleId,
        cycleNumber: cycle.cycleNumber,
        startedAt: cycle.startedAt.toISOString(),
        currentMemberId: cycle.currentMemberId,
        completedCount: responsibilities.filter(
            (item) => item.status === "Completed",
        ).length,
        responsibilities,
        history: [...cycle.history]
            .sort(
                (a, b) =>
                    b.occurredAt.getTime() - a.occurredAt.getTime(),
            )
            .map((item) => ({
                id: item.id,
                memberId: item.memberId,
                name:
                    FLAT_MEMBERS.find((member) => member.id === item.memberId)
                        ?.name ?? item.memberName,
                action: item.action,
                occurredAt: item.occurredAt.toISOString(),
            })),
    };
}

export async function getTaskRotationViews(): Promise<TaskRotationView[]> {
    await ensureRotationTasks();
    const tasks = await Task.find({
        rotationKey: { $in: ROTATING_TASKS.map((task) => task.key) },
    })
        .lean()
        .exec();
    const byKey = new Map(tasks.map((task) => [task.rotationKey, task]));

    return ROTATING_TASKS.map((definition) => {
        const task = byKey.get(definition.key);
        if (!task) throw new Error(`Task "${definition.title}" could not be loaded.`);
        return toTaskRotationView(
            task as ITask & { _id: { toString(): string } },
            definition,
        );
    });
}

export async function updateTaskRotation(
    taskKey: string,
    expectedCycleId: string,
    member: FlatMember & { authUserId: string },
    action: TaskAction,
): Promise<{ task: TaskRotationView; cycleCompleted: boolean }> {
    const definition = ROTATING_TASKS.find((task) => task.key === taskKey);
    if (!definition) throw new Error("This task is not part of the rotation.");

    await ensureRotationTasks();

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const task = await Task.findOne({ rotationKey: definition.key })
            .lean()
            .exec();
        if (!task?.activeCycle) {
            throw new Error(`Rotation data is missing for "${definition.title}".`);
        }
        if (task.activeCycle.cycleId !== expectedCycleId) {
            throw new Error("This rotation cycle changed. Refresh and try again.");
        }

        const updatedCycle = applyRotationAction(task.activeCycle as RotationCycle, {
            taskId: task._id.toString(),
            authUserId: member.authUserId,
            memberId: member.id,
            memberName: member.name,
            action,
        });
        const cycleCompleted = updatedCycle.status === "Completed";
        const nextCycle = cycleCompleted
            ? createRotationCycle(updatedCycle.cycleNumber + 1)
            : updatedCycle;

        const filter: QueryFilter<ITask> = { _id: task._id };
        if (task.__v === undefined) {
            filter.$or = [{ __v: { $exists: false } }, { __v: 0 }];
        } else {
            filter.__v = task.__v;
        }

        const result = await Task.updateOne(
            filter,
            {
                $set: { activeCycle: nextCycle },
                $inc: { __v: 1 },
                ...(cycleCompleted
                    ? { $push: { archivedCycles: updatedCycle } }
                    : {}),
            },
            { runValidators: true },
        );

        if (result.modifiedCount === 1) {
            const updatedTask = await Task.findOne({
                rotationKey: definition.key,
            })
                .lean()
                .exec();
            if (!updatedTask) throw new Error("The updated task could not be loaded.");

            return {
                task: toTaskRotationView(
                    updatedTask as ITask & { _id: { toString(): string } },
                    definition,
                ),
                cycleCompleted,
            };
        }
    }

    throw new Error("This task changed on another device. Refresh and try again.");
}
