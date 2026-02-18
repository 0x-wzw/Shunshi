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

    const handleGenerate = () => {
        let birthIsoUtc = "";

        if (calendarType === "solar") {
            if (!formData.birthDateTime) return alert("Please select birth date and time");
            const localDate = new Date(formData.birthDateTime);
            const utcDate = new Date(localDate.getTime() - (formData.tzOffsetMinutes * 60000));
            birthIsoUtc = utcDate.toISOString();
        } else {
            const solarDate = lunarToSolar(
                formData.birthYear,
                formData.birthMonth,
                formData.birthDay,
                formData.isLeap
            );
            const compositeDate = new Date(solarDate);
            compositeDate.setHours(formData.birthHour);
            const utcDate = new Date(compositeDate.getTime() - (formData.tzOffsetMinutes * 60000));
            birthIsoUtc = utcDate.toISOString();
        }

        const params = new URLSearchParams({
            birthIsoUtc,
            gender: formData.gender,
            tzOffsetMinutes: formData.tzOffsetMinutes.toString(),
            dayStartHourLocal: formData.dayStartHourLocal.toString(),
        });

        router.push(`/report?${params.toString()}`);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                    <div className="p-10 md:p-14 text-center border-b border-slate-50">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Generate Your Destiny Report
                        </h1>
                        <p className="text-slate-500 font-medium text-sm tracking-tight">
                            Four Pillars • Five Elements • Life Cycles
                        </p>
                    </div>

                    <div className="p-10 md:p-14 space-y-8">
                        {/* Calendar Toggle */}
                        <div className="flex p-1 bg-slate-100 rounded-2xl">
                            <button
                                onClick={() => setCalendarType("solar")}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${calendarType === "solar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Solar
                            </button>
                            <button
                                onClick={() => setCalendarType("lunar")}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${calendarType === "lunar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Lunar
                            </button>
                        </div>

                        <div className="space-y-6">
                            {calendarType === "solar" ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birth Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                        value={formData.birthDateTime}
                                        onChange={(e) => setFormData({ ...formData, birthDateTime: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                                value={formData.birthYear}
                                                onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Month</label>
                                            <input
                                                type="number"
                                                max={12}
                                                min={1}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                                value={formData.birthMonth}
                                                onChange={(e) => setFormData({ ...formData, birthMonth: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day</label>
                                            <input
                                                type="number"
                                                max={31}
                                                min={1}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                                value={formData.birthDay}
                                                onChange={(e) => setFormData({ ...formData, birthDay: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hour (0-23)</label>
                                            <input
                                                type="number"
                                                max={23}
                                                min={0}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                                value={formData.birthHour}
                                                onChange={(e) => setFormData({ ...formData, birthHour: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium appearance-none cursor-pointer"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                        value={formData.tzOffsetMinutes / 60}
                                        onChange={(e) => setFormData({ ...formData, tzOffsetMinutes: parseInt(e.target.value) * 60 })}
                                        placeholder="+08:00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day Rollover Rule</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium appearance-none cursor-pointer"
                                    value={formData.dayStartHourLocal}
                                    onChange={(e) => setFormData({ ...formData, dayStartHourLocal: parseInt(e.target.value) })}
                                >
                                    <option value={23}>Zi Hour (23:00)</option>
                                    <option value={0}>Midnight (00:00)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="w-full bg-[#111827] text-white py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] mt-4"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
                <p className="text-center mt-10 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                    Powered by BaZi Decision Intelligence
                </p>
            </div>
        </main>
    );
}
