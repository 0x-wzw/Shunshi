# Shunshi — Temporal Decision Intelligence

> *"顺势而为: Follow the momentum. Move with the current of time."*

A temporal decision intelligence system combining authentic Chinese metaphysics (Bazi, I Ching hexagrams, Fengshui) with a four-stage decision flow for calibrated choice-making under uncertainty.

![Status](https://img.shields.io/badge/Status-Production_Ready-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?style=for-the-badge&logo=typescript)
![Bazi](https://img.shields.io/badge/八字-Authentic_Calculation-d946ef?style=for-the-badge)

---

## What is Shunshi?

**Shunshi** (顺势) means "follow the momentum" — a Chinese principle of aligning action with the flow of time rather than forcing against it. This platform bridges classical temporal wisdom with modern decision science:

- **Celestial Computations**: Authentic Four Pillars (四柱八字) calculation with solar term precision
- **Shunshi Decision Flow**: Four-stage closed loop — calibrate → simulate → tune → verify
- **I Ching Integration**: 64 hexagrams with complete trigram-level computation, opposite/nuclear/changed derivations
- **Fengshui**: Ba Zhai (八宅) Kua number and directional analysis with 立春 boundary handling
- **Reflection Engine**: Not AI directives, but structured mirrors for self-navigation

---

## Core Capabilities

### 1. Authentic Bazi Calculation

Implements the complete classical system:

| Pillar | Methodology |
|--------|-------------|
| **Year (年柱)** | 立春 (Li Chun) boundary adjustment — year changes at solar term |
| **Month (月柱)** | 五虎遁 (Five Tigers) — 24 solar term-based, authentic stem sequences |
| **Day (日柱)** | Sexagenary Cycle (六十甲子) — Julian Day mathematics |
| **Hour (时柱)** | 五鼠遁 (Five Rats) — 2-hour periods, stem derived from Day Master |

**Hidden Stems (藏干)**: Each branch contains primary, secondary, and tertiary hidden influences.

**Da Yun (大运)**: Complete luck pillar calculation with forward/backward determination by gender and year element polarity.

### 2. Shunshi Four-Stage Decision Flow

| Stage | Chinese | Mechanism |
|-------|---------|-----------|
| **1. Personal Calibration** | 个人校准 | Full Bazi with real element counts and ten-god analysis |
| **2. Situational Simulation** | 情景模拟 | Traditional three-coin hexagram toss (本卦 + 变卦) |
| **3. Environment Tuning** | 环境调优 | Kua number + 八宅 directional analysis |
| **4. Intuition Verification** | 直觉确认 | Simulated 圣杯 (shengbei) three-cup confirmation |

### 3. Mental Models Framework

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
- Ten God Interactions (印 Support, 食伤 Expression, 财 Wealth, etc.)
- Branch Interactions (冲 Clash, 合 Combine, 害 Harm, 刑 Punish)
- Cognitive Bias Detection via Element Imbalance

### 4. Hourly Choice Engine

Bazi-synchronized recommendations across all 12 shichen (时辰):

```
子时 23:00-01:00  丑时 01:00-03:00  寅时 03:00-05:00  卯时 05:00-07:00
辰时 07:00-09:00  巳时 09:00-11:00  午时 11:00-13:00  未时 13:00-15:00
申时 15:00-17:00  酉时 17:00-19:00  戌时 19:00-21:00  亥时 21:00-23:00
```

Each hour evaluated against:
- Day Master (Day Pillar stem)
- Current luck pillar
- Seasonal strength
- Branch interactions

---

## Architecture

```
Shunshi/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes (bazi, hexagrams, shunshi, fengshui)
│   ├── dashboard/         # Main decision interface
│   └── report/            # Bazi report page
├── lib/
│   ├── bazi/              # TypeScript Bazi calculation
│   ├── celestial/         # Hexagrams, ephemeris, time
│   ├── cycles/            # Da Yun (大运) calculation
│   ├── interpretation/    # Report generation
│   └── mental_models/     # Cognitive frameworks
├── engine/                # Python Celestial Computation Backend (canonical)
│   ├── celestial_computations/
│   │   ├── aether.py      # Constants: Stems, Branches, Phases
│   │   ├── logos.py       # Algorithms: BaziCalculator, SolarTerms
│   │   ├── harmon.py      # Relations: Ten Gods, element balance
│   │   ├── hexagram_calculator.py  # 64 hexagrams + trigram math
│   │   ├── fengshui.py    # Kua number + directional analysis
│   │   ├── shunshi.py     # ShunShiEngine: four-stage decision flow
│   │   └── praxis.py      # CelestialAgent: unified API + CLI
│   └── pyproject.toml
├── scripts/
│   └── kairos_daily_report.py  # Unified daily report (Shunshi + shichen + meridian)
└── public/
```

### Engine (Python Backend)

The `engine/` directory contains the production-grade Python computation backend — the canonical reference implementation:

| Module | Purpose |
|--------|---------|
| `aether.py` | Cosmological constants — Stems (天干), Branches (地支), Five Phases (五行) |
| `logos.py` | Algorithmic engine — JDN day pillar, 五虎遁, 五鼠遁, solar terms |
| `harmon.py` | Relationship synthesis — Ten Gods (十神), element balance |
| `hexagram_calculator.py` | 64 hexagrams, trigram math, 错卦/互卦/变卦, 京房八宫卦 |
| `fengshui.py` | Kua number (八宅派), directional analysis |
| `shunshi.py` | Four-stage decision engine wrapping all subsystems |
| `praxis.py` | CLI, agent API, formatting |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (React 19, App Router) |
| **Language** | TypeScript 5.7 + Python 3 |
| **Styling** | Tailwind CSS + Custom Design System |
| **Calendar** | `lunar-javascript` + JDN mathematics |
| **Ephemeris** | Skyfield + JPL DE440 |
| **UI Components** | shadcn/ui pattern |
| **Icons** | Lucide React |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/0x-wzw/Shunshi.git
cd Shunshi

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

---

## API Usage

### Bazi Calculation

```python
from celestial_computations.logos import BaziCalculator

calc = BaziCalculator()
chart = calc.calculate(year=2000, month=1, day=1, hour=12)
# Returns FourPillars with year/month/day/hour pillars + day master
```

### Shunshi Decision Flow

```python
from datetime import datetime
from celestial_computations.shunshi import ShunShiEngine

engine = ShunShiEngine(datetime(1990, 5, 20, 10), gender='male')
result = engine.full_decision("Should I change jobs?")
# Returns complete four-stage output: calibration + hexagram + fengshui + shengbei
```

### Hexagram Reading

```python
from celestial_computations.hexagram_calculator import HexagramCalculator

hcalc = HexagramCalculator()
hexagram = hcalc.by_number(1)          # 乾为天
opposite = hcalc.opposite(hexagram)    # 坤为地 (错卦)
nuclear  = hcalc.nuclear(hexagram)     # 互卦
```

### REST API

```
POST /api/bazi      — Calculate Four Pillars
GET  /api/hexagrams/:number  — Get hexagram with opposite/nuclear
POST /api/shunshi   — Full four-stage decision flow
GET  /api/shunshi?action=hexagram  — Coin-toss hexagram only
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

*Shunshi (顺势) · Authentic 八字 Calculation · Temporal Calibration*
