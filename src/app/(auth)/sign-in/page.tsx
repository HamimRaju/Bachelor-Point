"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui";
import AuthFrame from "@/components/AuthFrame";
import { banglaError } from "@/lib/bn";

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
          onError: (context) => setError(banglaError(context.error, "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।")),
        },
      );
    } catch (signInError) {
      setError(banglaError(signInError, "প্রবেশ করা যায়নি। আপনার তথ্য যাচাই করে আবার চেষ্টা করুন।"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <SurfaceCard className="auth-card p-5 sm:p-7">
        <div className="auth-card-top">
          <span className="auth-kicker">সদস্যের প্রবেশ</span>
          <span className="auth-status">নিরাপদ প্রবেশ</span>
        </div>
        <h1 className="auth-heading">আবার স্বাগতম</h1>
        <p className="auth-description">
          ফ্ল্যাটের কাজ ও হিসাব দেখতে আপনার অ্যাকাউন্টে প্রবেশ করুন।
        </p>
        <form onSubmit={handleSignIn} className="auth-form">
          <label htmlFor="email" className="auth-field-label">
            ইমেইল ঠিকানা
            <span className="auth-input-wrap">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="raju@bachelorpoint.com"
                className="auth-input"
              />
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
                autoComplete="current-password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
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
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "প্রবেশ করা হচ্ছে…" : "প্রবেশ করুন"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-card-footer">
          ব্যাচেলর পয়েন্টে নতুন?{" "}
          <Link href="/sign-up" className="auth-inline-link">
            অ্যাকাউন্ট খুলুন
          </Link>
        </p>
      </SurfaceCard>
    </AuthFrame>
  );
}
