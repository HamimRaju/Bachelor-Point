"use client";

import BottomNav from "@/components/BottomNav";

export default function MembersPage() {
  const members = [
    {
      id: 1,
      name: "Hamim Islam Raju",
      role: "Full Stack Dev",
      badge: "Manager",
      phone: "+880 1726-233420",
      avatar: "/Raju.jpg",
      status: "Active",
      initials: "HR",
    },
    {
      id: 2,
      name: "Rubel Ahmed",
      role: "Flat Resident",
      badge: null,
      phone: "+880 1722-844211",
      avatar: "/Rubel.jpg",
      status: "Active",
      initials: "RA",
    },
    {
      id: 3,
      name: "Sowad Arefin",
      role: "Flat Resident",
      badge: null,
      phone: "+880 1741-105524",
      avatar: "/Arefin.jpg",
      status: "Active",
      initials: "SA",
    },
    {
      id: 4,
      name: "Real Hossain",
      role: "Flat Resident",
      badge: null,
      phone: "+880 1751-016500",
      avatar: null, // Fallback to styled initials badge
      status: "Active",
      initials: "RH",
    },
    {
      id: 5,
      name: "ATR Radin",
      role: "Flat Resident",
      badge: null,
      phone: "+880 1305-757694",
      avatar: null, // Fallback to styled initials badge
      status: "Active",
      initials: "AR",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between py-1 px-1">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Mess Members</h1>
            <p className="text-xs font-medium text-slate-400">Bachelor Point Flat 3B (5 Members)</p>
          </div>
          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
            5 Active
          </span>
        </div>

        {/* Member Cards List */}
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                
                {/* Left: Avatar & Member Info */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    {member.avatar ? (
                      <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs bg-slate-100">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
                        {member.initials}
                      </div>
                    )}
                    
                    {/* Active Status Pulse Dot */}
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">{member.name}</h3>
                      {member.badge && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/80 uppercase">
                          {member.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">{member.role}</p>
                    
                    {/* Highlighted Phone Number Badge */}
                    <div className="pt-1">
                      <a 
                        href={`tel:${member.phone}`} 
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-lg border border-blue-100 transition-colors"
                      >
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{member.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Call Button */}
                <a
                  href={`tel:${member.phone}`}
                  className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 active:scale-95 shadow-xs"
                  title="Call member"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>

              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Tip Card */}
        <div className="bg-blue-50/80 rounded-[24px] p-4 border border-blue-100/80 text-blue-900 space-y-1 mt-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-700">
            <span>💡</span> Tip for Flat Members
          </div>
          <p className="text-[11px] leading-relaxed font-medium text-blue-800/80">
            Shorasori kono flatmate-er sathe jogajog korte phone number badge-e click korun অথবা right side-er quick call button tap korun.
          </p>
        </div>

      </div>

      <BottomNav />
    </main>
  );
}