// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MATHEMATICAL ASTRONOMY UTILITIES                                          ║
// ║  Orbital resonances, conjunctions, retrogrades, and astrophysical math     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Kairos Mathematical Astronomy
 * 
 * Advanced astronomical calculations including:
 * - Orbital resonance and commensurability
 * - Planetary conjunction algorithms
 * - Retrograde motion detection
 * - Precession and nutation
 * - Eclipse predictions
 */

import { dateToJulianDate, toJulianCenturies, mod360, toRadians, toDegrees } from './time';
import { calculateHeliocentricPosition, calculateGeocentricPosition, isRetrograde } from './ephemeris';

// ═══════════════════════════════════════════════════════════════════════════
// ORBITAL RESONANCE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export interface ResonancePattern {
    planets: [string, string];
    ratio: [number, number];
    periodYears: number;      // Return period
    exactness: number;        // How close to perfect ratio (0-1)
    currentPhase: number;     // 0-1 position in cycle
    nextAlignment: Date;      // Next opposition/conjunction
}

/**
 * Calculate mean orbital period in Earth years
 */
function getOrbitalPeriod(planet: string): number {
    const periods: Record<string, number> = {
        mercury: 0.240846,
        venus: 0.615198,
        earth: 1.0,
        mars: 1.880815,
        jupiter: 11.862615,
        saturn: 29.447498,
        uranus: 84.016846,
        neptune: 164.79132
    };
    return periods[planet.toLowerCase()] || 1.0;
}

/**
 * Find orbital resonance between two planets
 * Returns simplified ratio (e.g., 2:3 for 3:2 resonance)
 */
export function findOrbitalResonance(planet1: string, planet2: string): ResonancePattern | null {
    const p1 = getOrbitalPeriod(planet1);
    const p2 = getOrbitalPeriod(planet2);
    
    // Find best rational approximation
    let bestNum = 1, bestDen = 1;
    let bestError = Infinity;
    
    for (let den = 1; den <= 20; den++) {
        const num = Math.round(p1 / p2 * den);
        if (num <= 0) continue;
        
        const actualRatio = num / den;
        const targetRatio = p1 / p2;
        const error = Math.abs(actualRatio - targetRatio) / targetRatio;
        
        if (error < bestError) {
            bestNum = num;
            bestDen = den;
            bestError = error;
        }
    }
    
    // Only return if reasonably close
    if (bestError > 0.05) return null;
    
    // Simplify ratio
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(bestNum, bestDen);
    
    const simplifiedNum = bestNum / divisor;
    const simplifiedDen = bestDen / divisor;
    
    // Calculate return period
    const returnPeriod = simplifiedNum * p1; // Years
    
    return {
        planets: [planet1, planet2],
        ratio: [simplifiedNum, simplifiedDen],
        periodYears: returnPeriod,
        exactness: 1 - bestError,
        currentPhase: 0, // Would need ephemeris
        nextAlignment: new Date() // Placeholder
    };
}

/**
 * Find all resonant relationships in the solar system
 */
export function findAllResonances(): ResonancePattern[] {
    const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const resonances: ResonancePattern[] = [];
    
    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const resonance = findOrbitalResonance(planets[i], planets[j]);
            if (resonance) {
                resonances.push(resonance);
            }
        }
    }
    
    return resonances.sort((a, b) => b.exactness - a.exactness);
}

/**
 * Calculate Jupiter-Saturn Great Conjunction cycle
 * The most significant conjunction in traditional astrology
 */
