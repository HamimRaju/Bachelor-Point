"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
        });

        setLoading(false);

        if (error) {
            setError(error.message || "Login failed.");
            return;
        }

        router.push("/auth-test");
        router.refresh();
    }

    async function handleGoogleLogin() {
        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/auth-test",
        });

        if (error) {
            setLoading(false);
            setError(error.message || "Google login failed.");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Bachelor Point
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">Welcome back</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Gmail
                        </label>

                        <input
                            type="email"
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-slate-500">OR</span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
                >
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Dont have an account?{" "}
                    <a
                        href="/signup"
                        className="font-semibold text-violet-400 hover:text-violet-300"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </main>
    );
}
