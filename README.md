# Kairos — Temporal Decision Intelligence

> *"Καιρός: The right, critical, or opportune moment to act."*

A temporal decision intelligence system combining authentic Chinese metaphysics (BaZi/Four Pillars) with modern mental models for calibrated choice-making under uncertainty.

![Status](https://img.shields.io/badge/Status-Production_Ready-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?style=for-the-badge&logo=typescript)
![Bazi](https://img.shields.io/badge/八字-Authentic_Calculation-d946ef?style=for-the-badge)

---

## What is Kairos?

**Kairos** (καιρός) distinguishes between *chronos* (quantitative clock time) and *kairos* (qualitative opportune time). This platform bridges classical temporal wisdom with modern decision science:

- **Celesial Computations**: Authentic Four Pillars (四柱八字) calculation with solar term precision
- **Decision Frameworks**: 15 mental models from Five Element philosophy for cognitive calibration
- **Hourly Timing**: Bazi-synchronized recommendations following 时辰 energy flows
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

**Hidden Stems (藏干)**: Each branch contains primary, secondary, and tertiary hidden influences with weighted intensity calculations.

**Da Yun (大运)**: Complete luck pillar calculation with forward/backward determination by gender and year element polarity.

### 2. Mental Models Framework

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

### 3. Hourly Choice Engine

Bazi-synchronized recommendations:

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
Kairos/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes for Bazi calculation
│   ├── dashboard/         # Main decision interface
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── bazi/              # Four Pillars visualization
│   ├── charts/            # Elemental balance displays
│   └── mental-models/     # Decision framework components
├── lib/
│   ├── bazi/              # Core calculation engine
│   │   ├── calculator.ts  # Four Pillars mathematics
│   │   ├── hidden-stems.ts
│   │   ├── luck-pillars.ts
│   │   └── ten-gods.ts
│   ├── mental_models/     # Cognitive frameworks
│   │   ├── frameworks.ts  # Elemental mental models
│   │   ├── utils.ts       # Utility functions
│   │   └── index.ts       # Module exports
│   └── utils/
├── types/
│   └── bazi.ts            # TypeScript definitions
└── public/
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (React 19, App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 + Custom Design System |
| **Calendar** | `lunar-javascript` for Solar-Lunar conversion |
| **UI Components** | shadcn/ui pattern |
| **Icons** | Lucide React |
| **State** | React Server Components + Server Actions |

**Design Philosophy**: "Notion × Stripe" aesthetic
- Neutral palette (`#F8FAFC`) with white cards
- Muted gold (`#C8A75B`) accents for data visualization
- Generous spacing, refined typography (Inter)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/0x-wzw/Kairos.git
cd Kairos

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

---

## API Usage

### Calculate Four Pillars

```typescript
import { calculateBazi } from '@/lib/bazi/calculator';

const chart = calculateBazi({
  ># year: from user profile
  month: 1,
  day: 5,
  hour: 10,
  gender: 'male'
});

// Returns complete Four Pillars with:
// - Year/Month/Day/Hour pillars
// - Hidden stems
// - Five element balance
// - Day Master strength
// - Luck pillars
```

### Get Mental Models

```typescript
import { getRelevantMentalModels } from '@/lib/mental_models';

const models = getRelevantMentalModels('FIRE', ['decision', 'growth']);
// Returns mental models filtered by element and tags
```

### Hourly Recommendation

```typescript
import { getHourlyGuidance } from '@/lib/bazi/hourly';

const guidance = getHourlyGuidance({
  birthChart: userChart,
  currentTime: new Date()
});
// Returns current hour assessment vs Day Master
```

---

## Philosophy

> *"This tool is designed for Reflection and Intelligence Support only. It does not provide definitive predictions or directive advice. Users are encouraged to use these insights as mirrors for self-reference in their daily choice architecture."*

**Kairos ≠ Fortune Telling**

The goal is **temporal calibration** — understanding when conditions favor:
- **Initiating** (Wood/Spring energy)
- **Expanding** (Fire/Summer energy)
- **Consolidating** (Metal/Autumn energy)
- **Resting/Planning** (Water/Winter energy)

---

## Related Projects

- **[Celestial Computations](https://github.com/hermes/skills)** — Standalone Bazi calculation library
- **[Bazi Decision Making](https://github.com/hermes/skills)** — Metaphysical counterweight to pure computational decisions

---

## License

MIT © 2025 0x-wzw

*Powered by BaZi Decision Intelligence • Authentic 八字 Calculation • Temporal Calibration*