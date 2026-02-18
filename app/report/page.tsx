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
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-indigo-400 font-bold tracking-widest uppercase text-xs animate-pulse">Analyzing Pillars...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                <div className="glass-dark p-10 rounded-[2rem] text-center max-w-sm border border-red-500/20">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-50 mb-4 tracking-tight">Calculation Error</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">{error || "The engine could not process your request"}</p>
                    <button
                        onClick={() => router.back()}
                        className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all active:scale-95"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { bazi, elements, cards, dayun, notes } = report;

    return (
        <main className="min-h-screen p-4 md:p-12 pb-24">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Navigation / Header */}
                <nav className="flex items-center justify-between z-20">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-all"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">←</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Engine</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                            Export PDF
                        </button>
                    </div>
                </nav>

                <header className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Your <span className="text-gradient">Potential</span></h1>
                    <p className="text-slate-500 font-medium tracking-tight">Based on birth date {new Date(searchParams.get("birthIsoUtc") || "").toLocaleDateString()}</p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Four Pillars Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Year", value: bazi.pillars.year, icon: "🕰️" },
                                { label: "Month", value: bazi.pillars.month, icon: "🗓️" },
                                { label: "Day", value: bazi.pillars.day, icon: "☀️" },
                                { label: "Hour", value: bazi.pillars.hour, icon: "⌛" },
                            ].map((p, i) => (
                                <div key={i} className="glass-dark p-6 rounded-3xl group hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{p.label}</span>
                                        <span className="opacity-40 grayscale group-hover:grayscale-0 transition-all">{p.icon}</span>
                                    </div>
                                    <div className="text-4xl font-serif text-white mb-1">{p.value.zh}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                                        {p.value.heavenlyStemZh} · {p.value.earthlyBranchZh}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interpretation Cards Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {cards.map((card, i) => (
                                <div key={i} className={`glass-dark p-8 rounded-[2.5rem] flex flex-col h-full relative overflow-hidden group`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 ${getSeverityColor(card.severity)}`}></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-bold text-slate-100">{card.title}</h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getSeverityBadge(card.severity)}`}>
                                            {card.severity}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{card.why}</p>
                                    <div className="space-y-4">
                                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Actionable Strategy</h4>
                                        <ul className="space-y-3">
                                            {card.whatToDo.map((todo, j) => (
                                                <li key={j} className="flex items-start space-x-3 text-xs text-slate-300 font-medium leading-tight">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0"></span>
                                                    <span>{todo}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-8">
                                        {card.tags.map((tag, j) => (
                                            <span key={j} className="text-[9px] bg-slate-800/50 text-slate-500 px-3 py-1.5 rounded-full font-bold">#{tag.toUpperCase()}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Elements Sidebar */}
                        <div className="glass-dark p-8 rounded-[2.5rem] sticky top-4">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Elements</h2>
                                    <p className="text-slate-500 text-xs font-medium">Core score vector</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Balance</div>
                                    <div className="text-4xl font-black text-indigo-400 leading-none">{(elements.balanceIndex * 100).toFixed(0)}%</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {Object.entries(elements.vector).map(([el, score]) => (
                                    <div key={el} className="group">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                                            <span>{el}</span>
                                            <span className="text-slate-200">{Number(score).toFixed(1)}</span>
                                        </div>
                                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-[2px] border border-slate-800/50">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getElementColor(el)} shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]`}
                                                style={{ width: `${Math.min(100, (Number(score) / 20) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-800/50">
                                <p className="text-[10px] text-slate-500 font-semibold italic leading-relaxed">
                                    "The Five Elements (Wu Xing) are the governing forces of all material existence. Harmony is found in the balance of interactions."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DaYun Timeline Full Width */}
                <section className="glass-dark rounded-[2.5rem] overflow-hidden border border-slate-800/30">
                    <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white">DaYun Timeline</h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">10-Year Luck Cycle</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
                                <tr>
                                    <th className="px-8 py-5">Index</th>
                                    <th className="px-8 py-5">Luck Pillar</th>
                                    <th className="px-8 py-5">Age Interval</th>
                                    <th className="px-8 py-5 text-right w-64">Approximate Timeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {dayun.map((d, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6 text-xs text-slate-500 font-black">{String(d.n).padStart(2, '0')}</td>
                                        <td className="px-8 py-6 text-3xl font-serif text-white group-hover:text-indigo-400 transition-colors">{d.luckPillarZh}</td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-300 tracking-tighter">{d.ageRange}</td>
                                        <td className="px-8 py-6 text-[10px] text-slate-500 text-right font-medium tracking-tight italic opacity-60">
                                            {d.approxUtcRange}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Notes Footer */}
                <footer className="pt-12 border-t border-slate-800/30">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Methodology Notes</div>
                            <div className="space-y-2">
                                {notes.map((note, i) => (
                                    <p key={i} className="text-xs text-slate-500 italic leading-relaxed">* {note}</p>
                                ))}
                            </div>
                        </div>
                        <div className="text-right hidden md:block opacity-30">
                            <span className="text-6xl font-black tracking-tighter text-slate-800">MVX V1.0</span>
                        </div>
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
