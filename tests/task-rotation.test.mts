import assert from "node:assert/strict";
import test from "node:test";
import { FLAT_MEMBERS, getMemberByEmail } from "../src/lib/members.ts";
import {
    applyRotationAction,
    createRotationCycle,
    ROTATING_TASKS,
    type RotationCycle,
    type TaskAction,
} from "../src/lib/task-rotation.ts";

test("the member and task registries contain only the five fixed entries", () => {
    assert.equal(FLAT_MEMBERS.length, 5);
    assert.equal(ROTATING_TASKS.length, 5);
    assert.equal(getMemberByEmail("  RAJU@BACHELORPOINT.COM ")?.name, "Raju");
    assert.equal(getMemberByEmail("outside@example.com"), null);
});

function act(
    cycle: RotationCycle,
    memberIndex: number,
    action: TaskAction,
): RotationCycle {
    const member = FLAT_MEMBERS[memberIndex];
    return applyRotationAction(cycle, {
        taskId: "test-task-id",
        authUserId: `auth-${memberIndex}`,
        memberId: member.id,
        memberName: member.name,
        action,
        occurredAt: new Date("2026-11-20T12:00:00.000Z"),
    });
}

test("members complete in the fixed order and the fifth completion ends the cycle", () => {
    let cycle = createRotationCycle(1, new Date("2026-11-20T00:00:00.000Z"));

    for (let index = 0; index < FLAT_MEMBERS.length; index += 1) {
        assert.equal(cycle.currentMemberId, FLAT_MEMBERS[index].id);
        cycle = act(cycle, index, "Completed");
        assert.equal(
            cycle.responsibilities.filter((item) => item.status === "Completed")
                .length,
            index + 1,
        );
    }

    assert.equal(cycle.status, "Completed");
    assert.equal(cycle.currentMemberId, null);
    assert.equal(cycle.history.length, 5);
});

test("a skipped member remains outstanding and returns after the first pass", () => {
    let cycle = createRotationCycle();

    cycle = act(cycle, 0, "Skipped");
    assert.equal(cycle.currentMemberId, FLAT_MEMBERS[1].id);
    assert.equal(cycle.responsibilities[0].status, "Skipped");
    assert.equal(
        cycle.responsibilities.filter((item) => item.status === "Completed")
            .length,
        0,
    );

    for (let index = 1; index < FLAT_MEMBERS.length; index += 1) {
        cycle = act(cycle, index, "Completed");
    }

    assert.equal(cycle.currentMemberId, FLAT_MEMBERS[0].id);
    assert.equal(
        cycle.responsibilities.filter((item) => item.status === "Completed")
            .length,
        4,
    );
    assert.throws(
        () => act(cycle, 0, "Skipped"),
        /already skipped/,
    );

    cycle = act(cycle, 0, "Completed");
    assert.equal(cycle.status, "Completed");
    assert.deepEqual(
        cycle.history.map((item) => item.action),
        ["Skipped", "Completed", "Completed", "Completed", "Completed", "Completed"],
    );
});

test("multiple skips stay outstanding until each member completes", () => {
    let cycle = createRotationCycle();
    cycle = act(cycle, 0, "Skipped");
    cycle = act(cycle, 1, "Skipped");
    cycle = act(cycle, 2, "Completed");
    cycle = act(cycle, 3, "Skipped");
    cycle = act(cycle, 4, "Completed");

    assert.equal(cycle.currentMemberId, FLAT_MEMBERS[0].id);
    assert.equal(
        cycle.responsibilities.filter((item) => item.status === "Completed")
            .length,
        2,
    );

    cycle = act(cycle, 0, "Completed");
    cycle = act(cycle, 1, "Completed");
    cycle = act(cycle, 3, "Completed");

    assert.equal(cycle.status, "Completed");
    assert.equal(
        cycle.responsibilities.every((item) => item.status === "Completed"),
        true,
    );
    assert.equal(
        cycle.history.filter((item) => item.action === "Skipped").length,
        3,
    );
});

test("non-current members cannot act and completing another member's turn is rejected", () => {
    const cycle = createRotationCycle();

    assert.throws(
        () => act(cycle, 1, "Completed"),
        /It is not your turn/,
    );
});

test("task cycles are independent and a new cycle starts with Raju", () => {
    const firstTask = createRotationCycle();
    const secondTask = createRotationCycle();
    const progressedFirstTask = act(firstTask, 0, "Completed");
    const nextCycle = createRotationCycle(2);

    assert.equal(progressedFirstTask.currentMemberId, FLAT_MEMBERS[1].id);
    assert.equal(secondTask.currentMemberId, FLAT_MEMBERS[0].id);
    assert.equal(secondTask.responsibilities[0].status, "Pending");
    assert.equal(nextCycle.currentMemberId, FLAT_MEMBERS[0].id);
    assert.equal(nextCycle.responsibilities.every((item) => item.status === "Pending"), true);
});
