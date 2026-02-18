export interface LunarDate {
    year: number;
    month: number;
    day: number;
    isLeap: boolean;
}

/**
 * Simplified Solar-Lunar conversion for MVP.
 * In a production app, use a library like 'lunar-javascript'.
 */
export function lunarToSolar(lunar: LunarDate): Date {
    // Mock conversion: adds ~30 days to the lunar date to get an approximate solar date
    // This is purely for UI demonstration in this MVP.
    const date = new Date(lunar.year, lunar.month - 1, lunar.day);
    date.setDate(date.getDate() + 30);
    return date;
}

export function solarToLunar(solar: Date): LunarDate {
    // Mock conversion: subtracts ~30 days
    const date = new Date(solar);
    date.setDate(date.getDate() - 30);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        isLeap: false,
    };
}
