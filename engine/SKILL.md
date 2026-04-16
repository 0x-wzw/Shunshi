---
name: celestial-computations
category: research
description: >
  Astrum Harmonis Celestialis — A specialized computational agent mastering 
  Chinese celestial cosmology (Bazi/Four Pillars, Zhouyi/I Ching) and 
  planetary/celestial mechanics.
version: 1.0.1
author: Dodecimus for {_USER_NAME}
license: MIT
platforms: [linux, macos, windows]
tags: [chinese-astrology, bazi, iching, celestial-mechanics, astronomy]
---

# Astrum Harmonis Celestialis

> *"As above, so below. The heavens inscribe patterns that time reveals."*

A complete computational framework for Chinese celestial cosmology:
- **Bazi (八字)** — Four Pillars of Destiny calculation engine
- **Zhouyi (周易)** — I Ching hexagram mathematics and relationships  
- **Celestial Mechanics** — Planetary ephemeris integration
- **Heaven-Earth Synthesis** — Unifying the ancient and precise

## Architecture

```
aether/        — Cosmological constants and mappings
  └─ Heavenly Stems (天干), Earthly Branches (地支), Five Phases (五行)

logos/         — Mathematical and astronomical algorithms
  └─ BaziCalculator, SolarTermCalculator, PlanetaryEphemeris

harmon/        — Relationship calculations and synthesis
  └─ Ten Gods, Branch Interactions, Hexagram Relations

praxis/        — Operational interface
  └─ CelestialAgent API, CLI, Query Processor
```

## Installation

```bash
cd ~/.hermes/skills/celestial-computations
pip install -r requirements.txt
```

## Usage

### Python API

```python
from celestial_computations import CelestialAgent

agent = CelestialAgent()

# Calculate Bazi chart
chart = agent.bazi_chart(2024, 4, 13, 12)
print(chart["pillars"]["day"])  # Day pillar

# Get hexagram reading
reading = agent.hexagram_reading(1, moving_lines=[2, 5])
print(reading["opposite"]["name"])

# Planetary positions
planets = agent.planetary_report()
```

### CLI

```bash
# Bazi chart
celestial-computations bazi 2024 4 13 12

# Hexagram reading
celestial-computations hexagram 1

# Current planetary positions
celestial-computations planetary

# Complete Celestial Report
celestial-computations report

# JSON output
celestial-computations bazi 2024 4 13 12 --json
```

## Core Capabilities

### Bazi (Four Pillars)

- Year, Month, Day, Hour pillar calculation
- Solar term boundaries (二十四节气)
- Ten Gods (十神) determination
- Five Phase balance analysis
- Branch interactions (Clash 冲, Combine 合)
- Luck Pillar (大运) computation

### Zhouyi (I Ching)

- 64 hexagram binary representation (Leibniz mapping)
- Opposite, Nuclear, and Changed hexagrams
- Moving line calculations
- Hexagram relationship mapping

### Celestial Mechanics

- Planetary position ephemeris
- Solar term calculation
- Lunar phase computation
- Calendar conversions

## Mathematical Foundations

### The Sexagenary Cycle

```
60-year cycle = lcm(10 stems, 12 branches)
Year n: stem = (n - 4) % 10, branch = (n - 4) % 12
```

### Binary Hexagrams (Leibniz, 1703)

```
Hexagram #1 (Qian/Heaven): 111111 = 63
Hexagram #2 (Kun/Earth):  000000 = 0
...
```

This is the **same binary system** that powers modern computing — 
discovered independently in ancient China.

## API Reference

### CelestialAgent Methods

| Method | Parameters | Returns |
|--------|------------|---------|
| `bazi_chart(year, month, day, hour)` | Integers | Dict with pillars and analysis |
| `hexagram_reading(number, moving_lines)` | Int, List[int] | Dict with original, opposite, nuclear |
| `planetary_report(datetime)` | Optional[datetime] | Dict positions and phases |
| `celestial_report(...)` | Same as bazi | Complete unified report |

## Daily Bazi Report Workflow (Cron Job)

For generating daily Bazi briefings (e.g., for Telegram delivery):

### Data Sources (in order of reliability)
1. **ChineseFortuneCalendar.com** — Zodiac month boundaries, lunar month dates, year pillar info (verified for 2026)
2. **HKO (Hong Kong Observatory)** — Lunar calendar converter (date range: 1901-2100)
3. **Python `lunardate` package** — Lunar date conversion (install: `uv pip install lunardate`)
4. **Self-computed** — Day pillar via JDN formula, solar term calculations

