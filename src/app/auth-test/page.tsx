import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AuthTestPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
            <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-white/5 p-6 text-center shadow-2xl">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
                    ✓
                </div>

                <h1 className="text-2xl font-bold text-white">
                    Authentication Working
                </h1>

                <p className="mt-3 text-slate-400">
                    You are successfully logged in.
                </p>

                <div className="mt-6 rounded-2xl bg-white/5 p-4 text-left">
                    <p className="text-xs text-slate-500">Name</p>

                    <p className="mt-1 text-white">{session.user.name}</p>

                    <p className="mt-4 text-xs text-slate-500">Email</p>

                    <p className="mt-1 break-all text-white">
                        {session.user.email}
                    </p>

                    <p className="mt-4 text-xs text-slate-500">User ID</p>

                    <p className="mt-1 break-all text-xs text-slate-300">
                        {session.user.id}
                    </p>
                </div>
            </div>
        </main>
    );
}
