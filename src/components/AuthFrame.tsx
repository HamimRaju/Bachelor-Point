import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-brand" aria-label="Bachelor Point home">
          <span className="auth-brand-mark" aria-hidden="true">
            BP
          </span>
          <span>
            <span className="auth-brand-name">Bachelor Point</span>
            <span className="auth-brand-tagline">SHARED LIVING, IN SYNC</span>
          </span>
        </Link>
        {children}
        <p className="auth-footnote">
          A simpler way to look after your shared home.
        </p>
      </div>
    </main>
  );
}
