import { NextResponse } from 'next/server';
import {
    calculateHeliocentricPosition,
    calculateGeocentricPosition,
    PLANETARY_ELEMENTS,
    longitudeToZodiac,
    getPlanetaryDignity,
    isRetrograde,
} from '@/lib/celestial/ephemeris';
import { calculateRetrogradePeriods, calculateSynodicCycles } from '@/lib/celestial/astronomy';

/**
 * GET /api/ephemeris/[planet]
 * Returns detailed ephemeris data for a specific planet
 */
export async function GET(
    request: Request,
    { params }: { params: { planet: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');
        const date = dateParam ? new Date(dateParam) : new Date();
        
        const { planet } = params;
        
        // Validate planet
        const validPlanets = ['mercury', 'venus', 'mars', 'jupiter', 
                              'saturn', 'uranus', 'neptune'];
        if (!validPlanets.includes(planet.toLowerCase())) {
            return NextResponse.json(
                { success: false, error: `Invalid planet: ${planet}` },
                { status: 400 }
            );
        }
        
        const p = planet.toLowerCase();
        
        // Calculate positions
        const heliocentric = calculateHeliocentricPosition(p, date);
        const geocentric = calculateGeocentricPosition(p, date);
        const zodiac = longitudeToZodiac(heliocentric.longitude);
        const dignity = getPlanetaryDignity(p, heliocentric.longitude);
        const retrograde = isRetrograde(p, date);
        
        // Get elemental associations
        const elements = PLANETARY_ELEMENTS[p];
        
        // Get next retrograde periods
        const retrogrades = calculateRetrogradePeriods(p, date.getFullYear());
        
        return NextResponse.json({
            success: true,
            data: {
                planet: p,
                timestamp: date.toISOString(),
                heliocentric: {
                    longitude: Math.round(heliocentric.longitude * 1000) / 1000,
                    latitude: Math.round(heliocentric.latitude * 1000) / 1000,
                    distance: Math.round(heliocentric.radius * 1000) / 1000,
                },
                geocentric: {
                    rightAscension: Math.round(geocentric.rightAscension * 1000) / 1000,
                    declination: Math.round(geocentric.declination * 1000) / 1000,
                    distance: Math.round(geocentric.distance * 1000) / 1000,
                    elongation: Math.round(geocentric.elongation * 100) / 100,
                    phase: Math.round(geocentric.phase * 100) / 100,
                },
                zodiac: {
                    sign: zodiac.sign,
                    chineseBranch: zodiac.branch,
                    degree: Math.round(zodiac.degree * 100) / 100,
                    element: zodiac.element,
                },
                dignity: {
                    state: dignity.dignity,
                    score: dignity.score,
                },
                characteristics: {
                    elements: elements,
                    isRetrograde: retrograde,
                },
                upcomingRetrogrades: retrogrades.slice(0, 2).map(r => ({
                    start: r.start.toISOString(),
                    end: r.end.toISOString(),
                    elementalTheme: r.elementalTheme,
                })),
            }
        });
    } catch (error) {
        console.error('Ephemeris calculation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to calculate ephemeris data' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/ephemeris
 * Batch calculation for multiple planets
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { planets, date: dateParam } = body;
        
        const date = dateParam ? new Date(dateParam) : new Date();
        
        const validPlanets = ['mercury', 'venus', 'mars', 'jupiter', 
                              'saturn', 'uranus', 'neptune'];
        
        const requestedPlanets = planets?.length 
            ? planets.filter((p: string) => validPlanets.includes(p.toLowerCase()))
            : validPlanets;
        
        const results = requestedPlanets.map((p: string) => {
            const heliocentric = calculateHeliocentricPosition(p, date);
            const zodiac = longitudeToZodiac(heliocentric.longitude);
            const retrograde = isRetrograde(p, date);
            
            return {
                planet: p,
                longitude: Math.round(heliocentric.longitude * 1000) / 1000,
                zodiacSign: zodiac.sign,
                chineseBranch: zodiac.branch,
                element: zodiac.element,
                isRetrograde: retrograde,
            };
        });
        
        return NextResponse.json({
            success: true,
            data: {
                timestamp: date.toISOString(),
                planets: results,
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate planetary positions' },
            { status: 500 }
        );
    }
}