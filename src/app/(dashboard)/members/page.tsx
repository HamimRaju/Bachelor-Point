import Image from "next/image";
import { FLAT_MEMBERS } from "@/lib/members";
import { PageFrame, Pill, SurfaceCard } from "@/components/ui";

const memberDetails: Record<string, { fullName: string; phone: string; role: string; isManager?: boolean }> = {
  "raju@bachelorpoint.com": { fullName: "Hamim Islam Raju", phone: "+880 1726-233420", role: "Mess manager", isManager: true },
  "rubel@bachelorpoint.com": { fullName: "Rubel Ahmed", phone: "+880 1722-844211", role: "Flat resident" },
  "arefin@bachelorpoint.com": { fullName: "Sowad Arefin", phone: "+880 1741-105524", role: "Flat resident" },
  "real@bachelorpoint.com": { fullName: "Real Hossain", phone: "+880 1751-016500", role: "Flat resident" },
  "radin@bachelorpoint.com": { fullName: "ATR Radin", phone: "+880 1305-757694", role: "Flat resident" },
};

const directory = [...FLAT_MEMBERS]
  .sort((first, second) => {
    const order = ["raju@bachelorpoint.com", "rubel@bachelorpoint.com", "arefin@bachelorpoint.com", "real@bachelorpoint.com", "radin@bachelorpoint.com"];
    return order.indexOf(first.email) - order.indexOf(second.email);
  })
  .map((member) => ({
    ...member,
    ...(memberDetails[member.email] ?? {
      fullName: member.name,
      phone: "",
      role: "Flat resident",
    }),
  }));

export default function MembersPage() {
  return (
    <PageFrame className="palette-page">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mess members</h1>
          <p className="mt-1 text-sm text-white/65">Bachelor Point · Flat 3B</p>
        </div>
        <Pill tone="gold" className="mt-1 shrink-0">{directory.length} Active</Pill>
      </header>

      <section aria-label="Flatmates">
        <div className="space-y-3">
          {directory.map((member) => (
            <SurfaceCard key={member.id} className="flex items-center gap-3 p-4">
              {member.image.startsWith("/") ? (
                <Image src={member.image} alt={member.fullName} width={52} height={52} className="h-13 w-13 shrink-0 rounded-2xl object-cover" />
              ) : (
                <div className="gradient-panel flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white">
                  {member.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-sm font-bold">{member.fullName}</h2>
                  {member.isManager && <Pill tone="gold" className="px-2 py-0.5 text-[9px] uppercase tracking-wide">Manager</Pill>}
                </div>
                <p className="mt-1 text-xs text-white/65">{member.role}</p>
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="mt-2 inline-flex rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/75">
                    {member.phone}
                  </a>
                )}
              </div>
              {member.phone && <a href={`tel:${member.phone}`} aria-label={`Call ${member.fullName}`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#46F0D2] px-3 text-xs font-bold text-[#131321]">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.5 4.5a1 1 0 0 1-.5 1.21l-2.26 1.13a11.04 11.04 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.21-.5l4.5 1.5a1 1 0 0 1 .67.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5Z" />
                </svg>
                Call
              </a>}
            </SurfaceCard>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
