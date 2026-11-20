import { Suspense } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import DashboardPage from "./(dashboard)/dashboard/page";
import { getCurrentMember } from "@/lib/current-member";

const previewTasks = [
  { title: "Vim Bar Kena", detail: "Your turn today", status: "next" },
  { title: "Washroom Clean", detail: "Radin is up next", status: "waiting" },
  { title: "Harpic Kena", detail: "Completed this week", status: "done" },
] as const;

const appFeatures = [
  { icon: "↻", title: "Fair turns" },
  { icon: "৳", title: "Clear splits" },
  { icon: "✓", title: "Shared bills" },
];

function PublicHomePage() {
  return (
    <main className="public-home">
      <div className="public-home-shell">
        <header className="public-app-bar">
          <Link href="/" className="public-brand" aria-label="Bachelor Point home">
            <span className="public-brand-mark" aria-hidden="true">BP</span>
            <span>
              <span className="public-brand-name">Bachelor Point</span>
              <span className="public-brand-caption">SHARED LIVING, IN SYNC</span>
            </span>
          </Link>
          <Link href="/sign-in" className="public-signin">
            Sign in <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <div className="public-home-content">
          <section className="public-hero">
            <span className="public-kicker">
              <span aria-hidden="true" />
              YOUR HOME, RUNNING SMOOTHLY
            </span>
            <h1 className="public-headline">
              One home.
              <span>Everyone in sync.</span>
            </h1>
            <p className="public-description">
              Chores, shared costs and bills—together in one simple place for
              your flat.
            </p>
            <div className="public-actions">
              <Link href="/sign-up" className="public-primary-button">
                <span>Get started</span>
                <span className="public-button-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/sign-in" className="public-secondary-button">
                I already have an account
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="public-proof">
              <span className="public-proof-avatars" aria-hidden="true">
                <span>R</span><span>A</span><span>R</span>
              </span>
              Made for real flatmates, not group-chat chaos.
            </p>
          </section>

          <section
            className="public-app-preview"
            aria-label="Example Bachelor Point app dashboard"
          >
            <div className="public-preview-top">
              <div className="public-preview-avatar" aria-hidden="true">BP</div>
              <div className="public-preview-greeting">
                <span>FLAT 3B · TODAY</span>
                <h2>Your home at a glance</h2>
              </div>
              <span className="public-preview-live"><span /> LIVE</span>
            </div>

            <div className="public-preview-stats">
              <div className="public-stat-card public-stat-mint">
                <span>FLATMATES</span>
                <strong>05</strong>
                <small>All together</small>
              </div>
              <div className="public-stat-card public-stat-gold">
                <span>SHARED THIS MONTH</span>
                <strong>৳2,450</strong>
                <small>Clear for everyone</small>
              </div>
            </div>

            <div className="public-preview-tasks">
              <div className="public-preview-section-heading">
                <h3>Rotation tasks</h3>
                <span>VIEW ALL <span aria-hidden="true">→</span></span>
              </div>
              <div className="public-preview-task-list">
                {previewTasks.map((task, index) => (
                  <div className="public-preview-task" key={task.title}>
                    <span className={`public-task-indicator public-task-${task.status}`}>
                      {task.status === "done" ? "✓" : index + 1}
                    </span>
                    <span className="public-task-copy">
                      <strong>{task.title}</strong>
                      <small>{task.detail}</small>
                    </span>
                    {task.status === "next" && (
                      <span className="public-task-badge">YOUR TURN</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="public-preview-nav" aria-hidden="true">
              <span className="is-active"><b>⌂</b>Home</span>
              <span><b>✓</b>Tasks</span>
              <span><b>৳</b>Expenses</span>
              <span><b>•••</b>More</span>
            </div>
          </section>
        </div>

        <ul className="public-feature-list" aria-label="App features">
          {appFeatures.map((feature) => (
            <li key={feature.title}>
              <span aria-hidden="true">{feature.icon}</span>
              {feature.title}
            </li>
          ))}
        </ul>
        <footer className="public-footer">
          A little more harmony in the everyday.
        </footer>
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
