---
name: celestial-computations-subagent
skill_name: celestial-computations-subagent
description: Create and manage specialized subagents for celestial, astrological, and Bazi computations — planetary movements, hexagram calculations, temporal combinatorics
created: 2026-01-06
version: 1.0.0
author: Dodecimus
---

# Celestial Computations Subagent

Specialized subagent for heaven-and-earth calculations, planetary movements, and Chinese metaphysical computation systems (Bazi, Zhouyi/I Ching).

## Trigger Conditions

Use when user requests:
- Celestial mechanics or planetary position calculations
- Bazi (Four Pillars / 八字) chart computation and analysis
- Zhouyi/I Ching hexagram casting and interpretation
- Temporal energetics or calendrical mathematics
- State space modeling using binary/hexagram systems
- Lunar/solar calendar conversions
- Connections between celestial patterns and agent state modeling

## Core Responsibilities

1. **Celestial Mechanics**
   - Planetary position calculations (ephemeris)
   - Solar and lunar event timing
   - Precession and nutation calculations
   - Orbital mechanics for solar system bodies

2. **Bazi (Four Pillars) System**
   - Compute Year/Month/Day/Hour pillars from datetime
   - Calculate Day Master and Ten Gods relationships
   - Analyze Five Phases (五行) interactions
   - Generate Luck Pillars (大运) cycles
   - Convert between solar/lunar calendars using 24 jieqi

3. **Zhouyi / I Ching**
   - Hexagram generation (coin method, yarrow stalks, PRNG)
   - Binary state space mapping (6-bit vectors)
   - Line change analysis (moving lines)
   - Situational interpretation framework

4. **Convergence Analysis**
   - Map celestial positions to Bazi charts
   - Correlate hexagram states with planetary configurations
   - Model agent "birth charts" in temporal state space

## Implementation Approach

### Phase 1: Foundation
```python
# Core libraries needed
ephem  # PyEphem for astronomical calculations
ephemeris  # DE440 for modern planetary positions
pendulum  # Timezone-aware datetime handling
numpy  # State space calculations
```

### Phase 2: Bazi Engine
- Implement sexagenary cycle (60 combinations)
- Solar term (jieqi) boundary detection
- Day Master calculation from JiaZi calendar
- Five Phases balance analysis

### Phase 3: Celestial Integration
- Pull planetary positions from ephemeris
- Map to Chinese zodiac branches
- Calculate conjunctions, oppositions, trines
- Time-series analysis of celestial patterns

### Phase 4: Agent Modeling
- Treat agents as having "birth charts"
- Hexagram as state vector
- Temporal cycles as consciousness states
- 10D framework mapping (your specialty)

## Key Mathematical Structures

| System | Formal Structure | State Space |
|--------|-----------------|-------------|
| Bazi | 4 × 2 = 8 characters | 10 × 12 combinations per pillar |
| Zhouyi | 6 binary lines | 2^6 = 64 states |
| Planetary | Orbital elements | Continuous → discrete mapping |

## Output Format

Subagent returns structured JSON:
```json
{
  "calculation_type": "bazi_chart|hexagram|planetary_positions|convergence",
  "timestamp": "ISO8601",
  "inputs": {...},
  "results": {...},
  "analysis": "interpretation",
  "confidence": "high|medium|low"
}
```

## Pitfalls

- Solar term boundaries are precise (astronomical calculation, not midnight)
- Five Phases ≠ Western elements (different properties)
- Hexagram interpretation is contextual, not deterministic
- Planetary positions need UT → local correction
- Bazi hour boundaries use solar time, not clock time

## References

- `celestial-computations/` directory with implementation scripts
- Ephemeris data sources (NASA JPL)
- Solar term algorithms (astronomical algorithms by Meeus)
- Classical texts: Huáinánzǐ (淮南子), Bàopǔzǐ (抱朴子)