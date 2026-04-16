import { NextResponse } from 'next/server';
import {
    generateCelestialSnapshot,
    calculateTemporalQuality,
    calculateAspects,
    calculateRetrogradePeriods,
    findOrbitalResonance,
    calculateGreatConjunction,
    calculateLunarPhases,
    jdnToHexagram,
    getHexagram,
    calculateCosmicElementBalance,
    calculateSynodicCycles,
} from '@/lib/celestial';

/**
 * GET /api/celestial/snapshot
 * Returns complete celestial snapshot for given date
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');
        const date = dateParam ? new Date(dateParam) : new Date();
        
        const snapshot = generateCelestialSnapshot(date);
        
        return NextResponse.json({
            success: true,
            data: snapshot
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate celestial snapshot' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/celestial/aspects
 * Calculate planetary aspects for a date
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, planets } = body;
        
        const targetDate = date ? new Date(date) : new Date();
        const aspectData = calculateAspects(targetDate, planets);
        
        return NextResponse.json({
            success: true,
            data: {
                date: targetDate,
                aspects: aspectData,
                count: aspectData.length
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate aspects' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/celestial/quality
 * Calculate temporal quality for an activity
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { date, activity } = body;
        
        const targetDate = date ? new Date(date) : new Date();
        const activityType = activity || 'begin';
        
        const quality = calculateTemporalQuality(targetDate, activityType);
        
        return NextResponse.json({
            success: true,
            data: quality
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate temporal quality' },
            { status: 500 }
        );
    }
}