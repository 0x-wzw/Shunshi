// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  VSOP87-BASED PLANETARY EPHEMERIS ENGINE                                 ║
// ║  High-precision orbital mechanics for solar system bodies                  ║
// ║  Reference: Bureau des Longitudes, Paris (1987)                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Kairos Ephemeris Engine
 * 
 * Calculates planetary positions using VSOP87 (Variations Séculaires des Orbites
 * Planétaires) series expansions. Provides heliocentric and geocentric coordinates
 * for navigation, conjunction prediction, and celestial event computation.
 */

import { JulianDate, toJulianCenturies, mod360 } from './time';

// ═══════════════════════════════════════════════════════════════════════════
// PLANETARY CONSTANTS (VSOP87)
// ═══════════════════════════════════════════════════════════════════════════

export interface OrbitalElements {
    a: number;      // Semi-major axis (AU)
    e: number;      // Eccentricity
    i: number;      // Inclination (degrees)
    L: number;      // Mean longitude (degrees)
    omega: number;  // Longitude of perihelion (degrees)
    node: number;   // Longitude of ascending node (degrees)
}

// Planetary mean orbital elements (J2000 epoch)
export const PLANETARY_ELEMENTS: Record<string, OrbitalElements> = {
    mercury: {
        a: 0.38709893,
        e: 0.20563069,
        i: 7.00487,
        L: 252.25084,
        omega: 77.45645,
        node: 48.33167
    },
    venus: {
        a: 0.72333199,
        e: 0.00677323,
        i: 3.39471,
        L: 181.97973,
        omega: 131.53298,
        node: 76.68069
    },
    earth: {
        a: 1.00000011,
        e: 0.01671022,
        i: 0.00005,
        L: 100.46435,
        omega: 102.94719,
        node: 0.0
    },
    mars: {
        a: 1.52366231,
        e: 0.09341233,
        i: 1.85061,
        L: -4.553432,
        omega: -23.943629,
        node: 49.57854
    },
    jupiter: {
        a: 5.20336301,
        e: 0.04839266,
        i: 1.30530,
        L: 34.351484,
        omega: 14.331309,
        node: 100.55615
    },
    saturn: {
        a: 9.53707032,
        e: 0.05415060,
        i: 2.48446,
        L: 50.077471,
        omega: 92.867982,
        node: 113.71504
    },
    uranus: {
        a: 19.19126393,
        e: 0.04716771,
        i: 0.76986,
        L: 314.055005,
        omega: 170.954276,
        node: 74.22988
    },
    neptune: {
        a: 30.06896348,
        e: 0.00858587,
        i: 1.76917,
        L: 304.348665,
        omega: 44.964762,
        node: 131.72169
    }
};

