"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMemberByEmail } from "@/lib/members";
import { SurfaceCard } from "@/components/ui";
import AuthFrame from "@/components/AuthFrame";

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
    <AuthFrame>
      <SurfaceCard className="auth-card p-5 sm:p-7">
        <div className="auth-card-top">
          <span className="auth-kicker">Join your flat</span>
          <span className="auth-status">MEMBER ACCESS</span>
        </div>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-description">
          Enter your registered flat email first. Your member name will be filled in automatically.
        </p>
        <form onSubmit={handleSignUp} className="auth-form">
          <label htmlFor="email" className="auth-field-label">
            Email address
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
            Member name
            <span className="auth-input-wrap">
              <input
                id="name"
                type="text"
                value={member?.name ?? ""}
                readOnly
                autoComplete="name"
                aria-describedby="member-name-help"
                placeholder="Enter your registered email first"
                className="auth-input read-only:cursor-default"
              />
            </span>
            <span id="member-name-help" className="sr-only">
              Member name is matched to the authorized email address.
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
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
          <button
            type="submit"
            disabled={loading || !member}
            className="auth-submit"
          >
            {loading ? "Creating account…" : "Create account"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>
        <p className="auth-card-footer">
          Already have an account?{" "}
          <Link href="/sign-in" className="auth-inline-link">
            Sign in
          </Link>
        </p>
      </SurfaceCard>
    </AuthFrame>
  );
}
