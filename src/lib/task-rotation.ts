import { randomUUID } from "node:crypto";
import { FLAT_MEMBERS } from "./members.ts";

export const ROTATING_TASKS = [
    {
        key: "vim-bar-kena",
        title: "Vim Bar Kena",
        category: "Shopping",
        aliases: ["Vimbar kena", "Vimbar ana"],
    },
    {
        key: "dustbin-polythene-kena",
        title: "Dustin Polythene Kena",
        category: "Shopping",
        aliases: ["Polythene kena", "Polythene ana", "Dustbin Polythene Kena"],
    },
    {
        key: "washroom-clean",
        title: "Washroom Clean",
        category: "Cleaning",
        aliases: ["Washroom clean kora"],
    },
    {
        key: "harpic-kena",
        title: "Harpic Kena",
        category: "Shopping",
        aliases: ["Harpic ana"],
    },
    {
        key: "jharu-kena",
        title: "Jharu Kena",
        category: "Shopping",
        aliases: ["Jharu dewa"],
    },
] as const;

export type RotationTaskKey = (typeof ROTATING_TASKS)[number]["key"];
export type TaskAction = "Completed" | "Skipped";
export type ResponsibilityStatus = "Pending" | "Skipped" | "Completed";

export interface MemberResponsibility {
    memberId: string;
    status: ResponsibilityStatus;
    completedAt?: Date;
    lastSkippedAt?: Date;
}

export interface TaskActivity {
    id: string;
    taskId: string;
    authUserId: string;
    cycleId: string;
    memberId: string;
    memberName: string;
    action: TaskAction;
    occurredAt: Date;
}

export interface RotationCycle {
    cycleId: string;
    cycleNumber: number;
    startedAt: Date;
    completedAt?: Date;
    status: "Active" | "Completed";
    currentMemberId: string | null;
    responsibilities: MemberResponsibility[];
    history: TaskActivity[];
}

export interface TaskRotationView {
    id: string;
    version: number;
    key: RotationTaskKey;
    title: string;
    category: string;
    cycleId: string;
    cycleNumber: number;
    startedAt: string;
    currentMemberId: string | null;
    completedCount: number;
    responsibilities: Array<{
        memberId: string;
        name: string;
        image: string;
        status: ResponsibilityStatus;
        completedAt: string | null;
    }>;
    history: Array<{
        id: string;
        memberId: string;
        name: string;
        action: TaskAction;
        occurredAt: string;
    }>;
}

export function createRotationCycle(
    cycleNumber = 1,
    startedAt = new Date(),
): RotationCycle {
    return {
        cycleId: randomUUID(),
        cycleNumber,
        startedAt,
        status: "Active",
        currentMemberId: FLAT_MEMBERS[0].id,
        responsibilities: FLAT_MEMBERS.map((member) => ({
            memberId: member.id,
            status: "Pending",
        })),
        history: [],
    };
}

export function normalizeRotationCycleHistory(
    cycle: RotationCycle,
): RotationCycle {
    let hasLegacyHistory = false;
    const history = cycle.history.map((activity) => {
        if (activity.authUserId) return activity;

        hasLegacyHistory = true;
        return { ...activity, authUserId: "legacy" };
    });

    return hasLegacyHistory ? { ...cycle, history } : cycle;
}

function nextEligibleMember(
    cycle: RotationCycle,
    currentIndex: number,
): string | null {
    for (const status of ["Pending", "Skipped"] as const) {
        for (let offset = 1; offset <= FLAT_MEMBERS.length; offset += 1) {
            const member =
                FLAT_MEMBERS[(currentIndex + offset) % FLAT_MEMBERS.length];
            const responsibility = cycle.responsibilities.find(
                (item) => item.memberId === member.id,
            );

            if (responsibility?.status === status) {
                return member.id;
            }
        }
    }

    return null;
}

export function applyRotationAction(
    cycle: RotationCycle,
    {
        taskId,
        authUserId,
        memberId,
        memberName,
        action,
        occurredAt = new Date(),
    }: {
        taskId: string;
        authUserId: string;
        memberId: string;
        memberName: string;
        action: TaskAction;
        occurredAt?: Date;
    },
): RotationCycle {
    if (cycle.status !== "Active") {
        throw new Error("This rotation cycle has already completed.");
    }

    if (cycle.currentMemberId !== memberId) {
        throw new Error("It is not your turn for this task.");
    }

    const responsibility = cycle.responsibilities.find(
        (item) => item.memberId === memberId,
    );

    if (!responsibility) {
        throw new Error("Member is not part of this rotation.");
    }

    if (responsibility.status === "Completed") {
        throw new Error("This responsibility has already been completed.");
    }
    if (action === "Skipped" && responsibility.status === "Skipped") {
        throw new Error("You have already skipped this turn; it remains yours to complete.");
    }

    const responsibilities = cycle.responsibilities.map((item) => {
        if (item.memberId !== memberId) return item;

        return action === "Completed"
            ? { ...item, status: "Completed" as const, completedAt: occurredAt }
            : { ...item, status: "Skipped" as const, lastSkippedAt: occurredAt };
    });
    const history = [
        ...cycle.history,
        {
            id: randomUUID(),
            taskId,
            authUserId,
            cycleId: cycle.cycleId,
            memberId,
            memberName,
            action,
            occurredAt,
        },
    ];
    const allCompleted = responsibilities.every(
        (item) => item.status === "Completed",
    );
    const updatedCycle: RotationCycle = {
        ...cycle,
        responsibilities,
        history,
        status: allCompleted ? "Completed" : "Active",
        completedAt: allCompleted ? occurredAt : undefined,
        currentMemberId: null,
    };

    if (allCompleted) return updatedCycle;

    const currentIndex = FLAT_MEMBERS.findIndex(
        (member) => member.id === memberId,
    );
    updatedCycle.currentMemberId = nextEligibleMember(updatedCycle, currentIndex);
    return updatedCycle;
}
