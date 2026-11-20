"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMemberByEmail } from "@/lib/members";
import { SurfaceCard } from "@/components/ui";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const member = getMemberByEmail(email);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authClient.signUp.email(
        { email: email.trim().toLowerCase(), password, name: member?.name ?? "", callbackURL: "/dashboard" },
        {
          onSuccess: () => router.push("/dashboard"),
          onError: (context) => setError(context.error.message || "Sign up failed. Check your details."),
        },
      );
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : "Sign up failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-backdrop flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
      <SurfaceCard className="w-full max-w-sm p-5 sm:p-7">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#46F0D2] text-xl font-black text-[#131321]">B</div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">Create account</h1>
        <p className="mt-1 text-center text-sm text-[#131321]/60">Join your flat on Bachelor Point.</p>
        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <label htmlFor="name" className="block text-xs font-bold">Member name
            <input id="name" type="text" value={member?.name ?? ""} readOnly autoComplete="name" aria-describedby="member-name-help" placeholder="Enter your assigned email first" className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-base text-[#131321] placeholder:text-[#131321]/45 read-only:cursor-default sm:text-sm" />
            <span id="member-name-help" className="sr-only">Member name is matched to the authorized email address.</span>
          </label>
          <label htmlFor="email" className="block text-xs font-bold">Email address
            <input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(null); }} required autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="raju@bachelorpoint.com" className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-base text-[#131321] placeholder:text-[#131321]/45 sm:text-sm" />
          </label>
          <label htmlFor="password" className="block text-xs font-bold">Password
            <span className="relative mt-1.5 block">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 pr-16 text-base text-[#131321] placeholder:text-[#131321]/45 sm:text-sm" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#FBE2B4] px-2.5 py-1 text-[10px] font-bold">{showPassword ? "Hide" : "Show"}</button>
            </span>
          </label>
          <button type="submit" disabled={loading || !member} className="w-full rounded-full bg-[#46F0D2] py-3.5 text-sm font-bold text-[#131321] disabled:opacity-60">{loading ? "Creating account…" : "Sign Up"}</button>
        </form>
        {error && <p role="alert" className="mt-3 rounded-2xl bg-[#FBE2B4] px-3 py-2 text-center text-xs font-semibold text-[#131321]">{error}</p>}
        <p className="mt-5 text-center text-xs text-[#131321]/60">Already have an account? <Link href="/sign-in" className="font-bold text-[#131321] underline underline-offset-2">Sign in</Link></p>
      </SurfaceCard>
    </main>
  );
}