### Key Calculation Steps
1. **Day Pillar**: Use `(JDN - 11) % 60` formula (see Section 3 above)
2. **Lunar Date**: Use `lunardate.LunarDate.fromSolarDate(year, month, day)` → returns (year, month, day, isLeap)
3. **Solar Term**: Determine current zodiac month from chinesefortunecalendar.com data or solar longitude calculation
4. **Month Pillar**: Use 五虎遁 formula based on year stem group
5. **12 Day Officers (建除十二神)**: Depends on month branch + day branch relationship
6. **Clash/Avoidance (冲煞)**: Day branch determines clash (opposite in 6-pair system) and sha direction
7. **Na Yin (纳音)**: Use 30-pair lookup table from 60-cycle index

### Zodiac Month Boundaries (from chinesefortunecalendar.com for 2026)
These are SOLAR months (节气 boundaries), NOT lunar months:
- 寅月 Tiger: Feb 4 – Mar 4 | 卯月 Rabbit: Mar 5 – Apr 4
- 辰月 Dragon: Apr 5 – May 4 | 巳月 Snake: May 5 – Jun 4
- 午月 Horse: Jun 5 – Jul 6 | 未月 Goat: Jul 7 – Aug 6
- 申月 Monkey: Aug 7 – Sep 6 | 酉月 Rooster: Sep 7 – Oct 7
- 戌月 Dog: Oct 8 – Nov 6 | 亥月 Pig: Nov 7 – Dec 6
- 子月 Rat: Dec 7 – Jan 4 | 丑月 Ox: Jan 5 – Feb 3

### Web Scraping Pitfalls
- Many Chinese almanac sites use 451 (geo-blocked) or expired SSL — browser tool is essential
- ChineseFortuneCalendar.com blocks with 451 from Python but works in browser
- HKO calendar converter requires JavaScript interaction (no simple URL pattern for year data)
- The `chinesefortunecalendar.com/Calendar/YYYY/YYYY-ChineseCalendar.htm` URL format has year-specific data
- Tavily search may hit rate limits — have fallback computation methods ready

### Na Yin (纳音) Quick Reference Table
Each pair in the 60-cycle shares a Na Yin:
| Pairs (0-based) | Na Yin | Element |
|---|---|---|
| 0-1 (甲子乙丑) | 海中金 | Sea Metal |
| 2-3 (丙寅丁卯) | 炉中火 | Furnace Fire |
| 4-5 (戊辰己巳) | 大林木 | Great Forest Wood |
| 6-7 (庚午辛未) | 路旁土 | Roadside Earth |
| 8-9 (壬申癸酉) | 剑锋金 | Sword Metal |
| 10-11 (甲戌乙亥) | 山头火 | Mountain Fire |
| 12-13 (丙子丁丑) | 涧下水 | Stream Water |
| 14-15 (戊寅己卯) | 城头土 | Wall Earth |
| 16-17 (庚辰辛巳) | 白蜡金 | White Wax Metal |
| 18-19 (壬午癸未) | 杨柳木 | Willow Wood |
| 20-21 (甲申乙酉) | 泉中水 | Spring Water |
| 22-23 (丙戌丁亥) | 屋上土 | Roof Earth |
| 24-25 (戊子己丑) | 霹雳火 | Thunder Fire |
| 26-27 (庚寅辛卯) | 松柏木 | Pine Wood |
| 28-29 (壬辰癸巳) | 长流水 | Long Stream Water |
| 30-31 (甲午乙未) | 砂石金 | Sand Metal |
| 32-33 (丙申丁酉) | 山下火 | Mountain Fire |
| 34-35 (戊戌己亥) | 平地木 | Flatland Wood |
| 36-37 (庚子辛丑) | 壁上土 | Wall Earth |
| 38-39 (壬寅癸卯) | 金箔金 | Gold Foil Metal |
| 40-41 (甲辰乙巳) | 覆灯火 | Lamp Fire |
| 42-43 (丙午丁未) | 天河水 | Heavenly Water |
| 44-45 (戊申己酉) | 大驿土 | Post Earth |
| 46-47 (庚戌辛亥) | 钗钏金 | Hairpin Metal |
| 48-49 (壬子癸丑) | 桑柘木 | Mulberry Wood |
| 50-51 (甲寅乙卯) | 大溪水 | Brook Water |
| 52-53 (丙辰丁巳) | 沙中土 | Sand Earth |
| 54-55 (戊午己未) | 天上火 | Heavenly Fire |
| 56-57 (庚申辛酉) | 石榴木 | Pomegranate Wood |
| 58-59 (壬戌癸亥) | 大海水 | Ocean Water |

