// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ADVANCED MATHEMATICAL COMPUTATIONS FOR CELESTIAL PHENOMENA                ║
// ║  Fourier transforms, harmonic analysis, and astronomical calculations    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Kairos Mathematical Core
 * 
 * Advanced mathematical utilities for:
 * - Fourier series analysis of periodic phenomena
 * - Harmonic decomposition of orbital positions
 * - Wavelet analysis for multi-scale patterns
 * - Chaos theory metrics for deterministic systems
 */

// ═══════════════════════════════════════════════════════════════════════════
// FOURIER SERIES ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Discrete Fourier Transform (DFT)
 * Converts time-domain data to frequency-domain representation
 */
export function dft(input: number[]): Array<{ frequency: number; amplitude: number; phase: number }> {
    const N = input.length;
    const output: ReturnType<typeof dft> = [];
    
    for (let k = 0; k < N / 2; k++) {
        let real = 0;
        let imag = 0;
        
        for (let n = 0; n < N; n++) {
            const angle = -2 * Math.PI * k * n / N;
            real += input[n] * Math.cos(angle);
            imag += input[n] * Math.sin(angle);
        }
        
        const amplitude = Math.sqrt(real * real + imag * imag) / N;
        const phase = Math.atan2(imag, real);
        
        output.push({
            frequency: k,
            amplitude: amplitude * 2, // Scale for positive frequencies
            phase
        });
    }
    
    return output;
}

/**
 * Inverse DFT
 */
export function idft(spectrum: Array<{ amplitude: number; phase: number }>): number[] {
    const N = spectrum.length * 2;
    const output: number[] = new Array(N).fill(0);
    
    for (let n = 0; n < N; n++) {
        let sum = 0;
        for (let k = 0; k < spectrum.length; k++) {
            const angle = 2 * Math.PI * k * n / N;
            sum += spectrum[k].amplitude * Math.cos(angle + spectrum[k].phase);
        }
        output[n] = sum;
    }
    
    return output;
}

/**
 * Fast Fourier Transform (Cooley-Tukey algorithm)
 * O(N log N) complexity for power-of-2 lengths
 */
export function fft(input: number[]): Array<{ real: number; imag: number }> {
    const N = input.length;
    
    // Bit-reverse copy
    const output: Array<{ real: number; imag: number }> = input.map(x => ({ real: x, imag: 0 }));
    
    for (let i = 0, j = 0; i < N; i++) {
        if (i < j) {
            [output[i], output[j]] = [output[j], output[i]];
        }
        let bit = N >> 1;
        while (j & bit) {
            j ^= bit;
            bit >>= 1;
        }
        j |= bit;
    }
    
    // FFT butterflies
    for (let len = 2; len <= N; len <<= 1) {
        const angle = -2 * Math.PI / len;
        const wlen = { real: Math.cos(angle), imag: Math.sin(angle) };
        
        for (let i = 0; i < N; i += len) {
            let w = { real: 1, imag: 0 };
            for (let j = 0; j < len / 2; j++) {
                const u = output[i + j];
                const v = {
                    real: output[i + j + len / 2].real * w.real - output[i + j + len / 2].imag * w.imag,
                    imag: output[i + j + len / 2].real * w.imag + output[i + j + len / 2].imag * w.real
                };
                
                output[i + j] = { real: u.real + v.real, imag: u.imag + v.imag };
                output[i + j + len / 2] = { real: u.real - v.real, imag: u.imag - v.imag };
                
                const wTemp = {
                    real: w.real * wlen.real - w.imag * wlen.imag,
                    imag: w.real * wlen.imag + w.imag * wlen.real
                };
                w = wTemp;
            }
        }
    }
    
    return output;
}

// ═══════════════════════════════════════════════════════════════════════════
// HARMONIC ANALYSIS FOR ORBITAL MECHANICS
// ═══════════════════════════════════════════════════════════════════════════

export interface HarmonicComponent {
    order: number;        // Harmonic order (1=fundamental, 2=2nd harmonic, etc.)
    amplitude: number;    // Magnitude
    phase: number;        // Phase angle in radians
    period: number;       // Period in time units
}

/**
 * Decompose periodic signal into harmonics
 * Useful for analyzing orbital perturbations
 */
