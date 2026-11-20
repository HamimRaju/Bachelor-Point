"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMemberByEmail } from "@/lib/members";
import { SurfaceCard } from "@/components/ui";
import AuthFrame from "@/components/AuthFrame";
import { banglaError, translateMemberName } from "@/lib/bn";

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
          onError: (context) => setError(banglaError(context.error, "অ্যাকাউন্ট খোলা যায়নি। আপনার তথ্য যাচাই করে আবার চেষ্টা করুন।")),
        },
      );
    } catch (signUpError) {
      setError(banglaError(signUpError, "অ্যাকাউন্ট খোলা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <SurfaceCard className="auth-card p-5 sm:p-7">
        <div className="auth-card-top">
          <span className="auth-kicker">আপনার ফ্ল্যাটে যোগ দিন</span>
          <span className="auth-status">সদস্যের প্রবেশ</span>
        </div>
        <h1 className="auth-heading">অ্যাকাউন্ট খুলুন</h1>
        <p className="auth-description">
          প্রথমে ফ্ল্যাটে নিবন্ধিত ইমেইল ঠিকানা লিখুন। আপনার সদস্যের নাম স্বয়ংক্রিয়ভাবে দেখানো হবে।
        </p>
        <form onSubmit={handleSignUp} className="auth-form">
          <label htmlFor="email" className="auth-field-label">
            ইমেইল ঠিকানা
            <span className="auth-input-wrap">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="raju@bachelorpoint.com"
                className="auth-input"
              />
            </span>
          </label>
          <label htmlFor="name" className="auth-field-label">
            সদস্যের নাম
            <span className="auth-input-wrap">
              <input
                id="name"
                type="text"
                value={member ? translateMemberName(member.name) : ""}
                readOnly
                autoComplete="name"
                aria-describedby="member-name-help"
                placeholder="আগে নিবন্ধিত ইমেইল লিখুন"
                className="auth-input read-only:cursor-default"
              />
            </span>
            <span id="member-name-help" className="sr-only">
              সদস্যের নাম অনুমোদিত ইমেইলের সঙ্গে মিলিয়ে দেখানো হয়।
            </span>
          </label>
          <label htmlFor="password" className="auth-field-label">
            পাসওয়ার্ড
            <span className="auth-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮টি অক্ষর"
                className="auth-input auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                className="auth-reveal-button"
              >
                {showPassword ? "লুকান" : "দেখান"}
              </button>
            </span>
          </label>
          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !member}
            className="auth-submit"
          >
            {loading ? "অ্যাকাউন্ট খোলা হচ্ছে…" : "অ্যাকাউন্ট খুলুন"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-card-footer">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/sign-in" className="auth-inline-link">
            প্রবেশ করুন
          </Link>
        </p>
      </SurfaceCard>
    </AuthFrame>
  );
}
