// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  BAZI CORE — Authentic Four Pillars Calculation                         ║
// ║  JDN day pillar, 五虎遁 month stem, 五鼠遁 hour stem, hidden stems        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { ElementVector } from "./element_scoring";
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  calculateDayPillar,
  calculateYearPillar,
  gregorianToJDN,
  SexagenaryPillar,
} from "../celestial/time";

// ═══════════════════════════════════════════════════════════════════════════
// MONTH PILLAR (月柱) — 五虎遁 (Five Tigers)
// ═══════════════════════════════════════════════════════════════════════════

// Solar term boundaries (approximate) for month branch determination
// In authentic BaZi, month changes at 节气 (Jie Qi), not month boundaries
const SOLAR_TERM_BOUNDS: Array<{ month: number; day: number; branch: string; branchIndex: number }> = [
  { month: 2,  day: 4,  branch: "寅", branchIndex: 2 },  // 立春 Li Chun
  { month: 3,  day: 6,  branch: "卯", branchIndex: 3 },  // 惊蛰 Jing Zhe
  { month: 4,  day: 4,  branch: "辰", branchIndex: 4 },  // 清明 Qing Ming
  { month: 5,  day: 5,  branch: "巳", branchIndex: 5 },  // 立夏 Li Xia
  { month: 6,  day: 5,  branch: "午", branchIndex: 6 },  // 芒种 Mang Zhong
  { month: 7,  day: 7,  branch: "未", branchIndex: 7 },  // 小暑 Xiao Shu
  { month: 8,  day: 7,  branch: "申", branchIndex: 8 },  // 立秋 Li Qiu
  { month: 9,  day: 7,  branch: "酉", branchIndex: 9 },  // 白露 Bai Lu
  { month: 10, day: 8,  branch: "戌", branchIndex: 10 }, // 寒露 Han Lu
  { month: 11, day: 7,  branch: "亥", branchIndex: 11 }, // 立冬 Li Dong
  { month: 12, day: 7,  branch: "子", branchIndex: 0 },  // 大雪 Da Xue
  { month: 1,  day: 6,  branch: "丑", branchIndex: 1 },  // 小寒 Xiao Han
];

/**
 * 五虎遁: Month stem determination based on year stem
 * Key principle: 1st month (寅) stem varies by year stem group
 * 
 * Year Stem Group | 寅月 Stem
 * 甲/己 (0,5)    | 丙 (2)
 * 乙/庚 (1,6)    | 戊 (4)
 * 丙/辛 (2,7)    | 庚 (6)
 * 丁/壬 (3,8)    | 壬 (8)
 * 戊/癸 (4,9)    | 甲 (0)
 */
const WU_HU_DUN_BASE: Record<number, number> = {
  0: 2, 5: 2,  // 甲/己 → 丙 begins 寅月
  1: 4, 6: 4,  // 乙/庚 → 戊 begins 寅月
  2: 6, 7: 6,  // 丙/辛 → 庚 begins 寅月
  3: 8, 8: 8,  // 丁/壬 → 壬 begins 寅月
  4: 0, 9: 0,  // 戊/癸 → 甲 begins 寅月
};

export function calculateMonthPillar(yearStemIndex: number, date: Date): SexagenaryPillar {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Determine solar month branch
  let monthBranchIndex = 2; // Default to 寅 for early Jan - Feb

  // Find the appropriate solar term
  for (let i = 0; i < SOLAR_TERM_BOUNDS.length; i++) {
    const bound = SOLAR_TERM_BOUNDS[i];
    const nextBound = SOLAR_TERM_BOUNDS[(i + 1) % SOLAR_TERM_BOUNDS.length];
    
    // Check if we're in this solar term window
    if (isInSolarTermWindow(month, day, bound, nextBound)) {
      monthBranchIndex = bound.branchIndex;
      break;
    }
  }

  // 五虎遁: derive month stem from year stem + month branch offset
  const baseStem = WU_HU_DUN_BASE[yearStemIndex] ?? 2;
  // 寅 = index 2, so if month branch is X, stem offset = (X - 2) from base
  const stemOffset = (monthBranchIndex - 2 + 12) % 12;
  const monthStemIndex = (baseStem + stemOffset) % 10;

  const stem = HEAVENLY_STEMS[monthStemIndex];
  const branch = EARTHLY_BRANCHES[monthBranchIndex];

  const STEM_ELEMENTS: Record<string, string> = {
    甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth",
    己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water",
  };
  const BRANCH_ELEMENTS: Record<string, string> = {
    子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth",
    巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal",
    戌: "earth", 亥: "water",
  };

  return {
    stem,
    branch,
    index: (monthStemIndex % 10) * 6 + monthBranchIndex, // Not exact, placeholder
    stemElement: STEM_ELEMENTS[stem] ?? "unknown",
    branchElement: BRANCH_ELEMENTS[branch] ?? "unknown",
    stemYinYang: monthStemIndex % 2 === 0 ? "yang" : "yin",
    branchYinYang: monthBranchIndex % 2 === 0 ? "yang" : "yin",
  };
}

