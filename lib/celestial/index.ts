// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  KAIROS CELESTIAL COMPUTATIONS MODULE                                      ║
// ║  Export all astronomical, temporal, and mathematical functions             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Astrum Harmonis Module
 * 
 * The complete celestial computation library for Kairos.
 * Unified exports from:
 * - ephemeris.ts - Planetary position calculations
 * - time.ts - Temporal mathematics and Julian dates
 * - hexagrams.ts - Zhouyi/I Ching state space
 * - astronomy.ts - Mathematical astronomy utilities
 */

// ═══════════════════════════════════════════════════════════════════════════
// TIME & TEMPORAL CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Julian Date conversions
    gregorianToJDN,
    jdnToGregorian,
    dateToJulianDate,
    julianDateToDate,
    J2000,
    toJulianCenturies,
    fromJulianCenturies,
    
    // Sexagenary cycle (Bazi)
    calculateDayPillar,
    calculateYearPillar,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    
    // Trigonometric utilities
    mod360,
    angularDifference,
    toRadians,
    toDegrees,
    
    // Interpolation
    lerp,
    cubicInterpolation,
    findRoot,
    
    // Time scales
    deltaT,
    utcToTT,
    
    // Coordinate systems
    sphericalToCartesian,
    cartesianToSpherical,
    sphericalDistance,
    
    // Resonance
    orbitalResonance,
    synodicPeriod,
    returnPeriod,
} from './time';

export type {
    SexagenaryPillar,
    SphericalCoords,
    CartesianCoords,
} from './time';

// ═══════════════════════════════════════════════════════════════════════════
// PLANETARY EPHEMERIS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Orbital elements
    PLANETARY_ELEMENTS,
    PLANETARY_RATES,
    
    // Position calculations
    calculateHeliocentricPosition,
    calculateGeocentricPosition,
    
    // Event calculations
    findNextConjunction,
    isRetrograde,
    getSynodicPeriod,
    
    // Zodiac mapping
    longitudeToZodiac,
    getPlanetaryDignity,
    PLANETARY_ELEMENTS as PLANETARY_ELEMENT_ASSOCIATIONS,
} from './ephemeris';

export type {
    OrbitalElements,
    HeliocentricCoords,
    GeocentricCoords,
    PlanetarySnapshot,
    CelestialState,
    CelestialAspect,
} from './ephemeris';

// ═══════════════════════════════════════════════════════════════════════════
// HEXAGRAM / I CHING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Core data
    HEXAGRAMS,
    HEXAGRAM_BY_NUMBER,
    HEXAGRAM_BY_BINARY,
    HEXAGRAM_BY_VALUE,
    
    // Lookups
    getHexagram,
    
    // Transformations
    getOppositeHexagram,
    getNuclearHexagram,
    getTransformedHexagram,
    hexagramRelationship,
    
    // State space analysis
    analyzeStateSpace,
    calculateTrajectory,
    
    // Temporal correlations
    jdnToHexagram,
    hourToHexagram,
    hexagramBaziResonance,
} from './hexagrams';

export type {
    HexagramLine,
    Hexagram,
} from './hexagrams';

// ═══════════════════════════════════════════════════════════════════════════
// MATHEMATICAL ASTRONOMY
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Orbital resonance
    findOrbitalResonance,
    findAllResonances,
    calculateGreatConjunction,
    
    // Retrograde analysis
    calculateRetrogradePeriods,
    
    // Eclipse predictions
    calculateLunarPhases,
    
    // Bazi synthesis
    mapZodiacPosition,
    calculateCosmicElementBalance,
    CelestialBaziSynthesis,
    
    // Synodic cycles
    calculateSynodicCycles,
    
    // Aspects
    calculateAspects,
    
    // Precession
    calculatePrecession,
    calculateNutation,
} from './astronomy';

export type {
    ResonancePattern,
    RetrogradePeriod,
    Eclipse,
    PlanetaryAspect,
} from './astronomy';

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

import { dateToJulianDate, calculateDayPillar, mod360 } from './time';
import { calculateHeliocentricPosition } from './ephemeris';
import { HEXAGRAM_BY_NUMBER, jdnToHexagram, hexagramBaziResonance, mapZodiacPosition } from './hexagrams';
import { calculateCosmicElementBalance, calculateAspects, ResonancePattern } from './astronomy';