**Formula:** Na Yin pair index = `dayIndex // 2` (0-based from the 60-cycle)

### 12 Day Officers (建除十二神)
The cycle position depends on the month branch determining the "建" position:

In month 辰 (Dragon): 辰=建, 巳=除, 午=满, 未=平, **申=定**, 酉=执, 戌=破, 亥=危, 子=成, 丑=收, 寅=开, 卯=闭

General rule: The month branch IS 建 (Establishment). Count forward from there.
- 建: Good for beginning, establishing
- **定: Good for settling, contracts, commitments**
- 执: Good for holding, maintaining
- 破: Unfavorable - avoid major activities
- 危: Caution needed
- 成: Good for completing, achieving
- 收: Good for harvesting, collecting
- 开: Good for opening, starting
- 闭: Good for closing, ending

### Sha Direction (煞方) by Day Branch
| Day Branch | 煞 Direction |
|---|---|
| 申/子/辰 | 煞南 (South) |
| 寅/午/戌 | 煞北 (North) |
| 亥/卯/未 | 煞西 (West) |
| 巳/酉/丑 | 煞东 (East) |

## Testing

```bash
python -m pytest tests/

# Verify with known historical charts
python -c "from celestial_computations import CelestialAgent; \
           a = CelestialAgent(); \
           print(a.bazi_chart(1984, 2, 4, 0))"  # Jiazi year
```

## Detailed Calculation Algorithms

### 1. Year Pillar (年柱) Calculation

Year changes at 立春 (Li Chun), NOT January 1st!

```typescript
// Year stem = ((year - 4) % 10) for 甲子 year alignment
// Year branch = ((year - 4) % 12)

function calculateYearPillar(gregorianDate: Date): Pillar {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();
    
    // CRITICAL: Check if before Li Chun (usually around Feb 4)
    const isBeforeLiChun = (month === 1) || (month === 2 && day < 4);
    const effectiveYear = isBeforeLiChun ? year - 1 : year;
    
    const stemIndex = (effectiveYear - 4) % 10;
    const branchIndex = (effectiveYear - 4) % 12;
    
    return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}
```

### 2. Month Pillar (月柱) Calculation - 五虎遁 (Five Tigers)

Month is determined by solar terms (节气), NOT by lunar calendar!

| Year Stem | Month Stem Sequence |
|-----------|-------------------|
| 甲, 己 (Jia, Ji) | 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸, 甲, 乙, 丙, 丁 |
| 乙, 庚 (Yi, Geng) | 戊, 己, 庚, 辛, 壬, 癸, 甲, 乙, 丙, 丁, 戊, 己 |
| 丙, 辛 (Bing, Xin) | 庚, 辛, 壬, 癸, 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛 |
| 丁, 壬 (Ding, Ren) | 壬, 癸, 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸 |
| 戊, 癸 (Wu, Gui) | 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸, 甲, 乙 |

Month branch always starts at 寅 (Yin) for first month:
```
正月 = 寅, 二月 = 卯, 三月 = 辰, 四月 = 巳, 五月 = 午, 六月 = 未,
七月 = 申, 八月 = 酉, 九月 = 戌, 十月 = 亥, 十一月 = 子, 十二月 = 丑
```

### 3. Day Pillar (日柱) Calculation - Sexagenary Cycle

**Use the Julian Day Number (JDN) formula — it is the most reliable method.**

```typescript
// FORMULA: dayIndex = (JDN - 11) % 60
// where index 0 = 甲子 (Jia Zi)
// This works because JDN 0 corresponds to 壬子 (Ren Zi, index 49)
// so offset = (0 - 49) % 60 = 11, hence (JDN - 11) % 60

function gregorianToJDN(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
           - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateDayPillar(targetDate: Date): Pillar {
    const jdn = gregorianToJDN(targetDate.getFullYear(), 
                                targetDate.getMonth() + 1, 
                                targetDate.getDate());
    const dayIndex = (jdn - 11) % 60;
    
    const stemIndex = dayIndex % 10;
    const branchIndex = dayIndex % 12;
    
    return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex] };
}
```

