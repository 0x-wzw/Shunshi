"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { InterpretationReport } from "@/lib/interpretation/types";
import ChatInterface from "@/components/ChatInterface";

export default function ReportPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [report, setReport] = useState<InterpretationReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            const birthIsoUtc = searchParams.get("birthIsoUtc");
            const gender = searchParams.get("gender");
            const tzOffsetMinutes = searchParams.get("tzOffsetMinutes");
            const dayStartHourLocal = searchParams.get("dayStartHourLocal");

            if (!birthIsoUtc || !gender) {
                setError("Missing required parameters.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/bazi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        birthIsoUtc,
                        gender,
                        tzOffsetMinutes: Number(tzOffsetMinutes),
                        dayStartHourLocal: Number(dayStartHourLocal),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch report");
                }

                const data = await response.json();
                setReport(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] animate-pulse">Calculating Intelligence...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
                <div className="bg-white p-12 rounded-[2.5rem] text-center max-w-sm border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-2">Calculation Error</h2>
                    <p className="text-slate-500 text-xs leading-relaxed mb-8">{error || "Unable to generate report"}</p>
                    <button
                        onClick={() => router.back()}
                        className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const { bazi, elements, cards, dayun, notes } = report;

    return (
        <main className="min-h-screen p-8 md:p-12 lg:p-16 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => router.back()}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-slate-900 transition-colors"
                        >
                            ← Back to Intelligence Input
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            BaZi Decision <span className="text-[#C8A75B]">Report</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Identity Analysis System • {new Date(searchParams.get("birthIsoUtc") || "").toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* SECTION A: Four Pillars */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Year", value: bazi.pillars.year },
                        { label: "Month", value: bazi.pillars.month },
                        { label: "Day", value: bazi.pillars.day },
                        { label: "Hour", value: bazi.pillars.hour },
                    ].map((p, i) => (
                        <div key={i} className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{p.label} Pillar</div>
                            <div className="text-5xl font-serif text-slate-900 mb-2">{p.value.zh}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic opacity-80">
                                {p.value.heavenlyStemZh} · {p.value.earthlyBranchZh}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* SECTION C & D: Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* SECTION C: Interpretation Cards */}
                        <div className="space-y-6">
                            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Strategic Insights</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {cards.map((card, i) => (
                                    <div key={i} className="bg-white border border-slate-200 shadow-sm p-10 rounded-[2.5rem] flex flex-col h-full hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getSeverityBadge(card.severity)}`}>
                                                {card.severity}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{card.why}</p>
                                        <div className="space-y-4">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions</div>
                                            <ul className="space-y-3">
                                                {card.whatToDo.map((todo, j) => (
                                                    <li key={j} className="flex items-start space-x-3 text-xs text-slate-700 font-medium leading-tight">
                                                        <span className="w-1 h-1 rounded-full bg-[#C8A75B] mt-1.5 shrink-0"></span>
                                                        <span>{todo}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-10">
                                            {card.tags.map((tag, j) => (
                                                <span key={j} className="text-[9px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold">#{tag.toUpperCase()}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION D: Luck Cycle Timeline */}
                        <div className="space-y-6">
                            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">DaYun Luck Cycles</h2>
                            <div className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <tr>
                                                <th className="px-10 py-5">#</th>
                                                <th className="px-10 py-5">Pillar</th>
                                                <th className="px-10 py-5">Age</th>
                                                <th className="px-10 py-5 text-right w-64">Timeline Range</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dayun.map((d, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-10 py-6 text-xs text-slate-400 font-black">{String(d.n).padStart(2, '0')}</td>
                                                    <td className="px-10 py-6 text-3xl font-serif text-slate-900">{d.luckPillarZh}</td>
                                                    <td className="px-10 py-6 text-sm font-black text-slate-700 tracking-tight">{d.ageRange}</td>
                                                    <td className="px-10 py-6 text-[10px] text-slate-400 text-right font-medium italic opacity-70">
                                                        {d.approxUtcRange}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION B: Five Elements (Right Sidebar) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-[3rem] sticky top-8">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Five Elements</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Energy Vector</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Balance</div>
                                    <div className="px-3 py-1 bg-slate-900 text-white text-xs font-black rounded-lg leading-none">
                                        {(elements.balanceIndex * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {Object.entries(elements.vector).map(([el, score]) => (
                                    <div key={el} className="space-y-3">
                                        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                                            <span>{el}</span>
                                            <span className="text-slate-900">{Number(score).toFixed(1)}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 bg-[#C8A75B]`}
                                                style={{ width: `${Math.min(100, (Number(score) / 20) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-10 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed text-center">
                                    "Clarity results from the balanced interaction of elemental forces."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION E: Notes Footer */}
                <footer className="pt-12 border-t border-slate-200">
                    <div className="bg-slate-100 p-10 rounded-[2.5rem] border border-slate-200/60 max-w-3xl">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Methodology & Intelligence</div>
                        <div className="space-y-3 opacity-70">
                            {notes.map((note, i) => (
                                <p key={i} className="text-[11px] text-slate-600 font-medium leading-relaxed italic">• {note}</p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 flex justify-between items-center opacity-30 grayscale">
                        <span className="text-3xl font-black tracking-tighter text-slate-900">MVX V1.1</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Confidential Destiny Intelligence</span>
                    </div>
                </footer>
            </div>
            <ChatInterface report={report} />
        </main>
    );
}

function getElementColor(el: string) {
    switch (el.toLowerCase()) {
        case "wood": return "bg-emerald-500 shadow-emerald-500/20";
        case "fire": return "bg-rose-500 shadow-rose-500/20";
        case "earth": return "bg-orange-600 shadow-orange-600/20";
        case "metal": return "bg-slate-400 shadow-slate-400/20";
        case "water": return "bg-sky-600 shadow-sky-600/20";
        default: return "bg-indigo-500 shadow-indigo-500/20";
    }
}

function getSeverityColor(sev: string) {
    switch (sev) {
        case "high": return "bg-red-500";
        case "med": return "bg-amber-500";
        case "low": return "bg-indigo-500";
        default: return "bg-slate-500";
    }
}

function getSeverityBadge(sev: string) {
    switch (sev) {
        case "high": return "bg-red-500/10 text-red-500 border border-red-500/20";
        case "med": return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
        case "low": return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
        default: return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
}
