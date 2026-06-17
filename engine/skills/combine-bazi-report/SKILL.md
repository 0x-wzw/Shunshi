---
name: combine-bazi-report
category: celestial-computations
description: >
  Generate dual-layer Bazi alignment reports combining a personal birth chart 
  (本命局) with current celestial state (流运) for personalized daily guidance.
version: 1.0.0
author: Dodecimus
trigger: User asks to "combine" birth chart with current day, or check alignment 
         between personal chart and today's energy.
---

# Combine Bazi Report Skill

Generate personalized dual-layer Bazi alignment reports showing how current 
celestial energies interact with your birth chart.

## Overview

**Layer 1 (本命局)**: Your personal Four Pillars birth chart
**Layer 2 (流运)**: Current Year/Month/Day celestial state
**Output**: Interlayer relationship analysis + actionable guidance

## Prerequisites

- User's birth chart data (stored in memory or provided)
- celestial-computations skill installed
- Manual verification capability (library may return incorrect values)

## Procedure

### Step 1: Retrieve Birth Chart

From user memory or ask for:
- Birth date/time/location
- Four pillars (年柱, 月柱, 日柱, 时柱)
- Current 大运 (Luck Pillar age range)

Typical memory format:
```
BIRTH_CHART = {
    "name": "...",
    "birth": "YYYY-MM-DD HH:MM",
    "location": "...",
    "pillars": {
        "year": ("干", "支"),
        "month": ("干", "支"),
        "day": ("干", "支"),  # ← Day Master here
        "hour": ("干", "支")
    },
    "day_master": "丁火",
    "luck_pillar": "辛未",
    "luck_age_range": "44-54"
}
```

### Step 2: Calculate Current Celestial State

```python
from celestial_computations.logos import BaziCalculator
from datetime import datetime

calc = BaziCalculator()
today = datetime.now()

# PRIMARY METHOD: Use library
chart = calc.calculate(day, month, year, 12)
year_pillar = (chart.year_pillar[0].character, chart.year_pillar[1].character)
month_pillar = (chart.month_pillar[0].character, chart.month_pillar[1].character)
day_pillar = (chart.day_pillar[0].character, chart.day_pillar[1].character)
```

**⚠️ VERIFICATION REQUIRED**: Library may return incorrect values. Always verify:

### Step 3: Verify Day Pillar with JDN Formula

```python
def gregorian_to_jdn(year, month, day):
    a = (14 - month) // 12
    y = year + 4800 - a
    m = month + 12 * a - 3
    return day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045

jdn = gregorian_to_jdn(2026, 4, 25)
day_index = (jdn - 11) % 60  # 0 = 甲子

STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

verified_day_stem = STEMS[day_index % 10]
verified_day_branch = BRANCHES[day_index % 12]

# If library result != verified result, use verified
```

### Step 4: Build Current State

```python
CURRENT_STATE = {
    "date": "YYYY-MM-DD",
    "lunar": "...",  # from lunardate
    "solar_term": "...",  # e.g. 谷雨
    "year_pillar": year_pillar,
    "month_pillar": month_pillar,
    "day_pillar": (verified_day_stem, verified_day_branch)
}
```

### Step 5: Interlayer Analysis

#### 5a. Day Master → Day Stem (十神关系)

```python
# Ten Gods lookup for each Day Master
TEN_GODS = {
    '甲': {'甲':'比肩', '乙':'劫财', '丙':'食神', '丁':'伤官', '戊':'偏财', '己':'正财', '庚':'七杀', '辛':'正官', '壬':'偏印', '正印':''},
    '乙': {'甲':'劫财', '乙':'比肩', '丙':'伤官', '丁':'食神', '戊':'正财', '己':'偏财', '庚':'正官', '辛':'七杀', '壬':'正印', '癸':'偏印'},
    '丙': {'甲':'偏印', '乙':'正印', '丙':'比肩', '丁':'劫财', '戊':'食神', '己':'伤官', '庚':'偏财', '辛':'正财', '壬':'七杀', '癸':'正官'},
    '丁': {'甲':'正印', '乙':'偏印', '丙':'劫财', '丁':'比肩', '戊':'伤官', '己':'食神', '庚':'正财', '辛':'偏财', '壬':'正官', '癸':'七杀'},
    '戊': {'甲':'七杀', '乙':'正官', '丙':'偏印', '丁':'正印', '戊':'比肩', '己':'劫财', '庚':'食神', '辛':'伤官', '壬':'偏财', '癸':'正财'},
    '己': {'甲':'正官', '乙':'七杀', '丙':'正印', '丁':'偏印', '戊':'劫财', '己':'比肩', '庚':'伤官', '辛':'食神', '壬':'正财', '癸':'偏财'},
    '庚': {'甲':'偏财', '乙':'正财', '丙':'七杀', '丁':'正官', '戊':'偏印', '己':'正印', '庚':'比肩', '辛':'劫财', '壬':'食神', '癸':'伤官'},
    '辛': {'甲':'正财', '乙':'偏财', '丙':'正官', '丁':'七杀', '戊':'正印', '己':'偏印', '庚':'劫财', '辛':'比肩', '壬':'伤官', '癸':'食神'},
    '壬': {'甲':'食神', '乙':'伤官', '丙':'偏财', '丁':'正财', '戊':'七杀', '己':'正官', '庚':'偏印', '辛':'正印', '壬':'比肩', '癸':'劫财'},
    '癸': {'甲':'伤官', '乙':'食神', '丙':'正财', '丁':'偏财', '戊':'正官', '己':'七杀', '庚':'正印', '辛':'偏印', '壬':'劫财', '癸':'比肩'}
}

dm = birth_chart['day_master'][0]  # First char
current_stem = current_state['day_pillar'][0]
relationship = TEN_GODS[dm][current_stem]
```

