"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { authClient } from "@/lib/auth-client"; // Better auth client hook import

export default function DashboardPage() {
  // Fetch real user session from Better Auth
  const { data: session } = authClient.useSession();

  // Get user name and image dynamically, with fallback to local Raju image
  const userName = session?.user?.name || "Raju";
  const userImage = session?.user?.image || "/Raju.jpg";

  // Current user's assigned rotation tasks for today
  const myTasksToday = [
    { id: 1, title: "Vimbar kena", category: "Shopping", icon: "🧼" },
    { id: 2, title: "Lobon (Salt) kena", category: "Shopping", icon: "🧂" },
  ];

  // Roommates' assigned rotation tasks for today with local public folder avatars
  const membersTasksToday = [
    { 
      id: 3, 
      member: "Radin", 
      title: "Washroom Clean", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", 
      icon: "✨" 
    },
    { 
      id: 4, 
      member: "Rubel", 
      title: "Moyla Fela", 
      avatar: "/Rubel.jpg", 
      icon: "🗑️" 
    },
    { 
      id: 5, 
      member: "Arefin", 
      title: "Dusting & Floor Clean", 
      avatar: "/Arefin.jpg", 
      icon: "🧹" 
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Top Header Profile & Notification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-200">
              <img 
                src={userImage} 
                alt={userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Good morning, {userName} 👋
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Flat Member • Block B, House 14</p>
            </div>
          </div>

          <button 
            type="button" 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            🔔
          </button>
        </div>

        {/* Main Blue Banner Card */}
        <div className="bg-blue-600 text-white rounded-[28px] p-6 shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block">
            BACHELOR POINT
          </span>
          <h3 className="text-lg font-bold mt-3 leading-snug">
            Together we manage, better we live.
          </h3>

          <div className="flex justify-between items-end mt-6 pt-2 border-t border-white/10">
            <div>
              <p className="text-sm font-black text-white">5 Active</p>
              <p className="text-[11px] text-blue-100 font-medium">Members</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black tracking-tight text-white">৳2,450 <span className="text-xs font-normal text-blue-100">/ Month</span></p>
              <p className="text-[11px] text-blue-100 font-bold">Total Shared</p>
            </div>
          </div>
        </div>

        {/* Today's Tasks Section (Rotation Wise) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Todays Rotation Tasks</h3>
            <Link href="/tasks/detail" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              <span>View details</span>
              <span>›</span>
            </Link>
          </div>

          {/* Current User's Assigned Tasks Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[28px] p-5 shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                Your Turn Today
              </span>
              <span className="text-xs font-bold text-blue-100">{myTasksToday.length} Items</span>
            </div>

            <div className="space-y-2 pt-1">
              {myTasksToday.map((task) => (
                <Link 
                  key={task.id} 
                  href="/tasks/detail" 
                  className="bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                      {task.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-200 transition">{task.title}</h4>
                      <p className="text-[10px] text-blue-100 font-medium">{task.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-xl shadow-sm">
                    Action Required
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Other Members' Assigned Rotation Tasks */}
          <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm space-y-2.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
              Roommates Rotation Today
            </p>

            {membersTasksToday.map((task) => (
              <Link 
                key={task.id} 
                href="/tasks/detail" 
                className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-2xl transition border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={task.avatar} 
                      alt={task.member} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200" 
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {task.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                    <p className="text-[10px] text-blue-600 font-bold">{task.member}s Turn</p>
                  </div>
                </div>
                <span className="text-slate-300 text-sm font-bold">›</span>
              </Link>
            ))}
          </div>

        </div>

        {/* Pending Extra Splits Section */}
        <div className="flex items-center justify-between pt-1 px-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Shared Expenses</h3>
          <Link href="/expenses" className="text-xs font-bold text-blue-600 hover:underline">Details ›</Link>
        </div>

      </div>

      <BottomNav />
    </main>
  );
}