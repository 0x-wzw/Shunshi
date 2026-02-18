"use client";

import { useState } from "react";
import { useRouter } from "navigation";

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
            // Mock conversion from Lunar to Solar
            // In real app, call lunarToSolar from lib/bazi/calendar
            // For now, approximate:
            const solarDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour);
            solarDate.setDate(solarDate.getDate() + 30); // Mock jump
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
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">Hourly Choice Engine</h1>
                    <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider font-semibold">BaZi Analysis MVP</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setCalendarType("solar")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${calendarType === "solar" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Solar (Gregorian)
                    </button>
                    <button
                        onClick={() => setCalendarType("lunar")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${calendarType === "lunar" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Lunar (Chinese)
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {calendarType === "solar" ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Birth Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.birthDateTime}
                                onChange={(e) => setFormData({ ...formData, birthDateTime: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium text-slate-700">Lunar Year</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.birthYear}
                                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Month</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.birthMonth}
                                    onChange={(e) => setFormData({ ...formData, birthMonth: Number(e.target.value) })}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Day</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.birthDay}
                                    onChange={(e) => setFormData({ ...formData, birthDay: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isLeap"
                                    checked={formData.isLeap}
                                    onChange={(e) => setFormData({ ...formData, isLeap: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                                />
                                <label htmlFor="isLeap" className="text-sm font-medium text-slate-700">Leap Month</label>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Gender</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">TZ Offset (mins)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.tzOffsetMinutes}
                                onChange={(e) => setFormData({ ...formData, tzOffsetMinutes: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Day Rollover</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={formData.dayStartHourLocal}
                                onChange={(e) => setFormData({ ...formData, dayStartHourLocal: Number(e.target.value) })}
                            >
                                <option value={23}>23:00 (Zi-hour)</option>
                                <option value={0}>00:00 (Midnight)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-lg"
                    >
                        Generate Report
                    </button>
                </form>
            </div>
        </main>
    );
}