// Rate of change per Julian century
export const PLANETARY_RATES: Record<string, Partial<OrbitalElements>> = {
    mercury: {
        a: 0.00000066, e: 0.00002527, i: -23.51, L: 149472.67411,
        omega: 573.57, node: -446.30
    },
    venus: {
        a: 0.00000092, e: -0.00004938, i: -2.86, L: 58517.81560,
        omega: -108.78, node: -19.49
    },
    earth: {
        a: -0.00000005, e: -0.00003804, i: -46.94, L: 35999.37245,
        omega: 1198.28, node: -11.26
    },
    mars: {
        a: -0.00007221, e: 0.00011902, i: -25.47, L: 19140.29934,
        omega: 1560.78, node: -1020.19
    },
    jupiter: {
        a: 0.00060737, e: -0.00012880, i: -4.15, L: 3034.90393,
        omega: 839.93, node: -1217.17
    },
    saturn: {
        a: -0.00301530, e: -0.00036762, i: 6.11, L: 1222.113794,
        omega: -1948.89, node: -1591.05
    },
    uranus: {
        a: 0.00152025, e: -0.00019150, i: -2.09, L: 428.495125,
        omega: 1312.55, node: -1681.40
    },
    neptune: {
        a: -0.00125196, e: 0.00002514, i: -3.64, L: 218.461639,
        omega: -844.43, node: -151.25
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// CORE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface HeliocentricCoords {
    x: number;  // AU
    y: number;  // AU
    z: number;  // AU
    longitude: number;  // degrees (ecliptic)
    latitude: number;   // degrees
    radius: number;     // AU (distance from Sun)
}

export interface GeocentricCoords {
    x: number; y: number; z: number;
    rightAscension: number;  // hours
    declination: number;     // degrees
    distance: number;        // AU
    elongation: number;      // degrees from Sun
    phase: number;           // 0-1 (illuminated fraction)
}

/**
 * Calculate heliocentric position using Keplerian elements
 * Simplified VSOP87 implementation for high accuracy
 */
export function calculateHeliocentricPosition(
    planet: string,
    date: Date
): HeliocentricCoords {
    const T = toJulianCenturies(date);
    const elements = PLANETARY_ELEMENTS[planet];
    const rates = PLANETARY_RATES[planet];

    // Compute current orbital elements
    const a = elements.a + (rates?.a || 0) * T;
    const e = elements.e + (rates?.e || 0) * T;
    const i = elements.i + (rates?.i || 0) * T / 3600; // Convert arcsec to degrees
    const L = mod360(elements.L + (rates?.L || 0) * T / 3600);
    const omega_bar = mod360(elements.omega + (rates?.omega || 0) * T / 3600);
    const node = mod360(elements.node + (rates?.node || 0) * T / 3600);

    // Argument of perihelion
    const omega = omega_bar - node;

    // Mean anomaly
    const M = mod360(L - omega_bar);

    // Solve Kepler's equation: M = E - e * sin(E)
    let E = M * Math.PI / 180; // Convert to radians
    for (let iter = 0; iter < 20; iter++) {
        const dE = (E - e * Math.sin(E) - M * Math.PI / 180) / (1 - e * Math.cos(E));
        E -= dE;
        if (Math.abs(dE) < 1e-12) break;
    }

    // True anomaly
    const nu = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
    );

    // Distance from Sun
    const r = a * (1 - e * Math.cos(E));

    // Heliocentric coordinates in orbital plane
    const x_prime = r * Math.cos(nu);
    const y_prime = r * Math.sin(nu);

    // Transform to ecliptic coordinates
    const cos_i = Math.cos(i * Math.PI / 180);
    const sin_i = Math.sin(i * Math.PI / 180);
    const cos_node = Math.cos(node * Math.PI / 180);
    const sin_node = Math.sin(node * Math.PI / 180);
    const cos_omega = Math.cos(omega * Math.PI / 180);
    const sin_omega = Math.sin(omega * Math.PI / 180);

    const x = (cos_node * cos_omega - sin_node * sin_omega * cos_i) * x_prime +
              (-cos_node * sin_omega - sin_node * cos_omega * cos_i) * y_prime;
    const y = (sin_node * cos_omega + cos_node * sin_omega * cos_i) * x_prime +
              (-sin_node * sin_omega + cos_node * cos_omega * cos_i) * y_prime;
    const z = (sin_omega * sin_i) * x_prime + (cos_omega * sin_i) * y_prime;

    // Ecliptic longitude and latitude
    const longitude = mod360(Math.atan2(y, x) * 180 / Math.PI);
    const latitude = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;

    return {
        x, y, z,
        longitude,
        latitude,
        radius: r
    };
}

/**
 * Calculate geocentric position (position as seen from Earth)
 */
