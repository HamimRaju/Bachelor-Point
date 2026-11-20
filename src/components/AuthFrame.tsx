import Link from "next/link";
import type { ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-brand" aria-label="Bachelor Point home">
          <BrandLogo showTagline />
        </Link>
        {children}
        <p className="auth-footnote">
          A simpler way to look after your shared home.
        </p>
      </div>
    </main>
  );
}