/**
 * Complete celestial snapshot for a given moment
 */
export interface KairosCelestialSnapshot {
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
    planetary: Array<{
        planet: string;
        longitude: number;
        zodiacSign: string;
        chineseBranch: string;
        isRetrograde: boolean;
    }>;
    elementBalance: Record<string, number>;
    aspects: Array<{
        planets: string[];
        aspect: string;
        angle: number;
    }>;
    resonances: ResonancePattern[];
    cosmicWeather: {
        dominantElement: string;
        yinYang: 'yin' | 'yang' | 'balanced';
        energyQuality: 'expansive' | 'contractive' | 'active' | 'receptive';
    };
}

/**
 * Generate complete celestial snapshot
 */
export function generateCelestialSnapshot(date: Date = new Date()): KairosCelestialSnapshot {
    const jdn = dateToJulianDate(date);
    const dayPillar = calculateDayPillar(Math.floor(jdn));
    const hexagram = jdnToHexagram(jdn);
    
    // Planetary positions
    const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const planetary = planets.map(p => {
        const pos = calculateHeliocentricPosition(p, date);
        const zodiac = mapZodiacPosition(pos.longitude);
        
        return {
            planet: p,
            longitude: pos.longitude,
            zodiacSign: zodiac.sign,
            chineseBranch: zodiac.branch,
            isRetrograde: false // Simplified - would need historical comparison
        };
    });
    
    // Element balance
    const elementBalance = calculateCosmicElementBalance(date);
    
    // Find dominant element
    const entries = Object.entries(elementBalance);
    entries.sort(([,a], [,b]) => b - a);
    const dominantElement = entries[0][0];
    
    // Aspects
    const aspects = calculateAspects(date).map(a => ({
        planets: [a.planet1, a.planet2],
        aspect: a.aspect,
        angle: Math.round(a.angle * 10) / 10
    }));
    
    return {
        timestamp: date,
        julianDay: jdn,
        dayPillar: {
            stem: dayPillar.stem,
            branch: dayPillar.branch,
            element: dayPillar.stemElement
        },
        hexagram: {
            number: hexagram.number,
            name: hexagram.name.english,
            binary: hexagram.binary
        },
        planetary,
        elementBalance,
        aspects,
        resonances: [], // Would need full resonance calculation
        cosmicWeather: {
            dominantElement,
            yinYang: dayPillar.stemYinYang,
            energyQuality: mapElementToQuality(dominantElement)
        }
    };
}

function mapElementToQuality(element: string): 'expansive' | 'contractive' | 'active' | 'receptive' {
    const map: Record<string, typeof mapElementToQuality> = {
        wood: 'expansive',
        fire: 'active',
        earth: 'receptive',
        metal: 'contractive',
        water: 'receptive'
    };
    return (map[element] || 'receptive') as ReturnType<typeof mapElementToQuality>;
}

/**
 * Calculate temporal quality score
 * 0-1 scale of how favorable current moment is for various activities
 */
export function calculateTemporalQuality(
    date: Date,
    activity: 'begin' | 'expand' | 'consolidate' | 'release'
): { score: number; reasoning: string } {
    const snapshot = generateCelestialSnapshot(date);
    const dominant = snapshot.cosmicWeather.dominantElement;
    const hexNum = snapshot.hexagram.number;
    
    const elementScoring: Record<string, { begin: number; expand: number; consolidate: number; release: number }> = {
        wood: { begin: 0.9, expand: 0.7, consolidate: 0.4, release: 0.2 },
        fire: { begin: 0.6, expand: 0.9, consolidate: 0.5, release: 0.3 },
        earth: { begin: 0.5, expand: 0.5, consolidate: 0.9, release: 0.4 },
        metal: { begin: 0.3, expand: 0.3, consolidate: 0.7, release: 0.9 },
        water: { begin: 0.4, expand: 0.2, consolidate: 0.3, release: 0.8 }
    };
    
    const score = elementScoring[dominant]?.[activity] || 0.5;
    
    const reasoningStatements: Record<string, string> = {
        begin: `Dominant ${dominant} energy favors initiation and planting seeds.`,
        expand: `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} phase supports growth and extension.`,
        consolidate: `Current ${dominant} quality encourages gathering and storing resources.`,
        release: `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} energy facilitates letting go and completion.`
    };
    
    return {
        score,
        reasoning: reasoningStatements[activity]
    };
}
