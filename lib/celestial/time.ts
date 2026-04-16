// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  TEMPORAL MATHEMATICS & TIME GEOMETRY                                     ║
// ║  Julian dates, time scales, and spacetime calculations                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Kairos Temporal Mathematics
 * 
 * Provides fundamental time calculations including:
 * - Julian Day Number conversions
 * - Julian Centuries for planetary calculations
 * - Sidereal time calculations
 * - Delta T (TT-UT) corrections
 * - Geocentric coordinate transformations
 */

// ═══════════════════════════════════════════════════════════════════════════
// JULIAN DATE CONVERSIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert Gregorian date to Julian Day Number (JDN)
 * Algorithm from Meeus, Astronomical Algorithms
 * Valid for all Gregorian calendar dates
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 365 * y 
           + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Convert Julian Day Number back to Gregorian date
 */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
    const L = jdn + 68569;
    const N = Math.floor((4 * L) / 146097);
    const L2 = L - Math.floor((146097 * N + 3) / 4);
    const I = Math.floor((4000 * (L2 + 1)) / 1461001);
    const L3 = L2 - Math.floor((1461 * I) / 4) + 31;
    const J = Math.floor((80 * L3) / 2447);
    const day = L3 - Math.floor((2447 * J) / 80);
    const L4 = Math.floor(J / 11);
    const month = J + 2 - 12 * L4;
    const year = 100 * (N - 49) + I + L4;
    
    return { year, month, day };
}

/**
 * Convert JavaScript Date to Julian Date (including fractional day)
 * JD includes time of day as fractional part
 */
export function dateToJulianDate(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    
    const jdn = gregorianToJDN(year, month, day);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const ms = date.getUTCMilliseconds();
    
    // Fraction of day (0.5 = noon, 0.0 = midnight)
    const fraction = (hour - 12 + minute / 60 + second / 3600 + ms / 3600000) / 24;
    
    return jdn + fraction;
}

/**
 * Convert Julian Date back to JavaScript Date (UTC)
 */
export function julianDateToDate(jd: number): Date {
    const jdn = Math.floor(jd + 0.5);
    const fraction = jd - jdn + 0.5;
    
    const { year, month, day } = jdnToGregorian(jdn);
    
    // Convert fraction to time
    const totalHours = fraction * 24;
    const hours = Math.floor(totalHours);
    const totalMinutes = (totalHours - hours) * 60;
    const minutes = Math.floor(totalMinutes);
    const totalSeconds = (totalMinutes - minutes) * 60;
    const seconds = Math.floor(totalSeconds);
    const milliseconds = Math.round((totalSeconds - seconds) * 1000);
    
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds));
}

// J2000 epoch in Julian Days (January 1, 2000, 12:00 TT)
export const J2000 = 2451545.0;

/**
 * Calculate Julian Centuries from J2000.0
 * T is used in VSOP87 and other modern ephemeris calculations
 */
export function toJulianCenturies(date: Date): number {
    const jd = dateToJulianDate(date);
    return (jd - J2000) / 36525.0;
}

/**
 * Convert Julian Centuries back to Date
 */
export function fromJulianCenturies(T: number): Date {
    const jd = J2000 + T * 36525.0;
    return julianDateToDate(jd);
}

// ═══════════════════════════════════════════════════════════════════════════
// SEXAGENARY CYCLE (六十甲子) CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export interface SexagenaryPillar {
    stem: string;
    branch: string;
    index: number; // 0-59
    stemElement: string;
    branchElement: string;
    stemYinYang: 'yang' | 'yin';
    branchYinYang: 'yang' | 'yin';
}

// Element mappings
const STEM_ELEMENTS: Record<string, string> = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water'
};

const BRANCH_ELEMENTS: Record<string, string> = {
    '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
    '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
    '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water'
};

/**
 * Calculate Day Pillar from Julian Day Number
 * The most reliable method: dayIndex = (JDN - 11) % 60
 * Index 0 = 甲子, 1 = 乙丑, etc.
 */
export function calculateDayPillar(jdn: number): SexagenaryPillar {
    const dayIndex = ((jdn - 11) % 60 + 60) % 60; // Ensure positive
    
    const stemIndex = dayIndex % 10;
    const branchIndex = dayIndex % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    return {
        stem,
        branch,
        index: dayIndex,
        stemElement: STEM_ELEMENTS[stem],
        branchElement: BRANCH_ELEMENTS[branch],
        stemYinYang: stemIndex % 2 === 0 ? 'yang' : 'yin',
        branchYinYang: branchIndex % 2 === 0 ? 'yang' : 'yin'
    };
}

/**
 * Calculate Year Pillar (accounts for Li Chun solar term)
 * Year changes at Li Chun (approx Feb 4), not Jan 1
 */
