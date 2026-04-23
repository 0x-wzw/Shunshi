"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CelestialDashboard } from '@/components/celestial/CelestialDashboard';
import { GreatConjunctionCycle } from '@/components/celestial/GreatConjunction';
import { HexagramDisplay } from '@/components/celestial/CelestialDashboard';

export default function CelestialPage() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [hexagramData, setHexagramData] = useState<any>(null);

    useEffect(() => {
        fetchCurrentHexagram();
    }, []);

    async function fetchCurrentHexagram() {
        try {
            const response = await fetch('/api/hexagrams/temporal?type=day');
            if (response.ok) {
                const json = await response.json();
                setHexagramData(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch hexagram:', error);
        }
    }

    const tabs = [
        { id: 'dashboard', label: 'Celestial Dashboard' },
        { id: 'conjunctions', label: 'Great Conjunctions' },
        { id: 'hexagram', label: 'Current Hexagram' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        Astrum Harmonis
                    </h1>
                    <p className="text-slate-500">
                        Celestial computations and planetary ephemeris
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'dashboard' && <CelestialDashboard />}
                    
                    {activeTab === 'conjunctions' && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <GreatConjunctionCycle />
                        </div>
                    )}
                    
                    {activeTab === 'hexagram' && hexagramData && (
                        <div className="bg-slate-900 rounded-3xl p-8 text-white">
                            <div className="flex items-start gap-8">
                                <div className="shrink-0">
                                    <HexagramDisplay 
                                        binary={hexagramData.hexagram.binary} 
                                        size="lg" 
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-5xl font-black">
                                            #{hexagramData.hexagram.number}
                                        </span>
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {hexagramData.hexagram.name.english}
                                            </h2>
                                            <p className="text-slate-400">
                                                {hexagramData.hexagram.name.chinese}
                                                {' '}
                                                {hexagramData.hexagram.name.pinyin}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/5 rounded-2xl p-6 mb-6">
                                        <p className="text-lg italic leading-relaxed">
                                            "{hexagramData.hexagram.judgment}"
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Element</p>
                                            <p className="text-lg font-bold capitalize">
                                                {hexagramData.hexagram.attributes.element}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Quality</p>
                                            <p className="text-lg font-bold capitalize">
                                                {hexagramData.hexagram.attributes.quality}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Day Pillar</p>
                                            <p className="text-lg font-bold">
                                                {hexagramData.correlation.dayPillar.stem}
                                                {hexagramData.correlation.dayPillar.branch}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Resonance</p>
                                            <p className="text-lg font-bold capitalize">
                                                {hexagramData.correlation.elementResonance}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-sm leading-relaxed text-slate-300">
                                    {hexagramData.hexagram.image}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}