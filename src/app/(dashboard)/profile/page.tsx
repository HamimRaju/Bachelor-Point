"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FLAT_MEMBERS } from "@/lib/members";
import { PageFrame, SurfaceCard } from "@/components/ui";
import { banglaError, formatBnNumber, translateMemberName } from "@/lib/bn";

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
  const userName = translateMemberName(
    fullNames[email] ?? session?.user?.name ?? "প্রোফাইল লোড হচ্ছে…",
  );

  const handleSignOut = async () => {
    setLoading(true);
    setSignOutError(null);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.replace("/"),
          onError: (context) => {
            setSignOutError(banglaError(context.error, "লগ আউট করা যায়নি। আবার চেষ্টা করুন।"));
            setLoading(false);
          },
        },
      });
    } catch (error) {
      setSignOutError(
        banglaError(error, "লগ আউট করা যায়নি। আবার চেষ্টা করুন।"),
      );
      setLoading(false);
    }
  };

  return (
    <PageFrame className="profile-page">
      <header className="profile-page-heading">
        <h1 className="text-2xl font-bold tracking-tight">প্রোফাইল ও সেটিংস</h1>
        <p className="mt-1 text-sm text-white/60">আপনার অ্যাকাউন্ট ও মেসের পছন্দসমূহ।</p>
      </header>

      <SurfaceCard className="profile-identity-card p-5 sm:p-6">
        <span className="profile-tech-label">সদস্যের প্রোফাইল <span>·</span> BP-03B</span>
        <div className="profile-initials">{getInitials(userName)}</div>
        <h2 className="mt-3 text-xl font-bold tracking-tight">{userName}</h2>
        <p className="mt-1 max-w-full truncate text-sm text-white/65">{email}</p>
        <span className="profile-resident-badge">ফ্ল্যাট ৩বি-এর সদস্য</span>
        <span className="profile-card-index" aria-hidden="true">BP / 03B</span>
      </SurfaceCard>

      <SurfaceCard className="profile-roommates-card px-4 py-3">
        <h2 className="profile-section-title">ফ্ল্যাটমেট ({formatBnNumber(5)} জন)</h2>
        <div className="mt-2">
          {orderedMembers.map((member) => {
            const name = translateMemberName(fullNames[member.email] ?? member.name);
            const isCurrentUser = member.email === email;

            return (
              <div key={member.id} className="profile-roommate-row">
                <span className="profile-roommate-avatar" aria-hidden="true">
                  {getInitials(name).slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {name}{isCurrentUser ? " (আপনি)" : ""}
                </span>
                <span className="profile-active-badge">
                  <span aria-hidden="true" />
                  সক্রিয়
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
          {loading ? "লগ আউট হচ্ছে…" : "লগ আউট করুন"}
        </button>
      </div>
    </PageFrame>
  );
}
