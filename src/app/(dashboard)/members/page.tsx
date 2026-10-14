"use client";

import React from "react";

interface Member {
    id: string;
    name: string;
    role: string;
    room: string;
    phone: string;
    isManager?: boolean;
    avatar: string;
}

const MEMBERS: Member[] = [
    {
        id: "1",
        name: "Hamim Islam Raju",
        role: "Full Stack Dev",
        room: "Room: 503",
        phone: "+880 1726-233420",
        isManager: true,
        avatar: "HR",
    },
    {
        id: "2",
        name: "Rubel Ahmed",
        role: "Flat Resident",
        room: "Room: 501",
        phone: "+880 1722-844211",
        avatar: "RA",
    },
    {
        id: "3",
        name: "Sowad Arefin",
        role: "Flat Resident",
        room: "Room: 502",
        phone: "+880 1741-105524",
        avatar: "AK",
    },
    {
        id: "4",
        name: "Real Hossain",
        role: "Flat Resident",
        room: "Room: 502",
        phone: "+880 1751-016500",
        avatar: "RH",
    },
    {
        id: "5",
        name: "ATR Radin",
        role: "Flat Resident",
        room: "Room: 500",
        phone: "+880 1305-757694",
        avatar: "RA",
    },
];

export default function MembersPage() {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Mess Members
                    </h1>
                    <p className="text-xs text-slate-500">
                        Bachelor Point Flat 3B (5 Members)
                    </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                    5 Active
                </span>
            </div>

            {/* Members List */}
            <div className="space-y-3">
                {MEMBERS.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition hover:border-slate-200"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                                {member.avatar}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {member.name}
                                    </h3>
                                    {member.isManager && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-md border border-amber-200">
                                            Manager
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {member.role}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                    <span>🚪 {member.room}</span>
                                    <span>•</span>
                                    <span>📞 {member.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 space-y-1">
                <p className="font-bold">💡 Tip for Flat Members</p>
                <p className="text-blue-600 leading-relaxed">
                    Shorasori kono flatmate-er sathe jogajog korte phone number
                    e click korun othoba chat room use korun.
                </p>
            </div>
        </div>
    );
}