export function calculateYearPillar(date: Date): SexagenaryPillar {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Li Chun typically occurs around Feb 4
    // Before Li Chun, we're still in previous Chinese year
    const isBeforeLiChun = month < 2 || (month === 2 && day < 4);
    const effectiveYear = isBeforeLiChun ? year - 1 : year;
    
    const yearIndex = ((effectiveYear - 4) % 60 + 60) % 60;
    
    const stemIndex = yearIndex % 10;
    const branchIndex = yearIndex % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    return {
        stem,
        branch,
        index: yearIndex,
        stemElement: STEM_ELEMENTS[stem],
        branchElement: BRANCH_ELEMENTS[branch],
        stemYinYang: stemIndex % 2 === 0 ? 'yang' : 'yin',
        branchYinYang: branchIndex % 2 === 0 ? 'yang' : 'yin'
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGONOMETRIC UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalize angle to 0-360 range
 */
export function mod360(angle: number): number {
    let result = angle % 360;
    if (result < 0) result += 360;
    return result;
}

/**
 * Calculate angular difference (shortest path)
 */
export function angularDifference(angle1: number, angle2: number): number {
    let diff = mod360(angle1) - mod360(angle2);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERPOLATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Cubic interpolation for smoother curves
 */
export function cubicInterpolation(
    y0: number, 
    y1: number, 
    y2: number, 
    y3: number, 
    t: number
): number {
    const a0 = y3 - y2 - y0 + y1;
    const a1 = y0 - y1 - a0;
    const a2 = y2 - y0;
    const a3 = y1;
    
    return a0 * t * t * t + a1 * t * t + a2 * t + a3;
}

/**
 * Newton-Raphson root finding
 */
export function findRoot(
    f: (x: number) => number,
    df: (x: number) => number,
    initialGuess: number,
    epsilon: number = 1e-10,
    maxIterations: number = 100
): number {
    let x = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
        const fx = f(x);
        if (Math.abs(fx) < epsilon) return x;
        const dfx = df(x);
        if (Math.abs(dfx) < epsilon) throw new Error('Derivative too small');
        x = x - fx / dfx;
    }
    throw new Error('Failed to converge');
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME SCALE CONVERSIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Delta T approximation: difference between Terrestrial Time (TT) and
 * Universal Time (UT1) in seconds
 * Simplified formula valid for 1900-2100
 */
export function deltaT(date: Date): number {
    const year = date.getUTCFullYear() + date.getUTCMonth() / 12;
    
    if (year < 1955) {
        return 0; // Simplified - full table needed for accuracy
    } else if (year < 1975) {
        return 45;
    } else if (year < 2005) {
        return 65;
    } else if (year < 2050) {
        // Current trend: +0.5 seconds per year roughly
        return 65 + (year - 2005) * 0.5;
    }
    return 90;
}

/**
 * Convert UTC to Terrestrial Time (approximate)
 * TT = UTC + ΔT + 32.184s (leap seconds + TT-TAI offset)
 */
export function utcToTT(date: Date): Date {
    const dt = deltaT(date);
    return new Date(date.getTime() + (dt + 32.184) * 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface SphericalCoords {
    longitude: number;  // degrees
    latitude: number; // degrees
    radius: number;   // any unit
}

export interface CartesianCoords {
    x: number;
    y: number;
    z: number;
}

/**
 * Convert spherical to Cartesian coordinates
 */
export function sphericalToCartesian(
    lon: number, 
    lat: number, 
    r: number
): CartesianCoords {
    const cosLat = Math.cos(toRadians(lat));
    const sinLat = Math.sin(toRadians(lat));
    const cosLon = Math.cos(toRadians(lon));
    const sinLon = Math.sin(toRadians(lon));
    
    return {
        x: r * cosLat * cosLon,
        y: r * cosLat * sinLon,
        z: r * sinLat
    };
}

/**
 * Convert Cartesian to spherical coordinates
 */
export function cartesianToSpherical(
    x: number, 
    y: number, 
    z: number
): SphericalCoords {
    const r = Math.sqrt(x * x + y * y + z * z);
    const lon = mod360(toDegrees(Math.atan2(y, x)));
    const lat = toDegrees(Math.asin(z / r));
    
    return { longitude: lon, latitude: lat, radius: r };
}

/**
 * Calculate distance between two points on a sphere (haversine formula)
 */
export function sphericalDistance(
    lon1: number, lat1: number,
    lon2: number, lat2: number,
    radius: number = 1
): number {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return radius * c;
}

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE AND PERIOD CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate commensurability (orbital resonance ratio)
 * Returns simplified ratio like [2, 3] for 2:3 resonance
 */
export function orbitalResonance(
    period1: number, 
    period2: number,
    maxDenominator: number = 20
): { ratio: number[]; exactness: number } | null {
    const ratio = period1 / period2;
    
    // Find best rational approximation
    let bestNum = 1;
    let bestDen = 1;
    let bestError = Math.abs(ratio - bestNum / bestDen);
    
    for (let den = 1; den <= maxDenominator; den++) {
        const num = Math.round(ratio * den);
        const error = Math.abs(ratio - num / den);
        if (error < bestError) {
            bestNum = num;
            bestDen = den;
            bestError = error;
        }
    }
    
    // Only return if reasonably close
    if (bestError > 0.05) return null;
    
    return {
        ratio: [bestNum, bestDen],
        exactness: 1 - bestError
    };
}

/**
 * Calculate synodic period from sidereal periods
 */
export function synodicPeriod(period1: number, period2: number): number {
    return 1 / Math.abs(1 / period1 - 1 / period2);
}

/**
 * Calculate return period for a given cycle
 */
export function returnPeriod(
    basePeriod: number, 
    targetAlignment: number = 0,
    tolerance: number = 0.01
): { years: number; occurrences: number } {
    let years = basePeriod;
    let occurrences = 1;
    
    while (Math.abs(years - Math.round(years)) > tolerance) {
        occurrences++;
        years = basePeriod * occurrences;
    }
    
    return { years, occurrences };
}