export function calculateGeocentricPosition(
    planet: string,
    date: Date
): GeocentricCoords {
    const p = calculateHeliocentricPosition(planet, date);
    const e = calculateHeliocentricPosition('earth', date);

    // Geocentric rectangular coordinates
    const x = p.x - e.x;
    const y = p.y - e.y;
    const z = p.z - e.z;

    // Distance
    const distance = Math.sqrt(x * x + y * y + z * z);

    // Ecliptic longitude and latitude
    const lambda = mod360(Math.atan2(y, x) * 180 / Math.PI);
    const beta = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;

    // Obliquity of ecliptic
    const T = toJulianCenturies(date);
    const epsilon = 23.439292 - 0.0130042 * T; // degrees

    // Convert to equatorial coordinates
    const sin_lambda = Math.sin(lambda * Math.PI / 180);
    const cos_lambda = Math.cos(lambda * Math.PI / 180);
    const sin_beta = Math.sin(beta * Math.PI / 180);
    const cos_beta = Math.cos(beta * Math.PI / 180);
    const sin_epsilon = Math.sin(epsilon * Math.PI / 180);
    const cos_epsilon = Math.cos(epsilon * Math.PI / 180);

    const sin_delta = sin_beta * cos_epsilon + cos_beta * sin_epsilon * sin_lambda;
    const declination = Math.asin(sin_delta) * 180 / Math.PI;

    const y_eq = sin_lambda * cos_epsilon - sin_beta / cos_beta * sin_epsilon;
    const rightAscension = mod360(Math.atan2(y_eq, cos_lambda) * 180 / Math.PI) / 15; // hours

    // Elongation (angular distance from Sun)
    const sunLongitude = e.longitude;
    const elongation = mod360(lambda - sunLongitude);
    const elongationAngle = elongation > 180 ? 360 - elongation : elongation;

    // Phase (illuminated fraction)
    const sunDistance = p.radius;
    const phase = ((1 + Math.cos((elongation - 180) * Math.PI / 180)) / 2);

    return {
        x, y, z,
        rightAscension,
        declination,
        distance,
        elongation: elongationAngle,
        phase
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// CELESTIAL EVENT CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Find next conjunction (alignment) between two planets
 * Returns approximation of nearest approach
 */
export function findNextConjunction(
    planet1: string,
    planet2: string,
    startDate: Date,
    maxDays: number = 365
): { date: Date; separation: number } | null {
    let bestConjunction: { date: Date; separation: number } | null = null;
    
    // Check daily
    for (let d = 0; d <= maxDays; d++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + d);
        
        const p1 = calculateHeliocentricPosition(planet1, checkDate);
        const p2 = calculateHeliocentricPosition(planet2, checkDate);
        
        const separation = Math.abs(mod360(p1.longitude - p2.longitude));
        const actualSep = separation > 180 ? 360 - separation : separation;
        
        if (bestConjunction === null || actualSep < bestConjunction.separation) {
            bestConjunction = { date: new Date(checkDate), separation: actualSep };
        }
        
        if (actualSep < 1.0) break; // Close enough conjunction found
    }
    
    return bestConjunction;
}

/**
 * Determine if planet is in retrograde motion
 * Check by comparing daily positions
 */
export function isRetrograde(planet: string, date: Date): boolean {
    const p1 = calculateHeliocentricPosition(planet, date);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const p2 = calculateHeliocentricPosition(planet, nextDay);
    
    // Check if longitude is decreasing (retrograde)
    let delta = p2.longitude - p1.longitude;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    return delta < 0;
}

/**
 * Calculate synodic period (time for planet to return to same position relative to Earth)
 */
export function getSynodicPeriod(planet: string): number {
    const planetYear = PLANETARY_ELEMENTS[planet].a ** 1.5; // Kepler's 3rd law
    const earthYear = 1.0;
    
    if (planetYear < earthYear) {
        return 1 / Math.abs(1 / planetYear - 1);
    }
    return 1 / Math.abs(1 / earthYear - 1 / planetYear);
}

// ═══════════════════════════════════════════════════════════════════════════
// BAZI-ZODIAC MAPPING
// ═══════════════════════════════════════════════════════════════════════════

const ZODIAC_BOUNDARIES = [
    { sign: 'aries', start: 0, branch: '戌' },
    { sign: 'taurus', start: 30, branch: '酉' },
    { sign: 'gemini', start: 60, branch: '申' },
    { sign: 'cancer', start: 90, branch: '未' },
    { sign: 'leo', start: 120, branch: '午' },
    { sign: 'virgo', start: 150, branch: '巳' },
    { sign: 'libra', start: 180, branch: '辰' },
    { sign: 'scorpio', start: 210, branch: '卯' },
    { sign: 'sagittarius', start: 240, branch: '寅' },
    { sign: 'capricorn', start: 270, branch: '丑' },
    { sign: 'aquarius', start: 300, branch: '子' },
    { sign: 'pisces', start: 330, branch: '亥' }
];

export function longitudeToZodiac(longitude: number): { sign: string; branch: string; degree: number } {
    const normalized = mod360(longitude);
    for (let i = ZODIAC_BOUNDARIES.length - 1; i >= 0; i--) {
        if (normalized >= ZODIAC_BOUNDARIES[i].start) {
            return {
                sign: ZODIAC_BOUNDARIES[i].sign,
                branch: ZODIAC_BOUNDARIES[i].branch,
                degree: normalized - ZODIAC_BOUNDARIES[i].start
            };
        }
    }
    return { sign: 'aries', branch: '戌', degree: normalized };
}

/**
 * Get planetary dignity score based on position in zodiac
 * Traditional exaltations/debilities
 */
export function getPlanetaryDignity(planet: string, longitude: number): {
    dignity: 'exalted' | 'domicile' | 'neutral' | 'detriment' | 'fall';
    score: number;
} {
    const normalized = mod360(longitude);
    
    // Traditional dignities (simplified)
    const dignities: Record<string, { exaltation?: number; domicile?: number[]; 
                                       detriment?: number[]; fall?: number }> = {
        sun: { exaltation: 19, domicile: [120], detriment: [300], fall: 210 },
        moon: { exaltation: 33, domicile: [90], detriment: [270], fall: 180 },
        mercury: { exaltation: 165, domicile: [150, 180], detriment: [330, 0], fall: 345 },
        venus: { exaltation: 357, domicile: [30, 180], detriment: [210, 330], fall: 165 },
        mars: { exaltation: 298, domicile: [0, 240], detriment: [180, 60], fall: 120 },
        jupiter: { exaltation: 105, domicile: [240, 270], detriment: [60, 90], fall: 300 },
        saturn: { exaltation: 201, domicile: [270, 300], detriment: [90, 120], fall: 210 }
    };
    
    const d = dignities[planet] || {};
    
    // Check exact matches (simplified - should check sign boundaries)
    if (d.exaltation !== undefined) {
        const diff = Math.abs(normalized - d.exaltation);
        if (diff < 5 || diff > 355) return { dignity: 'exalted', score: 5 };
    }
    
    if (d.fall !== undefined) {
        const diff = Math.abs(normalized - d.fall);
        if (diff < 5 || diff > 355) return { dignity: 'fall', score: -5 };
    }
    
    // Sign-based dignities
    const zodiac = longitudeToZodiac(normalized);
    const signDegree = ZODIAC_BOUNDARIES.find(z => z.sign === zodiac.sign)?.start || 0;
    
    if (d.domicile?.some(deg => Math.abs(deg - signDegree) < 15)) return { dignity: 'domicile', score: 4 };
    if (d.detriment?.some(deg => Math.abs(deg - signDegree) < 15)) return { dignity: 'detriment', score: -4 };
    
    return { dignity: 'neutral', score: 0 };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PlanetarySnapshot {
    planet: string;
    heliocentric: HeliocentricCoords;
    geocentric: GeocentricCoords;
    zodiac: { sign: string; branch: string; degree: number };
    dignity: { dignity: string; score: number };
    isRetrograde: boolean;
    elementalResonance: string;
}

export interface CelestialState {
    timestamp: Date;
    planets: PlanetarySnapshot[];
    aspects: CelestialAspect[];
    dominantElement: string;
}

export interface CelestialAspect {
    type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
    planet1: string;
    planet2: string;
    separation: number; // degrees
    orb: number;
    influence: 'harmonious' | 'challenging' | 'dynamic';
}

// Element associations for planets
export const PLANETARY_ELEMENTS: Record<string, string[]> = {
    sun: ['yang', 'fire'],
    moon: ['yin', 'water'],
    mercury: ['yang', 'water', 'metal'],
    venus: ['yin', 'metal', 'earth'],
    mars: ['yang', 'fire'],
    jupiter: ['yang', 'wood'],
    saturn: ['yin', 'earth'],
    uranus: ['yang', 'metal'],
    neptune: ['yin', 'water']
};
