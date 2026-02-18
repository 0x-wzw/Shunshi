"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lunarToSolar, solarToLunar } from "@/lib/bazi/calendar";

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        birthDateTime: "",
        gender: "male",
        tzOffsetMinutes: 480,
        dayStartHourLocal: 23,
    });

    const lunarPreview = formData.birthDateTime ? solarToLunar(new Date(formData.birthDateTime)) : null;

    const handleGenerate = () => {
        if (!formData.birthDateTime) return alert("Please select birth date and time");

        const localDate = new Date(formData.birthDateTime);
        const utcDate = new Date(localDate.getTime() - (formData.tzOffsetMinutes * 60000));
        const birthIsoUtc = utcDate.toISOString();

        const params = new URLSearchParams({
            birthIsoUtc,
            gender: formData.gender,
            tzOffsetMinutes: formData.tzOffsetMinutes.toString(),
            dayStartHourLocal: formData.dayStartHourLocal.toString(),
        });

        router.push(`/report?${params.toString()}`);
    };

    const timezoneOptions = [
        { label: "GMT -12:00", value: -720 },
        { label: "GMT -11:00", value: -660 },
        { label: "GMT -10:00", value: -600 },
        { label: "GMT -09:00", value: -540 },
        { label: "GMT -08:00", value: -480 },
        { label: "GMT -07:00", value: -420 },
        { label: "GMT -06:00", value: -360 },
        { label: "GMT -05:00", value: -300 },
        { label: "GMT -04:00", value: -240 },
        { label: "GMT -03:00", value: -180 },
        { label: "GMT -02:00", value: -120 },
        { label: "GMT -01:00", value: -60 },
        { label: "GMT +00:00", value: 0 },
        { label: "GMT +01:00", value: 60 },
        { label: "GMT +02:00", value: 120 },
        { label: "GMT +03:00", value: 180 },
        { label: "GMT +04:00", value: 240 },
        { label: "GMT +05:00", value: 300 },
        { label: "GMT +06:00", value: 360 },
        { label: "GMT +07:00", value: 420 },
        { label: "GMT +08:00", value: 480 },
        { label: "GMT +09:00", value: 540 },
        { label: "GMT +10:00", value: 600 },
        { label: "GMT +11:00", value: 660 },
        { label: "GMT +12:00", value: 720 },
    ];

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                    <div className="p-10 md:p-14 text-center border-b border-slate-50">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Generate Your Destiny Report
                        </h1>
                        <p className="text-slate-500 font-medium text-sm tracking-tight">
                            Enter Gregorian Birth Data • Instant Lunar Conversion
                        </p>
                    </div>

                    <div className="p-10 md:p-14 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birth Date & Time (Gregorian)</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                    value={formData.birthDateTime}
                                    onChange={(e) => setFormData({ ...formData, birthDateTime: e.target.value })}
                                />
                                {lunarPreview && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lunar Equivalence</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Year {lunarPreview.year} • Month {lunarPreview.month} • Day {lunarPreview.day}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 shadow-sm">
                                            <span className="text-[10px] font-bold text-[#C8A75B]">CONVERTED</span>
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone (GMT)</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium appearance-none cursor-pointer"
                                        value={formData.tzOffsetMinutes}
                                        onChange={(e) => setFormData({ ...formData, tzOffsetMinutes: parseInt(e.target.value) })}
                                    >
                                        {timezoneOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
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
