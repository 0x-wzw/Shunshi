"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InterpretationReport } from "@/lib/interpretation/types";

export default function ReportPage() {
    const searchParams = useSearchParams();
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-slate-600">{error || "Something went wrong"}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 text-indigo-600 font-semibold hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { bazi, elements, cards, dayun, notes } = report;

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-10">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">BaZi Report</h1>
                        <p className="text-slate-500 uppercase tracking-widest font-bold text-sm mt-1">Hourly Choice Engine MVP</p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="hidden md:block text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        Print Report
                    </button>
                </header>

                {/* Four Pillars */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Year", value: bazi.pillars.year },
                        { label: "Month", value: bazi.pillars.month },
                        { label: "Day", value: bazi.pillars.day },
                        { label: "Hour", value: bazi.pillars.hour },
                    ].map((p, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 text-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{p.label}</span>
                            <div className="text-3xl font-serif text-slate-900 mt-2">{p.value.zh}</div>
                            <div className="text-xs text-slate-500 mt-1">{p.value.heavenlyStemZh}{p.value.earthlyBranchZh}</div>
                        </div>
                    ))}
                </section>

                {/* Five Elements */}
                <section className="bg-white p-8 rounded-2xl shadow-lg border border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Five Elements Scoring</h2>
                        <div className="text-right">
                            <div className="text-xs text-slate-400 font-bold uppercase">Balance Index</div>
                            <div className="text-2xl font-black text-indigo-600">{(elements.balanceIndex * 100).toFixed(0)}%</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(elements.vector).map(([el, score]) => (
                            <div key={el} className="space-y-1">
                                <div className="flex justify-between text-sm font-semibold text-slate-700 capitalize">
                                    <span>{el}</span>
                                    <span>{Number(score).toFixed(1)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getElementColor(el)}`}
                                        style={{ width: `${Math.min(100, (Number(score) / 10) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interpretation Cards */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-500 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900">{card.title}</h3>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${getSeverityStyle(card.severity)}`}>
                                    {card.severity}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4 flex-grow">{card.why}</p>
                            <div className="space-y-2 mb-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations</h4>
                                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                                    {card.whatToDo.map((todo, j) => (
                                        <li key={j}>{todo}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {card.tags.map((tag, j) => (
                                    <span key={j} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* DaYun Timeline */}
                <section className="bg-white rounded-2xl shadow-lg border border-slate-50 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900">Luck Pillars (DaYun)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Pillar</th>
                                    <th className="px-6 py-4">Age Range</th>
                                    <th className="px-6 py-4">Period</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 italic">
                                {dayun.map((d, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500">{d.n}</td>
                                        <td className="px-6 py-4 text-xl font-serif text-slate-900">{d.luckPillarZh}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{d.ageRange}</td>
                                        <td className="px-6 py-4 text-xs text-slate-400">{d.approxUtcRange}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Notes */}
                <footer className="text-slate-400 text-xs italic space-y-1">
                    {notes.map((note, i) => (
                        <p key={i}>* {note}</p>
                    ))}
                </footer>
            </div>
        </main>
    );
}

function getElementColor(el: string) {
    switch (el.toLowerCase()) {
        case "wood": return "bg-green-500";
        case "fire": return "bg-red-500";
        case "earth": return "bg-amber-600";
        case "metal": return "bg-slate-400";
        case "water": return "bg-blue-600";
        default: return "bg-slate-300";
    }
}

function getSeverityStyle(sev: string) {
    switch (sev) {
        case "high": return "bg-red-100 text-red-600";
        case "med": return "bg-amber-100 text-amber-600";
        case "low": return "bg-blue-100 text-blue-600";
        default: return "bg-slate-100 text-slate-600";
    }
}
