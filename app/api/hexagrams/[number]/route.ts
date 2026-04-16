import { NextResponse } from 'next/server';
import {
    getHexagram,
    getOppositeHexagram,
    getNuclearHexagram,
    getTransformedHexagram,
    jdnToHexagram,
    hourToHexagram,
    analyzeStateSpace,
    calculateTrajectory,
    hexagramRelationship,
} from '@/lib/celestial/hexagrams';
import { calculateDayPillar, dateToJulianDate } from '@/lib/celestial/time';

/**
 * GET /api/hexagrams/[number]
 * Returns detailed information about a specific hexagram
 */
export async function GET(
    request: Request,
    { params }: { params: { number: string } }
) {
    try {
        const num = parseInt(params.number);
        if (isNaN(num) || num < 1 || num > 64) {
            return NextResponse.json(
                { success: false, error: 'Hexagram number must be 1-64' },
                { status: 400 }
            );
        }
        
        const hexagram = getHexagram(num);
        if (!hexagram) {
            return NextResponse.json(
                { success: false, error: 'Hexagram not found' },
                { status: 404 }
            );
        }
        
        // Get related hexagrams
        const opposite = getOppositeHexagram(hexagram);
        const nuclear = getNuclearHexagram(hexagram);
        
        return NextResponse.json({
            success: true,
            data: {
                hexagram: {
                    number: hexagram.number,
                    name: hexagram.name,
                    binary: hexagram.binary,
                    trigrams: hexagram.trigrams,
                    attributes: hexagram.attributes,
                    judgment: hexagram.judgment,
                    image: hexagram.image,
                },
                relationships: {
                    opposite: {
                        number: opposite.number,
                        name: opposite.name,
                        binary: opposite.binary,
                    },
                    nuclear: {
                        number: nuclear.number,
                        name: nuclear.name,
                        binary: nuclear.binary,
                    },
                },
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to retrieve hexagram' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/hexagrams/transform
 * Calculate transformed hexagram from moving lines
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { hexagramNumber, movingLines } = body;
        
        const hexagram = getHexagram(hexagramNumber);
        if (!hexagram) {
            return NextResponse.json(
                { success: false, error: 'Invalid hexagram number' },
                { status: 400 }
            );
        }
        
        const validMovingLines = movingLines?.filter((l: number) => l >= 1 && l <= 6) || [];
        
        const result = getTransformedHexagram(hexagram, validMovingLines);
        
        return NextResponse.json({
            success: true,
            data: {
                original: {
                    number: hexagram.number,
                    name: hexagram.name,
                    binary: hexagram.binary,
                },
                transformed: {
                    number: result.hexagram.number,
                    name: result.hexagram.name,
                    binary: result.hexagram.binary,
                },
                movingLines: result.lines.map(l => ({
                    position: l.position,
                    value: l.value,
                    isChanging: l.isChanging,
                    isYang: l.isYang,
                })),
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate transformation' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/hexagrams/temporal
 * Get hexagram based on temporal position
 */
export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');
        const type = searchParams.get('type') || 'day'; // 'day', 'hour'
        
        const date = dateParam ? new Date(dateParam) : new Date();
        
        let hexagram;
        
        if (type === 'day') {
            const jdn = dateToJulianDate(date);
            hexagram = jdnToHexagram(Math.floor(jdn));
        } else if (type === 'hour') {
            const hour = date.getHours();
            hexagram = hourToHexagram(hour);
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid temporal type' },
                { status: 400 }
            );
        }
        
        // Get day pillar for correlation
        const jdn = dateToJulianDate(date);
        const dayPillar = calculateDayPillar(Math.floor(jdn));
        
        return NextResponse.json({
            success: true,
            data: {
                timestamp: date.toISOString(),
                temporalType: type,
                hexagram: {
                    number: hexagram.number,
                    name: hexagram.name,
                    binary: hexagram.binary,
                    judgment: hexagram.judgment,
                    attributes: hexagram.attributes,
                },
                correlation: {
                    dayPillar: {
                        stem: dayPillar.stem,
                        branch: dayPillar.branch,
                        element: dayPillar.stemElement,
                    },
                    elementResonance: dayPillar.stemElement === hexagram.attributes.element 
                        ? 'strong' 
                        : 'moderate',
                }
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to calculate temporal hexagram' },
            { status: 500 }
        );
    }
}