**⚠️ PITFALL: Do NOT use "Jan 1, 1900 = 甲辰 index 40" as a reference point!**
Multiple Chinese calendar sources cite conflicting anchor dates for 1900.
The JDN formula `(JDN - 11) % 60` is mathematically self-consistent and
derived from the known mapping of JDN 0 → 壬子 (index 49) in the 60-cycle.
The same formula can also be written as `(JDN + 49) % 60` since -11 ≡ 49 (mod 60).

**Verification:** Consecutive days must follow the 60-cycle sequentially:
- 2026-04-14 → 戊午 (Wu Wu), 2026-04-15 → 己未 (Ji Wei), 
  2026-04-16 → 庚申 (Geng Shen), 2026-04-17 → 辛酉 (Xin You)

### 4. Hour Pillar (时柱) Calculation - 五鼠遁 (Five Rats)

Hour branch is based on 2-hour periods starting at 23:00 (子时):
```
子时 = 23:00-01:00, 丑时 = 01:00-03:00, 寅时 = 03:00-05:00,
卯时 = 05:00-07:00, 辰时 = 07:00-09:00, 巳时 = 09:00-11:00,
午时 = 11:00-13:00, 未时 = 13:00-15:00, 申时 = 15:00-17:00,
酉时 = 17:00-19:00, 戌时 = 19:00-21:00, 亥时 = 21:00-23:00
```

Hour stem formula (五鼠遁口诀):
```
甲己还加甲 (Days of Jia/Ji: stems start at Jia)
乙庚丙作初 (Days of Yi/Geng: stems start at Bing)
丙辛从戊起 (Days of Bing/Xin: stems start at Wu)
丁壬庚子居 (Days of Ding/Ren: stems start at Geng)
戊癸何方发 (Days of Wu/Gui: stems start at Ren)
```

### 5. Hidden Stems (藏干) - Hidden Elements

Each branch contains hidden stems with intensity levels:

| Branch | Hidden Stems | Intensity |
|--------|--------------|-----------|
| 子 Zi | 癸 | Primary |
| 丑 Chou | 己, 癸, 辛 | Primary, Secondary, Tertiary |
| 寅 Yin | 甲, 丙, 戊 | Primary, Secondary, Tertiary |
| 卯 Mao | 乙 | Primary |
| 辰 Chen | 戊, 乙, 癸 | Primary, Secondary, Tertiary |
| 巳 Si | 丙, 戊, 庚 | Primary, Secondary, Tertiary |
| 午 Wu | 丁, 己 | Primary, Secondary |
| 未 Wei | 己, 丁, 乙 | Primary, Secondary, Tertiary |
| 申 Shen | 庚, 壬, 戊 | Primary, Secondary, Tertiary |
| 酉 You | 辛 | Primary |
| 戌 Xu | 戊, 辛, 丁 | Primary, Secondary, Tertiary |
| 亥 Hai | 壬, 甲 | Primary, Secondary |

### 6. Da Yun (大运) Calculation

**Direction rules:**
- Yang males and Yin females: Forward (顺排)
- Yin males and Yang females: Backward (逆排)

```typescript
// Determine direction
const isYangYear = yearStemIndex % 2 === 0; // 0, 2, 4, 6, 8 are Yang
const isMale = gender === "male";
const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
```

**Starting age:** Days to next/previous solar term divided by 3
```typescript
// 3 days = 1 year of starting age
// Each additional day = 4 months
const daysToTerm = calculateDaysToSolarTerm(birthDate, isForward);
const years = Math.floor(daysToTerm / 3);
const months = (daysToTerm % 3) * 4;
const startingAge = years + months / 12;
```

### 7. Branch Interactions

**Clashes (冲):** Opposite branches
```
子 ↔ 午, 丑 ↔ 未, 寅 ↔ 申, 卯 ↔ 酉, 辰 ↔ 戌, 巳 ↔ 亥
```

**Combinations (合):** Six combinations
```
子丑合, 寅亥合, 卯戌合, 辰酉合, 巳申合, 午未合
```

## Critical Calculation Notes

### Lunar Year Boundary (IMPORTANT)

**Pitfall**: January/February births require Lunar New Year adjustment!

