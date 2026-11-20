import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getMemberByEmail } from "@/lib/members";

export async function getCurrentMember() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;

    const member = getMemberByEmail(session.user.email);
    if (!member) return null;

    return { ...member, authUserId: session.user.id };
}
