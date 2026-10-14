"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Fetch current session data using Better Auth react hook
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        setLoading(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setLoading(false);
                    router.push("/");
                },
            },
        });
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-slate-900">
                    Profile & Settings
                </h1>
                <p className="text-xs text-slate-500">
                    আপনার একাউন্ট ও মেস সেটিংস
                </p>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-2xl font-black flex items-center justify-center shadow-md shadow-blue-600/30">
                    {session?.user?.name
                        ? session.user.name.slice(0, 2).toUpperCase()
                        : "RA"}
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        {session?.user?.name || "Sheikh Raju"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {session?.user?.email || "raju@bachelorpoint.com"}
                    </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full border border-blue-100">
                    Flat 3B Resident
                </span>
            </div>

            {/* Flatmates List Section */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Flatmates (5 Friends)
                </h3>
                <div className="space-y-2.5">
                    {[
                        "Sheikh Raju (You)",
                        "Rubel Ahmed",
                        "Arefin Khan",
                        "Real Hossain",
                        "Radin Ahmed",
                    ].map((name, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-600 text-xs flex items-center justify-center">
                                    {name[0]}
                                </div>
                                <span className="text-xs font-semibold text-slate-800">
                                    {name}
                                </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                                Active
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-2xl border border-rose-200 transition shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? "Signing out..." : "Sign Out / Log Out"}
            </button>
        </div>
    );
}