```python
# Example: January 5, 1980
# Gregorian: 1980
# Chinese New Year 1980: February 16
# BEFORE CNY → still 1979 lunar year

# CORRECT:
if (month == 1) or (month == 2 and day < cny_day):
    lunar_year = year - 1
else:
    lunar_year = year

# For >YYYY-MM-DD: lunar_year = 1979 (己未 Ji Wei)
# NOT 1980 (which would be 庚申 Geng Shen)
```

### Verification Protocol

When calculating from fortune-telling documents:

1. **Extract pillars from document first** if available
2. **Verify year stem** accounts for Lunar New Year offset
3. **Cross-check day pillar** against sexagenary tables
4. **Confirm hour stem** using: `(DayStemIndex % 5) * 2 + HourBranchIndex`

### Manual Computation Mode (When Module Fails)

```python
# Standalone verification for Ding Fire Day Master
pillars = {
    "year":  ("己", "未"),   # Earth Goat
    "month": ("丙", "子"),   # Fire Rat
    "day":   ("丁", "丑"),   # Fire Ox ← Day Master
    "hour":  ("乙", "巳"),   # Wood Snake
}

ten_gods_for_ding = {
    "甲": "正印", "乙": "偏印",  # Wood produces Fire
    "丙": "劫財", "丁": "比肩",  # Same element
    "戊": "傷官", "己": "食神",  # Fire produces Earth
    "庚": "正財", "辛": "偏財",  # Fire overcomes Metal
    "壬": "正官", "癸": "七殺",  # Water attacks Fire
}

# Weak Day Master in Winter → needs Wood (印) support
```

## Integration

This skill provides structured inputs for agent decision-making:
- Temporal quality assessment
- Cyclical pattern recognition
- Celestial state encoding

Use with other agents for:
- Timing optimization
- Pattern matching across domains
- Non-Western randomness sources

## Mental Models Framework (NEW)

Derived from Five Element philosophy, 15 practical cognitive tools for decision-making:

### Wood Models (生发)
- **Growth Mindset**: Expansion is natural; obstacles redirect, not block
- **Root Before Branch**: Foundation precedes reach (本立道生)
- **Flexible Persistence**: Bend and return—resilience through adaptability

### Fire Models (炎上)
- **Controlled Burn**: Passion needs containment; burnout is boundary failure
- **Illumination Strategy**: Light dispels shadow; clarity creates accountability
- **Transformational Catalyst**: Intense periods beat gradual drift

### Earth Models (坤)
- **Container Principle**: Capacity to hold space determines value
- **Seasonal Timing**: Actions must align with natural cycles
- **Nourishing Support**: Invisible infrastructure sustains all growth

### Metal Models (从革)
- **Precise Division**: Clarity from deciding what is excluded
- **Structural Integrity**: Systems must hold form under pressure
- **Refinement Process**: Excellence through reduction, not addition

### Water Models (润下)
- **Adaptive Flow**: Take container's shape; maintain essence
- **Penetrating Insight**: Persistence beats force; depth reveals truth
- **Depth Accumulation**: Store before deploying; wisdom in stillness

### Decision Frameworks
1. **Five Element Matrix** — Multi-factor decisions across all elements
2. **Seasonal Timing** — When to act: Spring→Start, Summer→Expand, Autumn→Harvest, Winter→Store
3. **Ten God Interactions** — Relationship dynamics (印 Support, 食伤 Expression, 财 Wealth, etc.)
4. **Branch Interactions** — Clash (冲), Combine (合), Harm (害), Punishment (刑)
5. **Root and Branch Analysis** — Find leverage points, not just symptoms

### Cognitive Bias Detection
| Imbalance | Bias | Correction |
|-----------|------|------------|
| Excessive Wood | Endless growth without maintenance | Force "maintenance seasons" |
| Excessive Fire | Enthusiasm without follow-through | Implement cooling-off periods |
| Excessive Earth | Analysis paralysis | Ship at 80%, set deadlines |
| Excessive Metal | Over-elimination | 10% "inefficient" buffer |
| Excessive Water | Non-commitment disguised as flexibility | Irrevocable commitments |
| Missing Element | Blindness to weakest quality | Partner with strength in your weakness |

---

*Named in the tradition of great Latin cosmic treatises:*
*Astrum (star) + Harmonis (harmony) + Celestialis (heavenly)*
