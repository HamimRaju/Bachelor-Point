import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

type ClassNameProps = {
  className?: string;
};

export function PageFrame({
  children,
  className = "",
}: ClassNameProps & { children: ReactNode }) {
  return (
    <main
      className={`app-backdrop px-3 pb-28 pt-4 text-white sm:px-4 sm:pb-32 sm:pt-6 ${className}`}
    >
      <div className="mx-auto w-full max-w-md space-y-5 sm:space-y-6">{children}</div>
    </main>
  );
}

export function SurfaceCard({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`glass-surface rounded-3xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "cyan",
  className = "",
}: ClassNameProps & {
  children: ReactNode;
  tone?: "cyan" | "gold" | "dark";
}) {
  const tones = {
    cyan: "bg-[#46F0D2] text-[#131321]",
    gold: "bg-[#FBE2B4] text-[#131321]",
    dark: "gradient-panel border border-white/10 text-white",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold leading-4 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PillButton({
  children,
  tone = "cyan",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  ClassNameProps & {
    tone?: "cyan" | "gold" | "dark";
  }) {
  const tones = {
    cyan: "bg-[#46F0D2] text-[#131321]",
    gold: "bg-[#FBE2B4] text-[#131321]",
    dark: "gradient-panel border border-white/10 text-white",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]} ${tone === "cyan" ? "gradient-button" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight text-white">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-5 text-white/60">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
