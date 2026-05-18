# Shunshi — Temporal Decision Intelligence

> *"顺势而为: Follow the momentum. Move with the current of time."*

A temporal decision intelligence system combining authentic Chinese metaphysics (Bazi, I Ching hexagrams, Fengshui) with a four-stage decision flow for calibrated choice-making under uncertainty.

![Status](https://img.shields.io/badge/Status-Production_Ready-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python_3-3776AB?style=for-the-badge&logo=python)
![Bazi](https://img.shields.io/badge/八字-Authentic_Calculation-d946ef?style=for-the-badge)
![Zhouyi](https://img.shields.io/badge/周易-64_Hexagrams-eab308?style=for-the-badge)

---

## What is Shunshi?

**Shunshi** (顺势) means "follow the momentum" — a Chinese principle of aligning action with the flow of time rather than forcing against it. This platform bridges classical temporal wisdom with modern decision science:

- **Celestial Computations**: Authentic Four Pillars (四柱八字) calculation with 节气 solar term precision
- **Shunshi Decision Flow**: Four-stage closed loop — calibrate → simulate → tune → verify
- **I Ching Integration**: 64 hexagrams with trigram-level computation, 错卦/互卦/变卦 derivations, 京房八宫卦 palace system, Leibniz binary mapping
- **Fengshui**: Ba Zhai (八宅) Kua number and directional analysis with 立春 boundary handling
- **Reflection Engine**: Not AI directives — structured mirrors for self-navigation

---

## Core Capabilities

### 1. Authentic Bazi Calculation

Implements the complete classical system:

| Pillar | Methodology |
|--------|-------------|
| **Year (年柱)** | 立春 boundary adjustment — year changes at solar term |
| **Month (月柱)** | 五虎遁 (Five Tigers) — 24 solar term-based authentic stem sequences |
| **Day (日柱)** | Sexagenary Cycle (六十甲子) — Fliegel & Van Flandern JDN mathematics |
| **Hour (时柱)** | 五鼠遁 (Five Rats) — 2-hour periods, stem derived from Day Master |

**Hidden Stems (藏干)**: Each branch contains primary, secondary, and tertiary hidden influences.

**Na Yin (纳音)**: Complete 30 sound-element mappings across the 60-pair sexagenary cycle.

**Da Yun (大运)**: Luck pillar calculation with forward/backward determination by gender and year stem polarity.

### 2. Shunshi Four-Stage Decision Flow

| Stage | Chinese | Mechanism |
|-------|---------|-----------|
| **1. Personal Calibration** | 个人校准 | Full Bazi with real element counts from all 4 pillars + ten-god analysis via production/control cycle logic |
| **2. Situational Simulation** | 情景模拟 | Traditional three-coin hexagram toss — 本卦 + 变卦 with correct trigram-composed binary lookup |
| **3. Environment Tuning** | 环境调优 | Kua number (八宅派) with 立春-aware date handling + directional analysis |
| **4. Intuition Verification** | 直觉确认 | Simulated 圣杯 (shengbei) three-cup confirmation ritual |

### 3. I Ching / Zhouyi (周易六十四卦)

Complete hexagram computation engine:

- **64 hexagrams** in King Wen order with Chinese names, English names, binary representation, and Unicode trigram symbols (☰☷☵☲☳☴☶☱)
- **卦辞 (Judgments)**: Classical gua-ci text for all 64 hexagrams
- **Trigram Mathematics**: 8 trigrams with element, polarity, family role, and directional mappings
- **错卦 (Opposite)**: Invert all 6 lines — complementary hexagram
- **互卦 (Nuclear)**: Extract middle 4 lines — the hidden inner hexagram
- **变卦 (Changed)**: Flip specific moving lines — the transformed outcome
- **京房八宫卦**: 8 palaces × 8 hexagrams arranged in the canonical 本宫→一世…归魂 sequence
- **Leibniz Binary**: Western binary mapping (Qian=63, Kun=0)
- **Day Pillar → Hexagram**: 4 methods — composite (stem→upper, branch→lower), stem-only, branch-only, 纳甲法

### 4. Mental Models Framework

Cognitive tools derived from Five Element philosophy:

| Element | Mental Models |
|---------|---------------|
| **Wood (木)** | Growth Mindset, Root Before Branch, Flexible Persistence |
| **Fire (火)** | Controlled Burn, Illumination Strategy, Transformational Catalyst |
| **Earth (土)** | Container Principle, Seasonal Timing, Nourishing Support |
| **Metal (金)** | Precise Division, Structural Integrity, Refinement Process |
| **Water (水)** | Adaptive Flow, Penetrating Insight, Depth Accumulation |

**Decision Frameworks**:
- Five Element Matrix for multi-factor decisions
- Seasonal Timing (Spring→Start, Summer→Expand, Autumn→Harvest, Winter→Store)
- Ten God Interactions (印 Resource, 食伤 Expression, 财 Wealth, 官 Officer, 比劫 Companion)
- Branch Interactions (冲 Clash, 合 Combine, 害 Harm, 刑 Punish)
- Cognitive Bias Detection via Element Imbalance

### 5. Daily Unified Report (Cron)

A daily cron script `kairos_daily_report.py` generates three integrated sections:

1. **Shunshi 四步决断** — Full four-stage decision flow for the day
2. **十二时辰卦象对参** — Each shichen mapped to its hexagram with:
   - Hour-stem element → Day Master interaction (比和/生我/我生/克我/我克)
   - Classical gua-ci + 象意 text for all 64 hexagrams
   - Element relationship advice per period
   - Meridian/养生 (traditional body clock) guidance per shichen
3. **全日总评** — Peak energy windows and periods requiring caution

Outputs Markdown for Telegram delivery with optional Notion upload.

---

## Architecture

```
Shunshi/
├── app/                           # Next.js 15 App Router
│   ├── api/
│   │   ├── bazi/route.ts          # POST — Bazi calculation
│   │   ├── shunshi/route.ts       # POST/GET — Four-stage decision flow
│   │   ├── hexagrams/[number]/    # GET/POST/PATCH — Hexagram CRUD
│   │   ├── astronomy/route.ts     # GET — Astronomical data
│   │   ├── celestial/route.ts     # GET — Celestial computations
│   │   ├── chat/route.ts          # POST — AI chat interface
│   │   ├── ephemeris/[planet]/    # GET — Planetary ephemeris
│   │   └── mental-models/route.ts # GET — Framework queries
│   ├── dashboard/                 # Main decision interface
│   └── report/                    # Bazi report page
├── lib/
│   ├── bazi/                      # TypeScript Bazi calculation
│   ├── celestial/                 # Hexagrams, ephemeris, time
│   ├── cycles/                    # Da Yun (大运) calculation
│   ├── interpretation/            # Report generation
│   └── mental_models/             # Cognitive frameworks
├── engine/                        # Python Computation Backend (canonical)
│   ├── celestial_computations/
│   │   ├── aether.py              # Stems (天干), Branches (地支), Phases (五行), Na Yin
│   │   ├── logos.py               # BaziCalculator, SolarTermCalculator, PlanetaryEphemeris
│   │   ├── harmon.py              # BaziAnalyzer — Ten Gods, element balance
│   │   ├── hexagram_calculator.py # 64 hexagrams + trigram math + palaces
│   │   ├── fengshui.py            # Kua number (八宅派) + directional analysis
│   │   ├── shunshi.py             # ShunShiEngine — four-stage decision flow
│   │   └── praxis.py              # CelestialAgent — unified API + CLI
│   ├── skills/                    # Hermes agent skill documents
│   └── pyproject.toml
├── scripts/
│   ├── kairos_daily_report.py     # Unified daily report (cron)
│   └── bazi_*.py                  # Bazi calculation utilities
└── public/
```

### Python Engine (Canonical Backend)

The `engine/` directory is the production-grade Python computation backend — the **canonical reference implementation** that the TypeScript frontend calls for all metaphysical calculations:

| Module | Purpose |
|--------|---------|
| `aether.py` | Cosmological constants — Stems (天干), Branches (地支), Five Phases (五行), Hidden Stems, Na Yin (纳音), Clashes (冲), Combinations (合) |
| `logos.py` | Algorithmic engine — JDN day pillar via Fliegel & Van Flandern, 五虎遁/五鼠遁, 24 solar terms, Skyfield planetary ephemeris |
| `harmon.py` | Relationship synthesis — Ten Gods (十神) with production/control cycle logic, real element counting from all 4 pillars |
| `hexagram_calculator.py` | 64 hexagrams, 错卦/互卦/变卦, 京房八宫卦, Leibniz binary, day pillar→hexagram via 4 methods |
| `fengshui.py` | Kua number calculation with 立春-aware Chinese year detection, 八宅 directional analysis |
| `shunshi.py` | Four-stage decision engine wrapping all subsystems — coin-toss hexagram + 圣杯 verification |
| `praxis.py` | CLI (`python -m celestial_computations shunshi`), CelestialAgent API, result formatting |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (React 19, App Router) |
| **Languages** | TypeScript 5.7 + Python 3.10+ |
| **Styling** | Tailwind CSS + Custom Design System |
| **Calendar** | `lunar-javascript` + JDN (Julian Day Number) mathematics |
| **Ephemeris** | Skyfield + NASA JPL DE440 |
| **UI** | shadcn/ui pattern, Lucide React icons |

---

## Installation

### Frontend (Next.js)

```bash
git clone https://github.com/0x-wzw/Shunshi.git
cd Shunshi
npm install
npm run dev
# → http://localhost:3000
```

### Python Engine

```bash
cd engine
pip install -e .
# Verify:
PYTHONPATH=. python3 -m celestial_computations bazi 2000 1 1 12
```

---

## API Usage

### Bazi Calculation

```python
from celestial_computations.logos import BaziCalculator

calc = BaziCalculator()
chart = calc.calculate(year=2000, month=1, day=1, hour=12)
# Returns FourPillars — year/month/day/hour pillars + day master
# Correctly handles 立春 (Feb 4/5 boundary) and 小寒 (Jan 6 boundary)
```

### Shunshi Decision Flow

```python
from datetime import datetime
from celestial_computations.shunshi import ShunShiEngine

engine = ShunShiEngine(datetime(1990, 5, 20, 10), gender='male')
result = engine.full_decision("Should I change jobs?")
# Returns:
#   个人校准 — Bazi + element balance + day master assessment
#   情景模拟 — coin-toss 本卦/变卦/变爻 with interpretation prompt
#   环境调优 — Kua number + best direction
#   直觉确认 — shengbei cups + pass/fail
#   综合决断 — one-line synthesis
```

### Hexagram Mathematics

```python
from celestial_computations.hexagram_calculator import HexagramCalculator

hcalc = HexagramCalculator()

# Lookup
hcalc.by_number(1)                           # 乾为天 (The Creative)
hcalc.by_binary("111111")                    # Same as above

# Relationships
hcalc.opposite(1)                             # 坤为地 (错卦 — invert all lines)
hcalc.nuclear(1)                              # 互卦 (middle 4 lines)
hcalc.changed(1, moving_lines=[2, 5])        # 变卦 (flip lines 2 and 5)

# Day pillar → hexagram
hcalc.day_pillar_to_hexagram("甲", "子", method="composite")

# Leibniz
hcalc.leibniz_number(1)                       # → 63 (binary 111111)
hcalc.from_leibniz(42)                        # → hexagram with binary 101010
```

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bazi` | Calculate Four Pillars from birth data |
| `POST` | `/api/shunshi` | Full four-stage decision flow |
| `GET` | `/api/shunshi?action=hexagram` | Coin-toss hexagram reading |
| `GET` | `/api/hexagrams/:number` | Hexagram with opposite + nuclear |
| `POST` | `/api/hexagrams/transform` | Changed hexagram from moving lines |
| `PATCH` | `/api/hexagrams/temporal` | Temporal hexagram by date/hour |
| `GET` | `/api/ephemeris/:planet` | Planetary ephemeris data |
| `GET` | `/api/astronomy` | Astronomical computations |
| `GET` | `/api/celestial` | Celestial computation queries |
| `GET` | `/api/mental-models` | Five-element mental model frameworks |
| `POST` | `/api/chat` | AI chat with metaphysics context |

### CLI

```bash
cd engine

# Bazi chart
PYTHONPATH=. python3 -m celestial_computations bazi 2000 1 1 12

# Shunshi full decision
PYTHONPATH=. python3 -m celestial_computations shunshi 1990 5 20 10 male "Should I move?"

# Hexagram lookup
PYTHONPATH=. python3 -m celestial_computations hexagram 1
```

---

## Philosophy

> *"This tool is designed for Reflection and Intelligence Support only. It does not provide definitive predictions or directive advice. Users are encouraged to use these insights as mirrors for self-reference in their daily choice architecture."*

**Shunshi ≠ Fortune Telling**

The goal is **temporal calibration** — understanding when conditions favor:
- **Initiating** (Wood/Spring energy)
- **Expanding** (Fire/Summer energy)
- **Consolidating** (Metal/Autumn energy)
- **Resting/Planning** (Water/Winter energy)

---

## License

MIT © 2025–2026 0x-wzw

*Shunshi (顺势) · Authentic 八字 Calculation · 64 Hexagrams · Temporal Calibration*
