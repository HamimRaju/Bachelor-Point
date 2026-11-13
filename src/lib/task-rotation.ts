export type RotationAction = "done" | "skip";

export type RotationState = {
    memberIds: string[];
    currentIndex: number;
    completedMemberIds: string[];
    pendingMemberIds: string[];
};

export function applyRotationAction(
    state: RotationState,
    memberId: string,
    action: RotationAction,
): RotationState {
    const currentMemberId = state.memberIds[state.currentIndex];

    if (currentMemberId !== memberId) {
        throw new Error("You cannot update another member's turn.");
    }

    const completed = new Set(state.completedMemberIds);
    const pending = new Set(state.pendingMemberIds);

    if (action === "done") {
        completed.add(memberId);
        pending.delete(memberId);
    } else {
        // Keep the skipped member's obligation pending.
        pending.add(memberId);
    }

    const allCompleted = state.memberIds.every((id) => completed.has(id));

    if (allCompleted) {
        return {
            ...state,
            currentIndex: 0,
            completedMemberIds: [],
            pendingMemberIds: [],
        };
    }

    return {
        ...state,
        currentIndex: (state.currentIndex + 1) % state.memberIds.length,
        completedMemberIds: [...completed],
        pendingMemberIds: [...pending],
    };
}