export function calculateGreatConjunction(
    startDate: Date = new Date(),
    count: number = 3
): Array<{
    date: Date;
    longitude: number;
    sign: string;
    elementShift: 'same' | 'triangular' | 'mutation';
}> {
    const results: ReturnType<typeof calculateGreatConjunction> = [];
    let searchDate = new Date(startDate);
    
    // Great conjunction approx every 19.85 years
    // Full cycle through zodiac: ~238 years (12 conjunctions)
    // Element shift every ~60 years
    
    for (let i = 0; i < count; i++) {
        // Search for conjunction (simplified)
        let bestSeparation = 360;
        let conjunctionDate = new Date(searchDate);
        
        for (let days = 0; days < 730; days++) {
            const checkDate = new Date(searchDate);
            checkDate.setDate(checkDate.getDate() + days);
            
            const pos1 = calculateHeliocentricPosition('jupiter', checkDate);
            const pos2 = calculateHeliocentricPosition('saturn', checkDate);
            
            const separation = Math.abs(mod360(pos1.longitude - pos2.longitude));
            const actualSep = separation > 180 ? 360 - separation : separation;
            
            if (actualSep < bestSeparation) {
                bestSeparation = actualSep;
                conjunctionDate = new Date(checkDate);
            }
            
            if (actualSep < 1) break;
        }
        
        const jupiterPos = calculateHeliocentricPosition('jupiter', conjunctionDate);
        const longitude = mod360(jupiterPos.longitude + 180); // Opposition point
        const signIndex = Math.floor(longitude / 30);
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                       'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        const sign = signs[signIndex];
        
        // Element of sign
        const elements: Record<number, string> = {
            0: 'fire', 1: 'earth', 2: 'air', 3: 'water',
            4: 'fire', 5: 'earth', 6: 'air', 7: 'water',
            8: 'fire', 9: 'earth', 10: 'air', 11: 'water'
        };
        
        // Previous conjunction for element comparison
        const prevElement = results.length > 0 
            ? elements[Math.floor(results[results.length - 1].longitude / 30)] 
            : null;
        const currElement = elements[signIndex];
        
        let elementShift: 'same' | 'triangular' | 'mutation' = 'same';
        if (prevElement) {
            if (prevElement === currElement) elementShift = 'same';
            else if (
                (prevElement === 'fire' && currElement === 'air') ||
                (prevElement === 'air' && currElement === 'fire') ||
                (prevElement === 'earth' && currElement === 'water') ||
                (prevElement === 'water' && currElement === 'earth')
            ) {
                elementShift = 'triangular';
            } else {
                elementShift = 'mutation';
            }
        }
        
        results.push({
            date: new Date(conjunctionDate),
            longitude,
            sign,
            elementShift
        });
        
        // Advance search date
        searchDate = new Date(conjunctionDate);
        searchDate.setFullYear(searchDate.getFullYear() + 19);
    }
    
    return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// RETROGRADE MOTION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export interface RetrogradePeriod {
    planet: string;
    start: Date;
    end: Date;
    durationDays: number;
    shadowPeriodPre: Date;    // Pre-retrograde shadow
    shadowPeriodPost: Date;   // Post-retrograde shadow
    zodiacSign: string;
    elementalTheme: string;
}

/**
 * Calculate retrograde periods for a planet
 * Simplified using orbital mechanics approximation
 */
export function calculateRetrogradePeriods(
    planet: string,
    year: number = new Date().getFullYear()
): RetrogradePeriod[] {
    const periods: RetrogradePeriod[] = [];
    
    // Approximate retrograde frequency by planet
    const retrogradeData: Record<string, { frequency: number; duration: number }> = {
        mercury: { frequency: 3, duration: 24 },
        venus: { frequency: 1, duration: 42 },
        mars: { frequency: 1, duration: 72 },
        jupiter: { frequency: 1, duration: 120 },
        saturn: { frequency: 1, duration: 138 },
        uranus: { frequency: 1, duration: 155 },
        neptune: { frequency: 1, duration: 160 }
    };
    
    const data = retrogradeData[planet.toLowerCase()];
    if (!data) return periods;
    
    // Generate approximate dates
    for (let i = 0; i < data.frequency; i++) {
        // Very rough approximation
        const startMonth = planet === 'mercury' ? [1, 5, 9][i] : 
                          planet === 'venus' ? 7 :
                          planet === 'mars' ? 11 : 6;
        
        const startDate = new Date(year, startMonth, 15);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + data.duration);
        
        const shadowPre = new Date(startDate);
        shadowPre.setDate(shadowPre.getDate() - Math.floor(data.duration / 3));
        
        const shadowPost = new Date(endDate);
        shadowPost.setDate(shadowPost.getDate() + Math.floor(data.duration / 3));
        
        // Get zodiac sign
        const pos = calculateGeocentricPosition(planet, startDate);
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                       'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        const sign = signs[Math.floor(pos.rightAscension * 15 / 30) % 12];
        
        // Map to Chinese elements
        const elementMap: Record<string, string> = {
            'aries': 'wood', 'leo': 'fire', 'sagittarius': 'fire',
            'taurus': 'earth', 'virgo': 'earth', 'capricorn': 'earth',
            'gemini': 'metal', 'libra': 'metal', 'aquarius': 'metal',
            'cancer': 'water', 'scorpio': 'water', 'pisces': 'water'
        };
        
        periods.push({
            planet,
            start: startDate,
            end: endDate,
            durationDays: data.duration,
            shadowPeriodPre: shadowPre,
            shadowPeriodPost: shadowPost,
            zodiacSign: sign,
            elementalTheme: elementMap[sign] || 'earth'
        });
    }
    
    return periods;
}