export function harmonicAnalysis(
    data: number[],
    samplePeriod: number
): HarmonicComponent[] {
    const spectrum = dft(data);
    const harmonics: HarmonicComponent[] = [];
    
    for (let i = 1; i < Math.min(spectrum.length, 20); i++) {
        if (spectrum[i].amplitude > 0.01) { // Threshold for significance
            harmonics.push({
                order: i,
                amplitude: spectrum[i].amplitude,
                phase: spectrum[i].phase,
                period: samplePeriod * data.length / i
            });
        }
    }
    
    // Sort by amplitude descending
    harmonics.sort((a, b) => b.amplitude - a.amplitude);
    
    return harmonics;
}

/**
 * Reconstruct signal from harmonics
 */
export function reconstructFromHarmonics(
    harmonics: HarmonicComponent[],
    timeValues: number[],
    baseSignal?: number
): number[] {
    return timeValues.map(t => {
        let sum = baseSignal || 0;
        for (const h of harmonics) {
            sum += h.amplitude * Math.cos(2 * Math.PI * t / h.period + h.phase);
        }
        return sum;
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// WAVELET ANALYSIS (Multi-scale decomposition)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Haar wavelet transform
 * Simplest wavelet, good for edge detection in time series
 */
export function haarWavelet(input: number[]): { approximation: number[]; details: number[] } {
    const N = input.length;
    const approximation: number[] = [];
    const details: number[] = [];
    
    for (let i = 0; i < N; i += 2) {
        const a = (input[i] + input[i + 1]) / Math.SQRT2;
        const d = (input[i] - input[i + 1]) / Math.SQRT2;
        approximation.push(a);
        details.push(d);
    }
    
    return { approximation, details };
}

/**
 * Multi-level wavelet decomposition
 */
export function multiLevelWavelet(input: number[], levels: number): number[][] {
    const coefficients: number[][] = [];
    let current = [...input];
    
    for (let level = 0; level < levels; level++) {
        const { approximation, details } = haarWavelet(current);
        coefficients.push(details);
        current = approximation;
    }
    
    coefficients.push(current); // Final approximation
    return coefficients.reverse(); // From coarse to fine
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAOS THEORY METRICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lyapunov exponent estimation
 * Measures sensitivity to initial conditions
 * Positive = chaotic, Zero = periodic, Negative = stable
 */
export function estimateLyapunovExponent(
    data: number[],
    delay: number = 1,
    embedding: number = 3
): number {
    if (data.length < embedding * 10) return 0;
    
    // Simple estimation using divergence of nearby trajectories
    const N = data.length - embedding * delay;
    let divergenceSum = 0;
    let count = 0;
    
    for (let i = 0; i < N - 1; i += 10) {
        const d0 = Math.abs(data[i] - data[i + 1]);
        if (d0 < 1e-10) continue;
        
        const j = i + embedding * delay;
        if (j >= data.length) continue;
        
        const dt = Math.abs(data[j] - data[j + 1]);
        if (dt > 0) {
            divergenceSum += Math.log(dt / d0);
            count++;
        }
    }
    
    return count > 0 ? divergenceSum / count : 0;
}

/**
 * Correlation dimension estimation
 * Measures fractal dimension of attractor
 */
export function correlationDimension(
    data: number[],
    embedding: number = 3,
    epsilon: number = 0.1
): number {
    const N = data.length - embedding;
    let count = 0;
    let totalPairs = 0;
    
    for (let i = 0; i < N; i += 5) {
        for (let j = i + 1; j < N; j += 5) {
            let distSq = 0;
            for (let k = 0; k < embedding; k++) {
                const diff = data[i + k] - data[j + k];
                distSq += diff * diff;
            }
            if (distSq < epsilon * epsilon) count++;
            totalPairs++;
        }
    }
    
    const C = count / totalPairs;
    return Math.log(C) / Math.log(epsilon);
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE SPACE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export interface PhaseSpacePoint {
    x: number;
    y: number;
    z?: number;
}

/**
 * Reconstruct phase space using time delays (Takens' theorem)
 */
export function reconstructPhaseSpace(
    data: number[],
    delay: number = 1,
    embedding: number = 3
): PhaseSpacePoint[] {
    const points: PhaseSpacePoint[] = [];
    const N = data.length - (embedding - 1) * delay;
    
    for (let i = 0; i < N; i++) {
        const point: PhaseSpacePoint = { x: data[i] };
        if (embedding >= 2) point.y = data[i + delay];
        if (embedding >= 3) point.z = data[i + 2 * delay];
        points.push(point);
    }
    
    return points;
}

/**
 * Find recurrence points in phase space
 */
export function findRecurrences(
    points: PhaseSpacePoint[],
    threshold: number = 0.1
): Array<{ i: number; j: number }> {
    const recurrences: Array<{ i: number; j: number }> = [];
    
    for (let i = 0; i < points.length; i += 5) {
        for (let j = i + 1; j < points.length; j += 5) {
            let distSq = (points[i].x - points[j].x) ** 2;
            if (points[i].y !== undefined) {
                distSq += (points[i].y! - points[j].y!) ** 2;
            }
            if (points[i].z !== undefined) {
                distSq += (points[i].z! - points[j].z!) ** 2;
            }
            
            if (distSq < threshold * threshold) {
                recurrences.push({ i, j });
            }
        }
    }
    
    return recurrences;
}

// ═══════════════════════════════════════════════════════════════════════════
// ASTRONOMICAL MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate planetary mean anomaly (M)
 */
export function meanAnomaly(
    meanLongitude: number,
    longitudeOfPerihelion: number
): number {
    let M = meanLongitude - longitudeOfPerihelion;
    while (M < 0) M += 360;
    while (M >= 360) M -= 360;
    return M;
}

/**
 * Solve Kepler's equation: M = E - e*sin(E)
 * Using Newton-Raphson iteration
 */
export function solveKepler(
    M: number,
    eccentricity: number,
    epsilon: number = 1e-8
): number {
    let E = M; // Initial guess
    
    for (let i = 0; i < 50; i++) {
        const dE = (E - eccentricity * Math.sin(E) - M) / (1 - eccentricity * Math.cos(E));
        E -= dE;
        if (Math.abs(dE) < epsilon) return E;
    }
    
    return E;
}

/**
 * Calculate true anomaly from eccentric anomaly
 */
export function trueAnomaly(
    E: number,
    eccentricity: number
): number {
    const sqrt = Math.sqrt((1 + eccentricity) / (1 - eccentricity));
    return 2 * Math.atan(sqrt * Math.tan(E / 2));
}

/**
 * Calculate distance from focus (r) given semi-major axis and eccentricity
 */
export function orbitalDistance(
    semiMajorAxis: number,
    eccentricity: number,
    trueAnomaly: number
): number {
    return semiMajorAxis * (1 - eccentricity * eccentricity) / 
           (1 + eccentricity * Math.cos(trueAnomaly));
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER THEORY FOR CALENDAR STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chinese Remainder Theorem
 * Useful for calendar calculations involving multiple cycles
 */
export function chineseRemainder(
    remainders: number[],
    moduli: number[]
): number {
    let x = 0;
    const M = moduli.reduce((a, b) => a * b, 1);
    
    for (let i = 0; i < remainders.length; i++) {
        const Mi = M / moduli[i];
        let Mi_inv = 1;
        
        // Find modular inverse
        for (let j = 1; j < moduli[i]; j++) {
            if ((Mi * j) % moduli[i] === 1) {
                Mi_inv = j;
                break;
            }
        }
        
        x += remainders[i] * Mi * Mi_inv;
    }
    
    return x % M;
}

/**
 * Sexagenary cycle position using CRT
 * Combines 10-year stem cycle and 12-year branch cycle
 */
export function sexagenaryPosition(year: number): { stem: number; branch: number; index: number } {
    // Year 4 = Jia Zi (position 0)
    const offset = ((year - 4) % 60 + 60) % 60;
    
    return {
        stem: offset % 10,
        branch: offset % 12,
        index: offset
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERPOLATION METHODS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lagrange interpolation
 * Fits polynomial through n points
 */
export function lagrangeInterpolation(
    xValues: number[],
    yValues: number[],
    x: number
): number {
    let result = 0;
    const n = xValues.length;
    
    for (let i = 0; i < n; i++) {
        let term = yValues[i];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
            }
        }
        result += term;
    }
    
    return result;
}

/**
 * Barycentric rational interpolation
 * More stable than Lagrange for many points
 */
export function barycentricInterpolation(
    xValues: number[],
    yValues: number[],
    x: number
): number {
    const n = xValues.length;
    const weights: number[] = [];
    
    // Compute barycentric weights
    for (let i = 0; i < n; i++) {
        let w = 1;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                w *= 1 / (xValues[i] - xValues[j]);
            }
        }
        weights.push(w);
    }
    
    // Evaluate
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
        if (Math.abs(x - xValues[i]) < 1e-10) {
            return yValues[i]; // Exact match
        }
        const term = weights[i] / (x - xValues[i]);
        numerator += term * yValues[i];
        denominator += term;
    }
    
    return numerator / denominator;
}