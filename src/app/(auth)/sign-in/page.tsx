"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.email(
        { email: email.trim().toLowerCase(), password, rememberMe: true, callbackURL: "/dashboard" },
        {
          onSuccess: () => router.push("/dashboard"),
          onError: (context) => setError(context.error.message || "Sign in failed. Check your credentials."),
        },
      );
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Sign in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-backdrop flex items-center justify-center px-4 py-8">
      <SurfaceCard className="w-full max-w-sm p-6 sm:p-7">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#46F0D2] text-xl font-black text-[#131321]">B</div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-[#131321]/60">Sign in to your Bachelor Point account.</p>
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <label htmlFor="email" className="block text-xs font-bold">Email address
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="raju@bachelorpoint.com" className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-sm text-[#131321] placeholder:text-[#131321]/45" />
          </label>
          <label htmlFor="password" className="block text-xs font-bold">Password
            <span className="relative mt-1.5 block">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="••••••••" className="w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 pr-16 text-sm text-[#131321] placeholder:text-[#131321]/45" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#FBE2B4] px-2.5 py-1 text-[10px] font-bold">{showPassword ? "Hide" : "Show"}</button>
            </span>
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#46F0D2] py-3.5 text-sm font-bold text-[#131321] disabled:opacity-60">{loading ? "Signing in…" : "Sign In"}</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-2xl bg-[#FBE2B4] px-3 py-2 text-center text-xs font-semibold text-[#131321]">{error}</p>}
        <p className="mt-5 text-center text-xs text-[#131321]/60">Don&apos;t have an account? <Link href="/sign-up" className="font-bold text-[#131321] underline underline-offset-2">Sign up</Link></p>
      </SurfaceCard>
    </main>
  );
}