// ═══════════════════════════════════════════════════════════════════════════
// ECLIPSE PREDICTION
// ═══════════════════════════════════════════════════════════════════════════

export interface Eclipse {
    type: 'solar_total' | 'solar_partial' | 'solar_annular' | 'lunar_total' | 'lunar_partial';
    date: Date;
    magnitude: number;     // 0-1 (coverage)
    sarosSeries: number;   // Saros cycle number
    visibility: string[];   // Regions where visible
    sarosDescription: string;
}

/**
 * Calculate Saros series for an eclipse
 * Saros cycle = 223 synodic months ≈ 18 years 11 days
 */
function calculateSarosNumber(jde: number): { series: number; member: number } {
    // Simplified Saros calculation
    // Reference: Saros series 1 started ~June 2870 BCE
    const sarosStart = -1045528.5; // Approximate Julian Day
    const sarosPeriod = 6585.32; // days (223 synodic months)
    
    const diff = jde - sarosStart;
    const series = Math.floor(diff / sarosPeriod) % 38;
    const member = Math.floor((diff % sarosPeriod) / sarosPeriod * 70);
    
    return { series: series + 1, member };
}

/**
 * Predict upcoming lunar phases and eclipses
 */
export function calculateLunarPhases(
    startDate: Date = new Date(),
    months: number = 12
): Array<{
    date: Date;
    phase: 'new' | 'first_quarter' | 'full' | 'last_quarter';
    isEclipse: boolean;
    eclipseType?: string;
}> {
    const phases: ReturnType<typeof calculateLunarPhases> = [];
    
    // Synodic month = 29.53059 days
    const synodicMonth = 29.53059;
    
    // Reference new moon: January 6, 2000 18:14 UTC (JDE 2451549.2596)
    const k = Math.floor((dateToJulianDate(startDate) - 2451549.2596) / synodicMonth);
    
    for (let i = 0; i < months * 4; i++) {
        const newMoonJDE = 2451549.2596 + (k + i) * synodicMonth;
        const newMoonDate = new Date(newMoonJDE * 86400000 + Date.UTC(1970, 0, 1, -12));
        
        // Calculate phase for each quarter
        for (let q = 0; q < 4; q++) {
            const phaseDate = new Date(newMoonDate);
            phaseDate.setTime(phaseDate.getTime() + q * synodicMonth / 4 * 86400000);
            
            const phase: 'new' | 'first_quarter' | 'full' | 'last_quarter' = 
                q === 0 ? 'new' : 
                q === 1 ? 'first_quarter' : 
                q === 2 ? 'full' : 'last_quarter';
            
            // Check for eclipse conditions
            // Eclipse when Moon near node (approx every 6 months)
            const isEclipse = (phase === 'new' || phase === 'full') && i % 6 === 0;
            
            phases.push({
                date: phaseDate,
                phase,
                isEclipse,
                eclipseType: isEclipse 
                    ? (phase === 'new' ? 'solar' : 'lunar')
                    : undefined
            });
        }
    }
    
    return phases.filter(p => p.date >= startDate);
}

// ═══════════════════════════════════════════════════════════════════════════
// BAZI-ASTRONOMY SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

