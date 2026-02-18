import { Solar, Lunar } from "lunar-javascript";

export interface LunarDate {
    year: number;
    month: number;
    day: number;
    isLeap: boolean;
}

/**
 * Authentic Solar-Lunar conversion using lunar-javascript.
 */
export function lunarToSolar(lunar: LunarDate): Date {
    // In lunar-javascript, a negative month indicates a leap month
    const l = Lunar.fromYmd(lunar.year, lunar.isLeap ? -lunar.month : lunar.month, lunar.day);
    const s = l.getSolar();
    return new Date(s.getYear(), s.getMonth() - 1, s.getDay());
}

export function solarToLunar(solar: Date): LunarDate {
    const s = Solar.fromYmd(solar.getFullYear(), solar.getMonth() + 1, solar.getDate());
    const l = s.getLunar();
    const month = l.getMonth();
    return {
        year: l.getYear(),
        month: Math.abs(month),
        day: l.getDay(),
        isLeap: month < 0,
    };
}
