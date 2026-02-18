import { ElementVector } from "../bazi/element_scoring";

export function normalize(v: ElementVector): ElementVector {
    const sum = Object.values(v).reduce((a, b) => a + b, 0);
    if (sum === 0) return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    return {
        wood: v.wood / sum,
        fire: v.fire / sum,
        earth: v.earth / sum,
        metal: v.metal / sum,
        water: v.water / sum,
    };
}

export function topN(v: ElementVector, n: number = 1): string[] {
    return Object.entries(v)
        .sort(([, a], [, b]) => b - a)
        .slice(0, n)
        .map(([k]) => k);
}

export function bottomN(v: ElementVector, n: number = 1): string[] {
    return Object.entries(v)
        .sort(([, a], [, b]) => a - b)
        .slice(0, n)
        .map(([k]) => k);
}

export function balanceIndex(v: ElementVector): number {
    const values = Object.values(v);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    if (avg === 0) return 0;
    const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
    // Scale it so 1.0 is "perfectly balanced" and lower is less balanced
    return Math.max(0, 1 - Math.sqrt(variance) / avg);
}
