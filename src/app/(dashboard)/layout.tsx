import { Suspense } from "react";
import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getCurrentMember } from "@/lib/current-member";

async function AuthenticatedDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/sign-in");

  return (
    <div className="app-backdrop">
      {children}
      <BottomNav />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="app-backdrop" aria-busy="true" />}
    >
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}
