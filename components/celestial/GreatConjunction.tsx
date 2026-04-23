// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  GREAT CONJUNCTION CYCLE VISUALIZATION                                     ║
// ║  Jupiter-Saturn 20-year cycle display                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConjunctionData {
    date: string;
    longitude: number;
    sign: string;
    elementShift: 'same' | 'triangular' | 'mutation';
}

const ELEMENT_COLORS: Record<string, string> = {
    fire: 'bg-red-500',
    earth: 'bg-amber-500',
    air: 'bg-slate-400',
    water: 'bg-blue-500',
};

const TRIGON_SIGNS: Record<string, string[]> = {
    fire: ['aries', 'leo', 'sagittarius'],
    earth: ['taurus', 'virgo', 'capricorn'],
    air: ['gemini', 'libra', 'aquarius'],
    water: ['cancer', 'scorpio', 'pisces']
};

export function GreatConjunctionCycle() {
    const [conjunctions, setConjunctions] = useState<ConjunctionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConjunctions();
    }, []);

    async function fetchConjunctions() {
        try {
            const response = await fetch('/api/astronomy/conjunctions?type=great&count=10');
            if (response.ok) {
                const json = await response.json();
                setConjunctions(json.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch conjunctions:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl">
                <div className="text-center">
                    <div className="text-3xl mb-2">🪐</div>
                    <p className="text-sm text-slate-400">Calculating great conjunctions...</p>
                </div>
            </div>
        );
    }

    // Determine current element cycle
    const elements = conjunctions.map(c => getElementFromSign(c.sign));
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center py-6">
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                    Great Conjunction Cycle
                </h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Jupiter and Saturn align every ~20 years. Over 240 years, they trace
                    through all four elements—marking epochs of civilization.
                </p>
            </div>

            {/* Timeline Visualization */}
            <div className="relative h-32 bg-slate-50 rounded-2xl overflow-hidden">
                {/* Element bands */}
                <div className="absolute inset-0 flex">
                    {['fire', 'earth', 'air', 'water', 'fire'].map((element, i) => (
                        <div
                            key={i}
                            className={`flex-1 ${ELEMENT_COLORS[element]} opacity-10`}
                        />
                    ))}
                </div>
                
                {/* Conjunction points */}
                <div className="absolute inset-0 flex items-center px-8">
                    {conjunctions.map((conj, idx) => {
                        const element = getElementFromSign(conj.sign);
                        return (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="absolute flex flex-col items-center"
                                style={{ left: `${(idx / (conjunctions.length - 1)) * 80 + 10}%` }}
                            >
                                <div className={`
                                    w-4 h-4 rounded-full ${ELEMENT_COLORS[element]} 
                                    border-2 border-white shadow-lg
                                `}
                                />
                                
                                <div className="mt-2 text-center">
                                    <p className="text-xs font-bold text-slate-700">
                                        {new Date(conj.date).getFullYear()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                        {conj.sign.slice(0, 3)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Element Legend */}
            <div className="flex justify-center gap-6">
                {Object.entries(TRIGON_SIGNS).map(([element, signs]) => (
                    <div key={element} className="text-center">
                        <div className={`
                            w-8 h-8 rounded-full ${ELEMENT_COLORS[element]} mx-auto mb-2
                            flex items-center justify-center text-white font-bold text-xs
                        `}>
                            {element.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-xs font-medium text-slate-600 capitalize">{element}</p>
                        <p className="text-[10px] text-slate-400">60-year cycle</p>
                    </div>
                ))}
            </div>

            {/* Historical Context */}
            <div className="mt-8 bg-slate-100 rounded-2xl p-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
                    Current Element Cycle
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {<
greenThinkingSpinner>
                        { name: 'Fire', years: '2020-2040', status: 'current' },
                        { name: 'Earth', years: '2040-2060', status: 'future' },
                        { name: 'Air', years: '2060-2080', status: 'future' },
                        { name: 'Water', years: '2080-2100', status: 'future' },
                    ].map((cycle) => (
                        <div 
                            key={cycle.name}
                            className={`
                                p-4 rounded-xl
                                ${cycle.status === 'current' 
                                    ? 'bg-white border-2 border-amber-400' 
                                    : 'bg-slate-50'
                                }
                            `}
                        >
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                {cycle.name} Trigon
                            </p>
                            <p className="text-lg font-black text-slate-900">{cycle.years}</p>
                            {cycle.status === 'current' && (
                                <span className="inline-block mt-2 text-[10px] bg-amber-400 text-amber-900 px-2 py-1 rounded-full font-bold">
                                    ACTIVE
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getElementFromSign(sign: string): string {
    for (const [element, signs] of Object.entries(TRIGON_SIGNS)) {
        if (signs.includes(sign)) return element;
    }
    return 'earth';
}
