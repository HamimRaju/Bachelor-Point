"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function validateEmail(value: string) {
        const emailValue = value.trim().toLowerCase();

        if (!emailValue.endsWith("@gmail.com")) {
            return "Please use a valid Gmail address.";
        }

        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailPattern.test(emailValue)) {
            return "Please enter a valid Gmail address.";
        }

        return "";
    }

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2) {
            setError("Please enter your name.");
            return;
        }

        const emailError = validateEmail(cleanEmail);

        if (emailError) {
            setError(emailError);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        const { error } = await authClient.signUp.email({
            name: cleanName,
            email: cleanEmail,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message || "Signup failed.");
            return;
        }

        router.push("/auth-test");
        router.refresh();
    }

    async function handleGoogleSignup() {
        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/auth-test",
        });

        if (error) {
            setLoading(false);
            setError(error.message || "Google signup failed.");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Bachelor Point
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Create your account
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                        />
                    </div>

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

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                minLength={8}
                                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            Minimum 8 characters
                        </p>
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
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />

                    <span className="text-xs text-slate-500">OR</span>

                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
                >
                    Sign up with Google
                </button>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-violet-400 hover:text-violet-300"
                    >
                        Login
                    </a>
                </p>
            </div>
        </main>
    );
}
