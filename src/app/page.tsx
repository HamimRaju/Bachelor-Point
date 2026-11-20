import { Suspense } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import BottomNav from "@/components/BottomNav";
import DashboardPage from "./(dashboard)/dashboard/page";
import { getCurrentMember } from "@/lib/current-member";

const previewTasks = [
  { title: "ভিম বার কেনা", detail: "আজ আপনার পালা", status: "next" },
  { title: "বাথরুম পরিষ্কার", detail: "এরপর রাদিনের পালা", status: "waiting" },
  { title: "হারপিক কেনা", detail: "এই সপ্তাহে সম্পন্ন", status: "done" },
] as const;

const appFeatures = [
  { icon: "↻", title: "সবার জন্য সমান পালা" },
  { icon: "৳", title: "খরচের স্বচ্ছ হিসাব" },
  { icon: "✓", title: "একসাথে বিল পরিশোধ" },
];

function PublicHomePage() {
  return (
    <main className="public-home">
      <div className="public-home-shell">
        <header className="public-app-bar">
          <Link href="/" className="public-brand" aria-label="ব্যাচেলর পয়েন্টের মূল পাতা">
            <BrandLogo showTagline />
          </Link>
          <Link href="/sign-in" className="public-signin">
            প্রবেশ করুন <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <div className="public-home-content">
          <section className="public-hero">
            <span className="public-kicker">
              <span aria-hidden="true" />
              আপনার বাসা, সুন্দর ব্যবস্থাপনায়
            </span>
            <h1 className="public-headline">
              একটাই বাসা।
              <span>সবাই চলি একসাথে।</span>
            </h1>
            <p className="public-description">
              ঘরের কাজ, সবার খরচ আর বিল—আপনার ফ্ল্যাটের সব হিসাব এক জায়গায়।
            </p>
            <div className="public-actions">
              <Link href="/sign-up" className="public-primary-button">
                <span>শুরু করুন</span>
                <span className="public-button-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/sign-in" className="public-secondary-button">
                আমার অ্যাকাউন্ট আছে
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="public-proof">
              <span className="public-proof-avatars" aria-hidden="true">
                <span>R</span><span>A</span><span>R</span>
              </span>
              ফ্ল্যাটমেটদের জন্য সহজ সমাধান—গ্রুপ চ্যাটের ঝামেলা নয়।
            </p>
          </section>

          <section
            className="public-app-preview"
            aria-label="ব্যাচেলর পয়েন্ট অ্যাপের নমুনা ড্যাশবোর্ড"
          >
            <div className="public-preview-top">
              <div className="public-preview-avatar" aria-hidden="true">BP</div>
              <div className="public-preview-greeting">
                <span>ফ্ল্যাট ৩বি · আজ</span>
                <h2>এক নজরে আপনার বাসা</h2>
              </div>
              <span className="public-preview-live"><span /> চালু</span>
            </div>

            <div className="public-preview-stats">
              <div className="public-stat-card public-stat-mint">
                <span>ফ্ল্যাটমেট</span>
                <strong>০৫</strong>
                <small>সবাই একসাথে</small>
              </div>
              <div className="public-stat-card public-stat-gold">
                <span>এই মাসের মোট খরচ</span>
                <strong>৳২,৪৫০</strong>
                <small>সবার জন্য স্বচ্ছ হিসাব</small>
              </div>
            </div>

            <div className="public-preview-tasks">
              <div className="public-preview-section-heading">
                <h3>পালাক্রমে করা কাজ</h3>
                <span>সব দেখুন <span aria-hidden="true">→</span></span>
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
                      <span className="public-task-badge">আপনার পালা</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="public-preview-nav" aria-hidden="true">
              <span className="is-active"><b>⌂</b>হোম</span>
              <span><b>✓</b>কাজ</span>
              <span><b>৳</b>খরচ</span>
              <span><b>•••</b>আরও</span>
            </div>
          </section>
        </div>

        <ul className="public-feature-list" aria-label="অ্যাপের সুবিধাসমূহ">
          {appFeatures.map((feature) => (
            <li key={feature.title}>
              <span aria-hidden="true">{feature.icon}</span>
              {feature.title}
            </li>
          ))}
        </ul>
        <footer className="public-footer">
          প্রতিদিনের জীবনে একটু বেশি স্বস্তি ও সমন্বয়।
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
          aria-label="ব্যাচেলর পয়েন্ট লোড হচ্ছে"
        />
      }
    >
      <AuthenticatedHome />
    </Suspense>
  );
}
