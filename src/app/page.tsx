"use client";

import Link from "next/link";

export default function OnboardingPage() {
  // Flat members local & fallback avatar list
  const members = [
    { name: "Raju", avatar: "/Raju.jpg", initials: "HR" },
    { name: "Rubel", avatar: "/Rubel.jpg", initials: "RA" },
    { name: "Arefin", avatar: "/Arefin.jpg", initials: "SA" },
    { name: "Real", avatar: null, initials: "RH" },
    { name: "Radin", avatar: null, initials: "AR" },
  ];

  return (
    <main className="min-h-screen bg-[#070b19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Main Container Card */}
      <div className="w-full max-w-sm bg-[#0b132b] border border-[#1e293b]/60 rounded-[36px] p-6 sm:p-8 flex flex-col items-center text-center relative z-10 shadow-2xl shadow-black/80">
        
        {/* Central App Logo Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 border border-blue-400/30">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>

        {/* App Title */}
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Bachelor Point
        </h1>

        {/* Tagline */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-8 px-2">
          FIVE FRIENDS • ONE HOME • MANY RESPONSIBILITIES
        </p>

        {/* Avatar Group & Description Card */}
        <div className="w-full bg-[#111c38]/80 border border-slate-800/80 rounded-2xl p-5 mb-8 flex flex-col items-center shadow-inner">
          
          {/* Avatar Group with Local Images */}
          <div className="flex items-center justify-center -space-x-3 mb-4">
            {members.map((member, idx) => (
              <div 
                key={idx} 
                className="w-10 h-10 rounded-full border-2 border-[#111c38] overflow-hidden bg-slate-800 flex items-center justify-center shadow-md relative"
                title={member.name}
              >
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                    {member.initials}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium px-1">
            Simplified expense splitting, bill payments & chore rotations for flats.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Link
            href="/sign-up"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center active:scale-[0.98]"
          >
            Get Started
          </Link>

          <Link
            href="/sign-in"
            className="w-full py-4 bg-[#141e38] hover:bg-[#1a2647] text-slate-200 font-semibold text-xs rounded-2xl border border-slate-700/60 transition flex items-center justify-center active:scale-[0.98]"
          >
            Already have an account? <span className="text-white ml-1 font-bold">Sign In</span>
          </Link>
        </div>

      </div>
    </main>
  );
}