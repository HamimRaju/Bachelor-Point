import Link from "next/link";
import type { ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-brand" aria-label="ব্যাচেলর পয়েন্টের মূল পাতা">
          <BrandLogo showTagline />
        </Link>
        {children}
        <p className="auth-footnote">
          একসাথে থাকা ও ঘর সামলানোর সহজ উপায়।
        </p>
      </div>
    </main>
  );
}