export interface CelestialBaziSynthesis {
    date: Date;
    dayPillar: { stem: string; branch: string };
    solarTerm: { name: string; progress: number };
    planetaryInfluences: Array<{
        planet: string;
        zodiacSign: string;
        phase: string;
        dignity: number;
    }>;
    cosmicWeather: {
        dominantElement: string;
        energeticQuality: 'expansive' | 'contractive' | 'active' | 'receptive';
        resonance: number; // 0-1 alignment with day
    };
}

/**
 * Map planetary positions to zodiac
 */
export function mapZodiacPosition(longitude: number): {
    sign: string;
    chineseBranch: string;
    element: string;
    degree: number;
} {
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    
    const zodiacSigns = [
        { sign: 'aries', branch: '戌', element: 'wood' },
        { sign: 'taurus', branch: '酉', element: 'metal' },
        { sign: 'gemini', branch: '申', element: 'metal' },
        { sign: 'cancer', branch: '未', element: 'earth' },
        { sign: 'leo', branch: '午', element: 'fire' },
        { sign: 'virgo', branch: '巳', element: 'fire' },
        { sign: 'libra', branch: '辰', element: 'earth' },
        { sign: 'scorpio', branch: '卯', element: 'wood' },
        { sign: 'sagittarius', branch: '寅', element: 'wood' },
        { sign: 'capricorn', branch: '丑', element: 'earth' },
        { sign: 'aquarius', branch: '子', element: 'water' },
        { sign: 'pisces', branch: '亥', element: 'water' }
    ];
    
    const z = zodiacSigns[signIndex];
    return { ...z, degree };
}

/**
 * Calculate Five Phase strength from planetary positions
 */
export function calculateCosmicElementBalance(date: Date): Record<string, number> {
    const elements: Record<string, number> = {
        wood: 0, fire: 0, earth: 0, metal: 0, water: 0
    };
    
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 
                     'jupiter', 'saturn', 'uranus', 'neptune'];
    
    for (const planet of planets) {
        const pos = calculateHeliocentricPosition(planet, date);
        const zodiac = mapZodiacPosition(pos.longitude);
        
        // Weight by closeness to Earth for geocentric view
        let weight = 1;
        if (planet === 'sun') weight = 3;
        if (planet === 'moon') weight = 2.5;
        if (['mercury', 'venus', 'mars'].includes(planet)) weight = 2;
        
        elements[zodiac.element] += weight;
    }
    
    // Normalize
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    Object.keys(elements).forEach(k => elements[k] /= total);
    
    return elements;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNODIC CYCLE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate planetary synodic cycles relative to Earth
 */
export function calculateSynodicCycles(): Record<string, {
    period: number;      // days
    cycleName: string;
    significance: string;
}> {
    const earthPeriod = 365.256;
    const periods: Record<string, number> = {
        mercury: 87.969,
        venus: 224.701,
        mars: 686.98,
        jupiter: 4332.589,
        saturn: 10759.22,
        uranus: 30685.4,
        neptune: 60189
    };
    
    const result: ReturnType<typeof calculateSynodicCycles> = {};
    
    for (const [planet, period] of Object.entries(periods)) {
        const synodic = earthPeriod * period / Math.abs(period - earthPeriod);
        
        result[planet] = {
            period: synodic,
            cycleName: `${planet.charAt(0).toUpperCase() + planet.slice(1)} cycle`,
            significance: getCycleSignificance(planet, synodic)
        };
    }
    
    return result;
}

