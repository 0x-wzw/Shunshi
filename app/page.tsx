"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lunarToSolar } from "@/lib/bazi/calendar";

export default function Home() {
    const router = useRouter();
    const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
    const [formData, setFormData] = useState({
        birthDateTime: "",
        birthYear: 1990,
        birthMonth: 1,
        birthDay: 1,
        birthHour: 0,
        isLeap: false,
        gender: "male",
        tzOffsetMinutes: 480,
        dayStartHourLocal: 23,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { birthDateTime, birthYear, birthMonth, birthDay, birthHour, isLeap, gender, tzOffsetMinutes, dayStartHourLocal } = formData;

        let birthIsoUtc = "";

        if (calendarType === "solar") {
            const localDate = new Date(birthDateTime);
            const utcDate = new Date(localDate.getTime() - (tzOffsetMinutes * 60000));
            birthIsoUtc = utcDate.toISOString();
        } else {
            const solarDate = lunarToSolar({
                year: birthYear,
                month: birthMonth,
                day: birthDay,
                isLeap,
            });
            solarDate.setHours(birthHour);
            const utcDate = new Date(solarDate.getTime() - (tzOffsetMinutes * 60000));
            birthIsoUtc = utcDate.toISOString();
        }

        const params = new URLSearchParams({
            birthIsoUtc,
            gender,
            tzOffsetMinutes: tzOffsetMinutes.toString(),
            dayStartHourLocal: dayStartHourLocal.toString(),
        });

        router.push(`/report?${params.toString()}`);
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="z-10 w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
                {/* Hero Section */}
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-2">
                        AI-Driven Decision Intelligence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Hourly <span className="text-gradient">Choice</span> Engine
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                        Unlock precision timing for your most critical moves using ancient wisdom and modern data.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                        <div className="flex items-center space-x-2 text-slate-500 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>Personalized BaZi</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>DaYun Timeline</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            <span>Elements Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="glass-dark p-8 rounded-[2rem] relative group border-t border-slate-700/50">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative space-y-8">
                        <div className="flex p-1.5 bg-slate-950/50 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <button
                                onClick={() => setCalendarType("solar")}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${calendarType === "solar" ? "bg-slate-800 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"}`}
                            >
                                Solar
                            </button>
                            <button
                                onClick={() => setCalendarType("lunar")}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${calendarType === "lunar" ? "bg-slate-800 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"}`}
                            >
                                Lunar
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {calendarType === "solar" ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Birth Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                        value={formData.birthDateTime}
                                        onChange={(e) => setFormData({ ...formData, birthDateTime: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Lunar Year</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                            value={formData.birthYear}
                                            onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Month</label>
                                        <select
                                            className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                                            value={formData.birthMonth}
                                            onChange={(e) => setFormData({ ...formData, birthMonth: Number(e.target.value) })}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Day</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={30}
                                            className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                            value={formData.birthDay}
                                            onChange={(e) => setFormData({ ...formData, birthDay: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3 px-1 pt-2">
                                        <input
                                            type="checkbox"
                                            id="isLeap"
                                            checked={formData.isLeap}
                                            onChange={(e) => setFormData({ ...formData, isLeap: e.target.checked })}
                                            className="w-5 h-5 bg-slate-950 border border-slate-800 rounded-md text-indigo-600 focus:ring-offset-0 focus:ring-indigo-500 appearance-none checked:bg-indigo-600 checked:border-indigo-600 relative after:content-['✓'] after:absolute after:hidden after:inset-0 after:text-center after:text-xs after:leading-5 checked:after:block"
                                        />
                                        <label htmlFor="isLeap" className="text-sm font-semibold text-slate-400">Leap Month</label>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Gender</label>
                                    <select
                                        className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Timezone</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                        value={formData.tzOffsetMinutes}
                                        onChange={(e) => setFormData({ ...formData, tzOffsetMinutes: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Day Start Rule</label>
                                <select
                                    className="w-full bg-slate-950/50 border border-slate-800 px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                    value={formData.dayStartHourLocal}
                                    onChange={(e) => setFormData({ ...formData, dayStartHourLocal: Number(e.target.value) })}
                                >
                                    <option value={23}>23:00 (Late Zi)</option>
                                    <option value={0}>00:00 (Standard)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-premium py-5 mt-4 text-lg hover:scale-[1.02]"
                            >
                                Generate Report
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
