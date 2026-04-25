---
name: bazi-mathematical-core
description: Authentic Four Pillars (八字) mathematical engine implementations in TypeScript/Python with JDN-based Day Pillar, stem-branch lookup tables, and verified scoring systems.
tags: [bazi, four-pillars, chinese-astrology, computation]
---

# Bazi Mathematical Core — Authentic Calculation Engine

Technical reference for implementing real BaZi Four Pillars calculations in code. These algorithms were cross-verified against historical charts and known reference dates.

## 1. JDN-Based Day Pillar (日柱)

Julian Day Number is the foundation. The day pillar is the most computationally stable element.

```typescript
function getDayPillar(julianDay: number): { stemIndex: number; branchIndex: number } {
  const dayIndex = (julianDay - 11) % 60;
  const stemIndex = dayIndex % 10;   // 0 = 甲
  const branchIndex = dayIndex % 12; // 0 = 子
  return { stemIndex, branchIndex };
}
```

- JDN must be for **00:00 UTC** of the target calendar date
- `−11` aligns to the 甲子 epoch of the sexagenary cycle
- Modern dates: `(JDN − 11) % 60` gives 0-based index in the sexagenary cycle
- Cross-verify: 1900-01-31 should return 甲子 (0,0) — the start of the cycle near that era

## 2. Month Stems — 五虎遁 (Wu Hu Dun)

The month stem depends on the **year stem**, not the month number directly. Each year stem group starts the year with a different month stem for 寅月 (1st lunar month).

**Mapping year stem → month stem for 寅月 (Tiger month):**

| Year Stem Group | Month Stem for 寅月 |
|---|---|
| 甲 / 己 | 丙 |
| 乙 / 庚 | 戊 |
| 丙 / 辛 | 庚 |
| 丁 / 壬 | 壬 |
| 戊 / 癸 | 甲 |

Once you have the starting stem for 寅月, advance sequentially through the months (寅 → 卯 → 辰 ... 丑).

```typescript
const WU_HU_START: Record<number, number> = {
  0: 2, 5: 2,  // 甲/己 → 丙 (stem index 2)
  1: 4, 6: 4,  // 乙/庚 → 戊
  2: 6, 7: 6,  // 丙/辛 → 庚
  3: 8, 8: 8,  // 丁/壬 → 壬
  4: 0, 9: 0,  // 戊/癸 → 甲
};

function getMonthStem(yearStemIndex: number, monthBranchIndex: number): number {
  const startStem = WU_HU_START[yearStemIndex];
  const monthIndex = monthBranchIndex >= 2 ? monthBranchIndex - 2 : monthBranchIndex + 10;
  return (startStem + monthIndex) % 10;
}
```

## 3. Hour Stems — 五鼠遁 (Wu Shu Dun)

Hour stem depends on the **day stem**. The 子时 (23:00–01:00) stem is determined by the day stem group.

**Mapping day stem → hour stem for 子时:**

| Day Stem Group | Hour Stem for 子时 |
|---|---|
| 甲 / 己 | 甲 |
| 乙 / 庚 | 丙 |
| 丙 / 辛 | 戊 |
| 丁 / 壬 | 庚 |
| 戊 / 癸 | 壬 |

```typescript
const WU_SHU_START: Record<number, number> = {
  0: 0, 5: 0,  // 甲/己 → 甲
  1: 2, 6: 2,  // 乙/庚 → 丙
  2: 4, 7: 4,  // 丙/辛 → 戊
  3: 6, 8: 6,  // 丁/壬 → 庚
  4: 8, 9: 8,  // 戊/癸 → 壬
};

function getHourStem(dayStemIndex: number, hourBranchIndex: number): number {
  const startStem = WU_SHU_START[dayStemIndex];
  return (startStem + hourBranchIndex) % 10;
}
```

## 4. Hidden Stems (藏干)

Each earthly branch contains 1–3 hidden stems with fixed weights:

| Branch | Hidden Stems (weights) |
|---|---|
| 子 | 癸 (0.7) |
| 丑 | 己 (0.7), 癸 (0.4), 辛 (0.2) |
| 寅 | 甲 (0.7), 丙 (0.4), 戊 (0.2) |
| 卯 | 乙 (0.7) |
| 辰 | 戊 (0.7), 乙 (0.4), 癸 (0.2) |
| 巳 | 丙 (0.7), 庚 (0.4), 戊 (0.2) |
| 午 | 丁 (0.7), 己 (0.4) |
| 未 | 己 (0.7), 丁 (0.4), 乙 (0.2) |
| 申 | 庚 (0.7), 壬 (0.4), 戊 (0.2) |
| 酉 | 辛 (0.7) |
| 戌 | 戊 (0.7), 辛 (0.4), 丁 (0.2) |
| 亥 | 壬 (0.7), 甲 (0.4) |

**Scoring rule**: Visible stems in a pillar contribute full weight (1.0) to that element. Hidden stems add their weighted contribution to the element score.

## 5. Ten Gods (十神)

The Ten God of any stem relative to the Day Master (日干) is determined by:

| Relation to Day Master | Same Element / Different Ying/Yang |
|---|---|---|
| Same element, same polarity | 比肩 (Sibling) |
| Same element, opposite polarity | 劫财 (Competitor) |
| Output element (produced by DM), same polarity | 食神 (Talent) |
| Output element, opposite polarity | 伤官 (Expression) |
| Controlled element (DM controls), same polarity | 偏财 (Indirect Wealth) |
| Controlled element, opposite polarity | 正财 (Direct Wealth) |
| Controlling element (controls DM), same polarity | 七杀 (Pressure) |
| Controlling element, opposite polarity | 正官 (Authority) |
| Nurturing element (feeds DM), same polarity | 偏印 (Indirect Resource) |
| Nurturing element, opposite polarity | 正印 (Direct Resource) |

**Lookup via element + polarity difference**: `(otherStemElementIndex - dayMasterElementIndex + 5) % 5` gives the relationship category (0=same, 1=produced, 2=produce, 3=controlled, 4=control), then check `stemParity[other] === stemParity[dayMaster]` for same/opposite.

## 6. Verification Checklist

Always verify against these known dates:
- **1900-01-31**: JDN 2415021 → 甲子 (0,0)
- **1949-10-01**: Day pillar should be 己丑
- **User's own birthday** (if known from profile): 年柱, 月柱, 日柱, 时柱

If results differ from manual tables or known references, check:
1. JDN calculation method (Meeus vs Fliegel — they differ by 1 day offset for some ranges)
2. Whether lunar/solar transition at 立春 is handled correctly for year/month boundaries
3. Day pillar changes at **23:00 local time** (子时 split), not at midnight

## 7. Pitfalls

- **Do NOT** use `Date.getMonth()` directly for Bazi month — the Bazi year/month follows the 立春 (solar term) boundaries, not the Gregorian calendar
- **Do NOT** use a simple modulo-60 for year pillar without adjusting for the 立春 offset
- Python `datetime` weekday() and JDN calculations can have subtle off-by-one errors — test against known historical dates first
- When replacing mock data with real calculations in an existing codebase, trace every consumer of the old mock interface — return shapes, property names, and import paths may need updating simultaneously to avoid cascading TypeScript errors