function isInSolarTermWindow(month: number, day: number, bound: typeof SOLAR_TERM_BOUNDS[0], nextBound: typeof SOLAR_TERM_BOUNDS[0]): boolean {
  const current = month * 100 + day;
  const boundVal = bound.month * 100 + bound.day;
  const nextVal = nextBound.month * 100 + nextBound.day;

  if (boundVal < nextVal) {
    // Normal ordering within the year
    return current >= boundVal && current < nextVal;
  } else {
    // Year wrap (Dec → Jan)
    return current >= boundVal || current < nextVal;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HOUR PILLAR (时柱) — 五鼠遁 (Five Rats)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map hour to hour branch (2-hour periods starting at 23:00)
 * 子时 = 23:00-01:00, 丑时 = 01:00-03:00, ...
 */
export function hourToBranchIndex(hour: number, minute: number = 0): number {
  // Adjust for day boundary: 23:00+ belongs to next day
  const totalMinutes = hour * 60 + minute;
  // 23:00 = 1380 minutes. Hours 23-24 map to branch 0 (子)
  // 01:00 = 60 minutes.  01-03 map to branch 1 (丑)
  // Shift by 1 hour so 23:00 becomes start of 子
  const adjusted = (totalMinutes + 60) % 1440;
  return Math.floor(adjusted / 120) % 12;
}

/**
 * 五鼠遁: Hour stem determination based on day stem
 *
 * Day Stem Group | 子时 Stem
 * 甲/己 (0,5)    | 甲 (0)
 * 乙/庚 (1,6)    | 丙 (2)
 * 丙/辛 (2,7)    | 戊 (4)
 * 丁/壬 (3,8)    | 庚 (6)
 * 戊/癸 (4,9)    | 壬 (8)
 */
const WU_SHU_DUN_BASE: Record<number, number> = {
  0: 0, 5: 0,
  1: 2, 6: 2,
  2: 4, 7: 4,
  3: 6, 8: 6,
  4: 8, 9: 8,
};

export function calculateHourPillar(dayStemIndex: number, hour: number, minute: number = 0): SexagenaryPillar {
  const branchIndex = hourToBranchIndex(hour, minute);
  const baseStem = WU_SHU_DUN_BASE[dayStemIndex] ?? 0;
  const stemIndex = (baseStem + branchIndex) % 10;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  const STEM_ELEMENTS: Record<string, string> = {
    甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth",
    己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water",
  };
  const BRANCH_ELEMENTS: Record<string, string> = {
    子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth",
    巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal",
    戌: "earth", 亥: "water",
  };

  return {
    stem,
    branch,
    index: (stemIndex % 10) * 6 + branchIndex,
    stemElement: STEM_ELEMENTS[stem] ?? "unknown",
    branchElement: BRANCH_ELEMENTS[branch] ?? "unknown",
    stemYinYang: stemIndex % 2 === 0 ? "yang" : "yin",
    branchYinYang: branchIndex % 2 === 0 ? "yang" : "yin",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HIDDEN STEMS (藏干)
// ═══════════════════════════════════════════════════════════════════════════

interface HiddenStemInfo {
  stem: string;
  intensity: "primary" | "secondary" | "tertiary";
  element: string;
}

/**
 * Hidden heavenly stems within each earthly branch
 * Traditional: Primary is the "main residence" stem, secondary/tertiary are "leftover"
 */
const HIDDEN_STEMS: Record<string, HiddenStemInfo[]> = {
  子: [{ stem: "癸", intensity: "primary", element: "water" }],
  丑: [
    { stem: "己", intensity: "primary", element: "earth" },
    { stem: "癸", intensity: "secondary", element: "water" },
    { stem: "辛", intensity: "tertiary", element: "metal" },
  ],
  寅: [
    { stem: "甲", intensity: "primary", element: "wood" },
    { stem: "丙", intensity: "secondary", element: "fire" },
    { stem: "戊", intensity: "tertiary", element: "earth" },
  ],
  卯: [{ stem: "乙", intensity: "primary", element: "wood" }],
  辰: [
    { stem: "戊", intensity: "primary", element: "earth" },
    { stem: "乙", intensity: "secondary", element: "wood" },
    { stem: "癸", intensity: "tertiary", element: "water" },
  ],
  巳: [
    { stem: "丙", intensity: "primary", element: "fire" },
    { stem: "戊", intensity: "secondary", element: "earth" },
    { stem: "庚", intensity: "tertiary", element: "metal" },
  ],
  午: [
    { stem: "丁", intensity: "primary", element: "fire" },
    { stem: "己", intensity: "secondary", element: "earth" },
  ],
  未: [
    { stem: "己", intensity: "primary", element: "earth" },
    { stem: "丁", intensity: "secondary", element: "fire" },
    { stem: "乙", intensity: "tertiary", element: "wood" },
  ],
  申: [
    { stem: "庚", intensity: "primary", element: "metal" },
    { stem: "壬", intensity: "secondary", element: "water" },
    { stem: "戊", intensity: "tertiary", element: "earth" },
  ],
  酉: [{ stem: "辛", intensity: "primary", element: "metal" }],
  戌: [
    { stem: "戊", intensity: "primary", element: "earth" },
    { stem: "辛", intensity: "secondary", element: "metal" },
    { stem: "丁", intensity: "tertiary", element: "fire" },
  ],
  亥: [
    { stem: "壬", intensity: "primary", element: "water" },
    { stem: "甲", intensity: "secondary", element: "wood" },
  ],
};

export function getHiddenStems(branch: string): { zh: string; pinyin: string; elements: { element: string; intensity: string }[] } {
  const PINYIN: Record<string, string> = {
    甲: "Jia", 乙: "Yi", 丙: "Bing", 丁: "Ding", 戊: "Wu",
    己: "Ji", 庚: "Geng", 辛: "Xin", 壬: "Ren", 癸: "Gui",
  };
  const stems = HIDDEN_STEMS[branch] ?? [];
  return {
    zh: stems.map(s => s.stem).join(""),
    pinyin: stems.map(s => PINYIN[s.stem] || s.stem).join("/"),
    elements: stems.map(s => ({
      element: s.element,
      intensity: s.intensity,
    })),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT SCORING
// ═══════════════════════════════════════════════════════════════════════════

// Element weights: stem = 1.0, primary hidden = 0.7, secondary = 0.4, tertiary = 0.2
const ELEM_WEIGHTS: Record<string, number> = {
  wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
};

export function scoreElementsFromPillars(pillars: {
  year: SexagenaryPillar;
  month: SexagenaryPillar;
  day: SexagenaryPillar;
  hour: SexagenaryPillar;
}): ElementVector {
  const scores: ElementVector = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  // Add stem elements (weight 1.0 each)
  const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
  stems.forEach(stem => {
    const el = getStemElement(stem);
    if (el) scores[el as keyof ElementVector] += 1.0;
  });

  // Add branch surface elements (weight 1.0 each)
  const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
  branches.forEach(branch => {
    const el = getBranchElement(branch);
    if (el) scores[el as keyof ElementVector] += 1.0;
  });

  // Add hidden stems with diminishing weights
  const HIDDEN_WEIGHTS = { primary: 0.7, secondary: 0.4, tertiary: 0.2 };
  branches.forEach(branch => {
    const hidden = HIDDEN_STEMS[branch] ?? [];
    hidden.forEach(hs => {
      scores[hs.element as keyof ElementVector] += HIDDEN_WEIGHTS[hs.intensity] || 0.2;
    });
  });

  return scores;
}

function getStemElement(stem: string): string | undefined {
  const M: Record<string, string> = {
    甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth",
    己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water",
  };
  return M[stem];
}

function getBranchElement(branch: string): string | undefined {
  const M: Record<string, string> = {
    子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth",
    巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal",
    戌: "earth", 亥: "water",
  };
  return M[branch];
}

// ═══════════════════════════════════════════════════════════════════════════
// TEN GODS (十神)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine the Ten God for a stem relative to the Day Master
 * 
 * Day Master element vs Other stem → Ten God relationship
 * Same element + same polarity  = 比肩 (Sibling)
 * Same element + diff polarity  = 劫财 (Rob Wealth)
 * 
 * I produce (生) + diff polarity = 食神 (Output)
 * I produce (生) + same polarity = 伤官 (Hurt Output)
 * 
 * Produces me (被生) + diff polarity = 正印 (Support)
 * Produces me (被生) + same polarity = 偏印 (Resource)
 * 
 * I overcome (克) + diff polarity = 正财 (Direct Wealth)
 * I overcome (克) + same polarity = 偏财 (Indirect Wealth)
 * 
 * Overcomes me (被克) + diff polarity = 正官 (Officer)
 * Overcomes me (被克) + same polarity = 七杀 (7 Killings)
 */

const PRODUCTION: Record<string, string> = {
  wood: "fire",  fire: "earth",  earth: "metal",  metal: "water",  water: "wood",
};

const OVERCOME: Record<string, string> = {
  wood: "earth",  fire: "metal",  earth: "water",  metal: "wood",  water: "fire",
};

const OVERCOME_BY: Record<string, string> = {
  wood: "metal",  fire: "water",  earth: "wood",  metal: "fire",  water: "earth",
};

const PRODUCED_BY: Record<string, string> = {
  wood: "water",  fire: "wood",  earth: "fire",  metal: "earth",  water: "metal",
};

function getStemPolarity(stem: string): "yang" | "yin" {
  const YANG = ["甲", "丙", "戊", "庚", "壬"];
  return YANG.includes(stem) ? "yang" : "yin";
}

export function determineTenGod(dayMasterStem: string, otherStem: string): string {
  const dmElement = getStemElement(dayMasterStem);
  const otherElement = getStemElement(otherStem);
  if (!dmElement || !otherElement) return "Unknown";

  const dmPolarity = getStemPolarity(dayMasterStem);
  const otherPolarity = getStemPolarity(otherStem);
  const samePolarity = dmPolarity === otherPolarity;

  // Same element
  if (dmElement === otherElement) {
    return samePolarity ? "比肩 (Sibling)" : "劫财 (Rob Wealth)";
  }

  // I produce the other element
  if (PRODUCTION[dmElement] === otherElement) {
    return samePolarity ? "食神 (Output)" : "伤官 (Hurt Output)";
  }

  // Other element produces me
  if (PRODUCED_BY[dmElement] === otherElement) {
    return samePolarity ? "偏印 (Resource)" : "正印 (Support)";
  }

  // I overcome the other element
  if (OVERCOME[dmElement] === otherElement) {
    return samePolarity ? "偏财 (Indirect Wealth)" : "正财 (Direct Wealth)";
  }

  // Other element overcomes me
  if (OVERCOME_BY[dmElement] === otherElement) {
    return samePolarity ? "七杀 (7 Killings)" : "正官 (Officer)";
  }

  return "Unknown";
}

// ═══════════════════════════════════════════════════════════════════════════
// SOLAR TERMS (节气)
// ═══════════════════════════════════════════════════════════════════════════

const SOLAR_TERM_NAMES = [
  "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
  "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
  "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
  "立冬", "小雪", "大雪", "冬至", "小寒", "大寒",
];

export function getCurrentSolarTerm(date: Date): { current: string; next: string; nextDateApprox: string } {
  // Simplified: determine approximate current and next solar terms
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Rough mapping (approximate)
  const termMap: Record<number, number> = {
    2: 0, 3: 2, 4: 4, 5: 6, 6: 8, 7: 10, 8: 12, 9: 14, 10: 16, 11: 18, 12: 20, 1: 22,
  };
  
  const currentIdx = termMap[month] ?? 0;
  const nextIdx = (currentIdx + 2) % 24;
  
  // Approximate next term date
  const nextMonth = ((Math.floor(nextIdx / 2) + 1) % 12) || 12;
  const nextDay = nextIdx % 2 === 0 ? 4 : 20;
  
  return {
    current: SOLAR_TERM_NAMES[currentIdx],
    next: SOLAR_TERM_NAMES[nextIdx],
    nextDateApprox: `${date.getFullYear()}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN API
// ═══════════════════════════════════════════════════════════════════════════

export interface PillarDetail {
  zh: string;
  pinyin: string;
  heavenlyStemZh: string;
  heavenlyStemPinyin: string;
  earthlyBranchZh: string;
  earthlyBranchPinyin: string;
  element: string;
  hiddenStems: {
    zh: string;
    pinyin: string;
    elements: { element: string; intensity: string }[];
  };
}

export interface DayMasterInfo {
  stem: string;
  element: string;
  yinYang: string;
  pinyin: string;
}

export interface BaziCoreResponse {
  pillars: {
    year: PillarDetail;
    month: PillarDetail;
    day: PillarDetail;
    hour: PillarDetail;
  };
  dayMaster: DayMasterInfo;
  elements: {
    scores: ElementVector;
  };
  tenGods: Record<string, string>;
  solarTerms: {
    current: string;
    next: string;
    nextDate: string;
  };
}

const PINYIN_MAP: Record<string, string> = {
  甲: "Jia", 乙: "Yi", 丙: "Bing", 丁: "Ding", 戊: "Wu",
  己: "Ji", 庚: "Geng", 辛: "Xin", 壬: "Ren", 癸: "Gui",
  子: "Zi", 丑: "Chou", 寅: "Yin", 卯: "Mao", 辰: "Chen",
  巳: "Si", 午: "Wu", 未: "Wei", 申: "Shen", 酉: "You",
  戌: "Xu", 亥: "Hai",
};

/**
 * Calculate complete BaZi chart from birth date
 */
export function getBaziCore(
  birthUtc: string,
  options?: { tzOffsetMinutes?: number; dayStartHourLocal?: number; elementSeason?: boolean }
): BaziCoreResponse {
  const date = new Date(birthUtc);
  
  // Apply timezone offset if provided
  if (options?.tzOffsetMinutes) {
    date.setTime(date.getTime() + options.tzOffsetMinutes * 60000);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Calculate JDN for day pillar
  const jdn = gregorianToJDN(year, month, day);

  // Calculate year pillar
  const yearPillar = calculateYearPillar(date);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearPillar.stem);

  // Calculate month pillar (五虎遁)
  const monthPillar = calculateMonthPillar(yearStemIndex, date);

  // Calculate day pillar (JDN formula)
  const dayPillar = calculateDayPillar(jdn);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.stem);

  // Calculate hour pillar (五鼠遁)
  const hourPillar = calculateHourPillar(dayStemIndex, hour, minute);

  const pillars = {
    year: pillarToDetail(yearPillar),
    month: pillarToDetail(monthPillar),
    day: pillarToDetail(dayPillar),
    hour: pillarToDetail(hourPillar),
  };

  // Day Master = Day pillar stem
  const dayMaster: DayMasterInfo = {
    stem: dayPillar.stem,
    element: dayPillar.stemElement,
    yinYang: dayPillar.stemYinYang,
    pinyin: PINYIN_MAP[dayPillar.stem] || dayPillar.stem,
  };

  // Calculate element scores
  const rawElements = scoreElementsFromPillars({
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  });

  // Ten Gods: map each pillar stem relative to Day Master
  const tenGods: Record<string, string> = {};
  tenGods.year = determineTenGod(dayPillar.stem, yearPillar.stem);
  tenGods.month = determineTenGod(dayPillar.stem, monthPillar.stem);
  tenGods.day = "日主 (Day Master)";
  tenGods.hour = determineTenGod(dayPillar.stem, hourPillar.stem);

  // Solar terms
  const solarTerms = getCurrentSolarTerm(date);

  return {
    pillars,
    dayMaster,
    elements: { scores: rawElements },
    tenGods,
    solarTerms: {
      current: solarTerms.current,
      next: solarTerms.next,
      nextDate: solarTerms.nextDateApprox,
    },
  };
}

function pillarToDetail(p: SexagenaryPillar): PillarDetail {
  return {
    zh: `${p.stem}${p.branch}`,
    pinyin: `${PINYIN_MAP[p.stem] || p.stem} ${PINYIN_MAP[p.branch] || p.branch}`,
    heavenlyStemZh: p.stem,
    heavenlyStemPinyin: PINYIN_MAP[p.stem] || p.stem,
    earthlyBranchZh: p.branch,
    earthlyBranchPinyin: PINYIN_MAP[p.branch] || p.branch,
    element: p.stemElement,
    hiddenStems: getHiddenStems(p.branch),
  };
}
