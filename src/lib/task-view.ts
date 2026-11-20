import type { TaskRotationView } from "@/lib/task-rotation";

export function mergeTaskRotationViews(
    current: TaskRotationView[],
    incoming: TaskRotationView[],
): TaskRotationView[] {
    const currentByKey = new Map(current.map((task) => [task.key, task]));

    return incoming.map((task) => {
        const existing = currentByKey.get(task.key);
        return existing && existing.version > task.version ? existing : task;
    });
}
