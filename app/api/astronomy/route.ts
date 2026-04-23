import { NextResponse } from 'next/server';
import {
    findOrbitalResonance,
    findAllResonances,
    calculateGreatConjunction,
    calculateLunarPhases,
    calculatePrecession,
    calculateNutation,
    calculateCosmicElementBalance,
    calculateSynodicCycles,
    calculateAspects,
} from '@/lib/celestial/astronomy';

/**
 * GET /api/astronomy/resonances
 * Returns all orbital resonances in the solar system
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        
        if (type === 'resonances') {
            const resonances = findAllResonances();
            return NextResponse.json({
                success: true,
                data: resonances
            });
        }
        
        if (type === 'synodic') {
            const cycles = calculateSynodicCycles();
            return NextResponse.json({
                success: true,
                data: cycles
            });
        }
        
        return NextResponse.json(
            { success: false, error: 'Invalid type parameter' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate resonances' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/astronomy/resonance
 * Calculate resonance between two specific planets
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { planet1, planet2 } = body;
        
        if (!planet1 || !planet2) {
            return NextResponse.json(
                { success: false, error: 'Both planet1 and planet2 required' },
                { status: 400 }
            );
        }
        
        const resonance = findOrbitalResonance(planet1.toLowerCase(), planet2.toLowerCase());
        
        return NextResponse.json({
            success: true,
            data: resonance
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate resonance' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/astronomy/conjunctions
 * Calculate great conjunctions (Jupiter-Saturn)
 */
export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'great';
        const count = parseInt(searchParams.get('count') || '10');
        
        if (type === 'great') {
            const conjunctions = calculateGreatConjunction(new Date(), count);
            return NextResponse.json({
                success: true,
                data: conjunctions
            });
        }
        
        return NextResponse.json(
            { success: false, error: 'Invalid conjunction type' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate conjunctions' },
            { status: 500 }
        );
    }
}