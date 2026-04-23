// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  CELESTIAL DASHBOARD COMPONENT                                             ║
// ║  Real-time planetary positions with Bazi correlations                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanetaryData {
    planet: string;
    longitude: number;
    zodiacSign: string;
    chineseBranch: string;
    element: string;
    isRetrograde: boolean;
}

interface CelestialSnapshot {
    timestamp: Date;
    julianDay: number;
    dayPillar: {
        stem: string;
        branch: string;
        element: string;
    };
    hexagram: {
        number: number;
        name: string;
        binary: string;
    };
    planetary: PlanetaryData[];
    elementBalance: Record<string, number>;
    cosmicWeather: {
        dominantElement: string;
        yinYang: string;
        energyQuality: string;
    };
}

const ELEMENT_COLORS: Record<string, string> = {
    wood: '#22c55e',
    fire: '#ef4444',
    earth: '#eab308',
    metal: '#94a3b8',
    water: '#3b82f6',
};

const ELEMENT_ICONS: Record<string, string> = {
    wood: '🌱',
    fire: '🔥',
    earth: '🌍',
    metal: '⚙️',
    water: '💧',
};

export function CelestialDashboard() {
    const [snapshot, setSnapshot] = useState<CelestialSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCelestialData();
        const interval = setInterval(fetchCelestialData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    async function fetchCelestialData() {
        try {
            const response = await fetch('/api/celestial/snapshot');
            if (response.ok) {
                const json = await response.json();
                setSnapshot(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch celestial data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="text-4xl mb-4">🌌</div>
                    <p className="text-slate-400 text-sm font-medium">Calculating planetary positions...</p>
                </div>
            </div>
        );
    }

    if (!snapshot) return null;

    return (
        <div className="space-y-6">
            {/* Header with temporal info */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                            Julian Day {snapshot.julianDay.toFixed(2)}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{ELEMENT_ICONS[snapshot.cosmicWeather.dominantElement]}</span>
                                <span className="text-sm font-medium capitalize">
                                    {snapshot.cosmicWeather.dominantElement} Day
                                </span>
                            </div>
                            <div className="text-slate-500">|⬥|</div>
                            <div className="text-sm font-medium">
                                {snapshot.dayPillar.stem}{snapshot.dayPillar.branch}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="inline-block p-4 bg-white/10 rounded-2xl">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Current Hexagram
                            </p>
                            <p className="text-2xl font-black">#{snapshot.hexagram.number}</p>
                            <p className="text-sm font-medium text-slate-300">{snapshot.hexagram.name}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Element Balance */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6">
                    Cosmic Element Balance
                </h3>
                <div className="grid grid-cols-5 gap-4">
                    {Object.entries(snapshot.elementBalance).map(([element, value]) => (
                        <div key={element} className="text-center">
                            <div className="relative h-32 bg-slate-50 rounded-xl overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${value * 100}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="absolute bottom-0 left-0 right-0"
                                    style={{ backgroundColor: ELEMENT_COLORS[element] }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl">{ELEMENT_ICONS[element]}</span>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase mt-2">{element}</p>
                            <p className="text-lg font-black text-slate-900">{Math.round(value * 100)}%</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Planetary Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6">
                    Current Planetary Positions
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {snapshot.planetary.map((planet, idx) => (
                        <motion.div
                            key={planet.planet}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                            className="bg-slate-50 rounded-xl p-4 border-2 border-transparent hover:border-slate-200 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold uppercase text-slate-500">{planet.planet}</p>
                                {planet.isRetrograde && (
                                    <span className="text-xs text-amber-600 font-bold">ℛ</span>
                                )}
                            </div>
                            
                            <div className="text-center">
                                <p className="text-3xl mb-1">
                                    {getZodiacEmoji(planet.zodiacSign)}
                                </p>
                                <p className="text-xs font-medium text-slate-700 capitalize">
                                    {planet.zodiacSign}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {planet.chineseBranch}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>        
        </div>
    );
}

function getZodiacEmoji(sign: string): string {
    const emojis: Record<string, string> = {
        aries: '♈', taurus: '♉', gemini: '♊',
        cancer: '♋', leo: '♌', virgo: '♍',
        libra: '♎', scorpio: '♏', sagittarius: '♐',
        capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    return emojis[sign] || '☉';
}

// ═══════════════════════════════════════════════════════════════════════════
// HEXAGRAM VISUALIZATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function HexagramDisplay({ 
    binary, 
    movingLines = [],
    size = 'md',
    interactive = true
}: { 
    binary: string; 
    movingLines?: number[];
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
}) {
    const sizeClasses = {
        sm: 'w-4 h-1',
        md: 'w-8 h-2',
        lg: 'w-12 h-3'
    };
    
    const gapClasses = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3'
    };
    
    // Binary is top-to-bottom, display bottom-to-top (traditional)
    const lines = binary.split('').reverse();
    
    return (
        <div className={`flex flex-col-reverse ${gapClasses[size]}`}>
            {lines.map((line, idx) => {
                const position = idx + 1;
                const isMoving = movingLines.includes(position);
                const isYang = line === '1';
                
                return (
                    <motion.div
                        key={position}
                        whileHover={interactive ? { scale: 1.05 } : {}}
                        className={`
                            ${sizeClasses[size]}
                            rounded-full transition-all duration-300
                            ${isYang 
                                ? 'bg-slate-800' 
                                : 'bg-transparent border-2 border-slate-800'
                            }
                            ${isMoving ? 'animate-pulse ring-2 ring-amber-400' : ''}
                        `}
                    />
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ORBITAL RESONANCE CHART
// ═══════════════════════════════════════════════════════════════════════════

export function ResonanceChart({ resonances }: { resonances: Array<{
    planets: [string, string];
    ratio: [number, number];
    exactness: number;
}> }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
                Orbital Resonances
            </h3>
            
            <div className="space-y-3">
                {resonances.slice(0, 5).map((res, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-32">
                            <span className="text-xs capitalize font-medium">{res.planets[0]}</span>
                            <span className="text-slate-300">↔</span>
                            <span className="text-xs capitalize font-medium">{res.planets[1]}</span>
                        </div>
                        
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                            <details className="h-full">
                                <summary className="h-full">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${res.exactness * 100}%` }}
                                    />
                                </summary>
                            </details>
                        </div>
                        
                        <div className="w-16 text-right">
                            <span className="text-xs font-bold text-slate-700">
                                {res.ratio[0]}:{res.ratio[1]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