function getCycleSignificance(planet: string, period: number): string {
    if (period < 200) return 'Short-term personal cycles';
    if (period < 500) return 'Medium-term relationship themes';
    if (period < 5000) return 'Long-term generational patterns';
    return 'Epochal transformation periods';
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC ASPECTS
// ═══════════════════════════════════════════════════════════════════════════

export interface PlanetaryAspect {
    planet1: string;
    planet2: string;
    aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
    angle: number;
    orb: number;
    applying: boolean;
    exactTime?: Date;
}

const ASPECT_ANGLES: Record<string, number> = {
    conjunction: 0,
    sextile: 60,
    square: 90,
    trine: 120,
    opposition: 180
};

const ASPECT_ORBS: Record<string, number> = {
    conjunction: 8,
    sextile: 6,
    square: 8,
    trine: 8,
    opposition: 8
};

/**
 * Calculate aspects between planets at a given time
 */
export function calculateAspects(
    date: Date,
    planetList: string[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 
                            'jupiter', 'saturn', 'uranus', 'neptune']
): PlanetaryAspect[] {
    const aspects: PlanetaryAspect[] = [];
    const positions = new Map<string, number>();
    
    // Get positions
    for (const planet of planetList) {
        if (planet === 'sun' || planet === 'moon') continue; // Skip if using simplified ephemeris
        const pos = calculateHeliocentricPosition(planet, date);
        positions.set(planet, pos.longitude);
    }
    
    // Calculate aspects between all pairs
    const planetArray = Array.from(positions.keys());
    for (let i = 0; i < planetArray.length; i++) {
        for (let j = i + 1; j < planetArray.length; j++) {
            const p1 = planetArray[i];
            const p2 = planetArray[j];
            const lon1 = positions.get(p1)!;
            const lon2 = positions.get(p2)!;
            
            // Find closest aspect
            let separation = Math.abs(lon1 - lon2);
            if (separation > 180) separation = 360 - separation;
            
            for (const [aspectName, angle] of Object.entries(ASPECT_ANGLES)) {
                const orb = Math.abs(separation - angle);
                if (orb <= ASPECT_ORBS[aspectName]) {
                    // Check if applying or separating
                    const dayLater = new Date(date);
                    dayLater.setDate(dayLater.getDate() + 1);
                    const pos1 = calculateHeliocentricPosition(p1, dayLater);
                    const pos2 = calculateHeliocentricPosition(p2, dayLater);
                    let newSep = Math.abs(pos1.longitude - pos2.longitude);
                    if (newSep > 180) newSep = 360 - newSep;
                    const applying = newSep < separation;
                    
                    aspects.push({
                        planet1: p1,
                        planet2: p2,
                        aspect: aspectName as PlanetaryAspect['aspect'],
                        angle: separation,
                        orb,
                        applying
                    });
                }
            }
        }
    }
    
    return aspects.sort((a, b) => a.orb - b.orb);
}

// ═══════════════════════════════════════════════════════════════════════════
// PRECESSION AND NUTATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Earth's axial precession (Platonic year)
 * Full cycle = ~25,772 years
 */
export function calculatePrecession(date: Date): {
    precessionAngle: number;   // Degrees since J2000
    equinoxShift: number;      // Shift in equinox position
    platonicProgress: number;  // 0-1 through full cycle
} {
    const T = toJulianCenturies(date);
    
    // Laskar's formula for precession
    const precessionRate = 360 / 25772; // degrees per year
    const precessionAngle = T * 100 * precessionRate;
    
    // Current position of vernal equinox
    const equinoxShift = precessionAngle;
    
    // Progress through Platonic year
    const platonicProgress = (precessionAngle % 360) / 360;
    
    return {
        precessionAngle,
        equinoxShift,
        platonicProgress
    };
}

/**
 * Calculate nutation (nodding of Earth's axis)
 * ~18.6 year cycle
 */
export function calculateNutation(date: Date): {
    nutationLongitude: number;  // arcseconds
    nutationObliquity: number;  // arcseconds
    moonNodePosition: number;   // 0-360
} {
    const T = toJulianCenturies(date);
    
    // Mean longitude of ascending node of Moon's orbit
    const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + 
                  T * T * T / 450000;
    
    // Simplified nutation formula
    const nutationLon = -17.20 * Math.sin(toRadians(omega)) - 
                         1.32 * Math.sin(2 * toRadians(125.0 - 2.1 * T)) -
                         0.23 * Math.sin(2 * toRadians(125.0));
    
    const nutationObl = 9.20 * Math.cos(toRadians(omega)) + 
                        0.57 * Math.cos(2 * toRadians(125.0));
    
    return {
        nutationLongitude: nutationLon,
        nutationObliquity: nutationObl,
        moonNodePosition: mod360(omega)
    };
}