Ten God meanings:
- **比肩/劫财**: Peer energy — collaboration or competition
- **食神/伤官**: Output expression — creativity, teaching, consumption
- **正财/偏财**: Wealth acquisition — income, investments, resources
- **正官/七杀**: Authority structure — rules, leadership, pressure
- **正印/偏印**: Resource support — learning, mentorship, rest

#### 5b. Branch Interactions

```python
BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

# Check relationships
your_day_branch = birth_chart['pillars']['day'][1]
your_hour_branch = birth_chart['pillars']['hour'][1]
today_branch = current_state['day_pillar'][1]

# Self-resonance
if your_day_branch == today_branch:
    relation = "伏吟 (Self-resonance) — Internal reflection, avoid major decisions"

# Six Clash (6 apart in cycle)
clash_map = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
    '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
}
if clash_map[your_day_branch] == today_branch:
    relation = "六冲 (Clash) — Transformational tension, change is forced"

# Hour Pillar resonance
if your_hour_branch == today_branch:
    relation = "时柱伏吟 — Deep thinking, introspection, hourly energy mirroring"

# Partial combinations
combinations = {
    '丑巳': '巳丑拱合金 — Partial Metal frame forms',
    '巳丑': '巳丑拱合金 — Partial Metal frame forms',
}
pair = your_day_branch + today_branch
if pair in combinations:
    relation = combinations[pair]
```

#### 5c. Luck Pillar Interaction

```python
# Compare current Luck Pillar with Year/Month/Day
luck_stem, luck_branch = birth_chart['luck_pillar']
year_stem, year_branch = current_state['year_pillar']

# Heaven combination
if (luck_stem == '辛' and year_stem == '丙') or (luck_stem == '丙' and year_stem == '辛'):
    print("丙辛合水 — Annual energy transforms Luck Pillar output")

# Earth combination  
if (luck_branch == '未' and year_branch == '午') or (luck_branch == '午' and year_branch == '未'):
    print("午未合 — Earth combination, people harmony, partnership luck")

# Luck Pillar matches Day
if luck_pillar == today_pillar:
    print("大运日伏吟 — Strong resonance, major decisions favored")
```

### Step 6: Generate Report

Structure:
1. **Header**: Title, generation time
2. **Layer 1**: Birth chart table (四柱)
3. **Layer 2**: Current state (流年/流月/流日)
4. **Alignment Analysis**: 
   - 日主交互 (Day Master + Current stem → Ten God)
   - 地支交互 (Branch relationships)
   - 大运交互 (Luck Pillar alignments)
5. **Synthesis**: Energy rating (上吉/中吉/平/下)
6. **Actionable Guidance**: Today's should/shouldn't + tips
7. **Preview**: Next 3-4 days forecast

### Step 7: Rating System

- **★★★★★ 上吉**: Favorable stem (印/比劫 output), supporting branches, no clashes
- **★★★★☆ 吉**: Productive energy, minor neutral factors
- **★★★☆☆ 平**: Mixed signals, proceed with awareness
- **★★☆☆☆ 一般**: Challenging stem (官杀 overwhelming), cautious progress
- **★☆☆☆☆ 下**: Multiple clashes, defer major decisions

## Sample Output Format

```
╔════════════════════════════════════════════════════════════╗
║         🔯  双 层 命 盘 对 齐 报 告  🔯                     ║
╚════════════════════════════════════════════════════════════╝

【第一层】个 人 命 盘  (LAYER 1: Personal Birth Chart)
  ┌────────┬────────┬────────┬────────┐
  │ 年柱    │ 月柱    │ 日柱    │ 时柱    │
  │ {?}    │ {?}    │ {?}    │ {?}    │
  │ ???    │ ???    │ ???    │ ???    │
  └────────┴────────┴────────┴────────┘
  ★ 大运: 从用户资料自动计算 (示例值仅供演示)

【第二层】当 前 天 象  (LAYER 2: Current Celestial State)
  ┌────────┬────────┬────────┐
  │ 流年    │ 流月    │ 流日    │
  │ 丙午   │ 壬辰   │ 己巳   │
  └────────┴────────┴────────┘

【对 齐 分 析】
🔥 日主交互: 丁火 → 己 = ⚡ 食神相见 (才华输出日)
🌿 地支交互: 丑(你) + 巳(日) = 巳丑拱合金 (暗财)
🌟 伏吟: 时柱巳与今日巳共振 (思维活跃)

【评级】★★★★★ 上吉 (Highly Favorable)

【建议】
✓ 创作、教学、技术展示
✗ 过度承诺、财务投机

【未来4日】
4/25 己巳 ★★★★★ 食神日 (今天)
4/26 庚午 ★★★★☆ 正财日
4/27 辛未 ★★★★☆ 偏财日 ← 大运重合
4/28 壬申 ★★★☆☆ 正官日
```

## Pitfalls

1. **Library accuracy**: Always verify day pillars with JDN formula
2. **Solar term drift**: Month pillars change at solar terms, not calendar months
3. **Timezone matters**: Pre-1982 Malaysian time was UTC+7:30, not +8
4. **Hour stem**: Use 五鼠遁 formula: Stem index = (DayStem % 5) × 2 + HourBranch
5. **Lunar year**: Jan/Feb births may belong to previous Chinese year

## Testing

Verify against known dates:
- 2026-04-14 → 戊午 (not library's 乙酉)
- 2026-04-15 → 己未
- 2026-04-25 → 己巳

## Integration

Use this skill to:
- Generate daily Telegram reports with personalized guidance
- Identify favorable windows for specific activities (签约/创作/休息)
- Track multi-day alignment patterns for strategic planning
- Correlate with other signal systems (prediction markets, etc.)
