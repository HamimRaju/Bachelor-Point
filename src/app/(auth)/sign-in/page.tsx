"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui";
import AuthFrame from "@/components/AuthFrame";

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
    <AuthFrame>
      <SurfaceCard className="auth-card p-5 sm:p-7">
        <div className="auth-card-top">
          <span className="auth-kicker">Member sign in</span>
          <span className="auth-status">SECURE ACCESS</span>
        </div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-description">
          Sign in to pick up where your flat left off.
        </p>
        <form onSubmit={handleSignIn} className="auth-form">
          <label htmlFor="email" className="auth-field-label">
            Email address
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
            Password
            <span className="auth-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="auth-input auth-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="auth-reveal-button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-card-footer">
          New to Bachelor Point?{" "}
          <Link href="/sign-up" className="auth-inline-link">
            Create your account
          </Link>
        </p>
      </SurfaceCard>
    </AuthFrame>
  );
}
