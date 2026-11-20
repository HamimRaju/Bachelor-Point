import { Suspense } from "react";
import Link from "next/link";
import { Pill, SurfaceCard } from "@/components/ui";
import BottomNav from "@/components/BottomNav";
import DashboardPage from "./(dashboard)/dashboard/page";
import { getCurrentMember } from "@/lib/current-member";

const highlights = ["Fair task turns", "Shared expenses", "Bills in one place"];

function PublicHomePage() {
  return (
    <main className="app-backdrop px-4 py-5 text-white sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-5xl flex-col sm:min-h-[calc(100dvh-3.5rem)]">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#46F0D2] text-lg font-black text-[#131321]">B</span>
            <span>
              <span className="block text-sm font-bold">Bachelor Point</span>
              <span className="block text-xs text-white/60">Better shared living</span>
            </span>
          </Link>
          <Link href="/sign-in" className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white">Sign in</Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:gap-16">
          <section>
            <Pill tone="gold">Made for shared living</Pill>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">One home.<br /><span className="gradient-text">Everyone in sync.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/70">Keep chores fair, shared costs clear, and your whole flat on the same page—without the group-chat confusion.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="rounded-full bg-[#46F0D2] px-6 py-3.5 text-center text-sm font-bold text-[#131321]">Get started <span aria-hidden="true">→</span></Link>
              <Link href="/sign-in" className="rounded-full border border-white/15 px-6 py-3.5 text-center text-sm font-semibold text-white">I already have an account</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {highlights.map((highlight) => <Pill key={highlight} tone="dark" className="text-white/80">{highlight}</Pill>)}
            </div>
          </section>

          <SurfaceCard className="mx-auto w-full max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-semibold text-[#131321]/55">BACHELOR POINT</p><h2 className="mt-1 text-lg font-bold">Today at a glance</h2></div>
              <Pill tone="gold">Flat 3B</Pill>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="gradient-panel rounded-2xl p-4 text-white"><p className="text-2xl font-bold">5</p><p className="mt-1 text-xs text-white/65">Active members</p></div>
              <div className="rounded-2xl bg-[#FBE2B4] p-4 text-[#131321]"><p className="text-xl font-bold">৳2,450</p><p className="mt-1 text-xs">Shared / month</p></div>
            </div>
            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold">Rotation tasks</p>
              {["Vim Bar Kena", "Washroom Clean", "Harpic Kena"].map((task, index) => (
                <div key={task} className="flex items-center gap-3 rounded-2xl border border-[#131321]/10 px-3 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46F0D2] text-xs font-bold text-[#131321]">{index + 1}</span>
                  <span className="flex-1 text-sm font-semibold">{task}</span>
                  <span className="h-5 w-5 rounded-full border border-[#131321]/25" />
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
        <footer className="border-t border-white/10 pt-5 text-center text-xs text-white/55">A simple shared plan for the little things that make a home work.</footer>
      </div>
    </main>
  );
}

async function AuthenticatedHome() {
  const member = await getCurrentMember();

  if (member) {
    return (
      <>
        <DashboardPage />
        <BottomNav />
      </>
    );
  }

  return <PublicHomePage />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main
          className="app-backdrop"
          aria-busy="true"
          aria-label="Loading Bachelor Point"
        />
      }
    >
      <AuthenticatedHome />
    </Suspense>
  );
}
