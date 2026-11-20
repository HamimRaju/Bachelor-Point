"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FLAT_MEMBERS } from "@/lib/members";
import { PageFrame, SurfaceCard } from "@/components/ui";

const fullNames: Record<string, string> = {
  "raju@bachelorpoint.com": "Hamim Islam Raju",
  "rubel@bachelorpoint.com": "Rubel Ahmed",
  "arefin@bachelorpoint.com": "Sowad Arefin",
  "real@bachelorpoint.com": "Real Hossain",
  "radin@bachelorpoint.com": "ATR Radin",
};

const memberOrder = [
  "raju@bachelorpoint.com",
  "rubel@bachelorpoint.com",
  "arefin@bachelorpoint.com",
  "real@bachelorpoint.com",
  "radin@bachelorpoint.com",
];

const orderedMembers = [...FLAT_MEMBERS].sort(
  (first, second) =>
    memberOrder.indexOf(first.email) - memberOrder.indexOf(second.email),
);

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const email = session?.user?.email?.toLowerCase() ?? "";
  const userName =
    fullNames[email] ?? session?.user?.name ?? "Loading profile…";

  const handleSignOut = async () => {
    setLoading(true);
    setSignOutError(null);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.replace("/"),
          onError: (context) => {
            setSignOutError(context.error.message || "Could not sign out. Try again.");
            setLoading(false);
          },
        },
      });
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : "Could not sign out. Try again.",
      );
      setLoading(false);
    }
  };

  return (
    <PageFrame className="profile-page">
      <header className="profile-page-heading">
        <h1 className="text-2xl font-bold tracking-tight">Profile &amp; Settings</h1>
        <p className="mt-1 text-sm text-white/60">Your account and mess preferences.</p>
      </header>

      <SurfaceCard className="profile-identity-card p-5 sm:p-6">
        <span className="profile-tech-label">MEMBER PROFILE <span>·</span> BP-03B</span>
        <div className="profile-initials">{getInitials(userName)}</div>
        <h2 className="mt-3 text-xl font-bold tracking-tight">{userName}</h2>
        <p className="mt-1 max-w-full truncate text-sm text-white/65">{email}</p>
        <span className="profile-resident-badge">Flat 3B Resident</span>
        <span className="profile-card-index" aria-hidden="true">BP / 03B</span>
      </SurfaceCard>

      <SurfaceCard className="profile-roommates-card px-4 py-3">
        <h2 className="profile-section-title">FLATMATES (5 FRIENDS)</h2>
        <div className="mt-2">
          {orderedMembers.map((member) => {
            const name = fullNames[member.email] ?? member.name;
            const isCurrentUser = member.email === email;

            return (
              <div key={member.id} className="profile-roommate-row">
                <span className="profile-roommate-avatar" aria-hidden="true">
                  {getInitials(name).slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {name}{isCurrentUser ? " (You)" : ""}
                </span>
                <span className="profile-active-badge">
                  <span aria-hidden="true" />
                  Active
                </span>
              </div>
            );
          })}
        </div>
      </SurfaceCard>

      <div>
        {signOutError && (
          <p role="alert" className="profile-signout-error">{signOutError}</p>
        )}
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={loading}
          className="profile-signout-button"
        >
          {loading ? "Signing out…" : "Sign Out / Log Out"}
        </button>
      </div>
    </PageFrame>
  );
}
