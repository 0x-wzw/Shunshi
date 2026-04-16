# Kairos Engine — Celestial Computation Backend

> *"Astrum Harmonis Celestialis"*

Python computation engine for the Kairos platform. Implements authentic Chinese celestial cosmology:

- **Bazi (八字)** — Four Pillars with JDN day pillar, 五虎遁/五鼠遁 stem derivations, solar term boundaries
- **Zhouyi (周易)** — 64 hexagram binary system, moving lines, nuclear/opposite relationships
- **Celestial Mechanics** — Planetary ephemeris via Skyfield, solar terms, lunar phases

## Quick Start

```bash
cd engine
pip install -e ".[dev]"

# CLI
python -m celestial_computations bazi 1980 1 5 10

# Bi-hourly reports
python scripts/bazi_bihourly.py       # English
python scripts/bazi_bihourly_cn.py   # 中文
```

## Architecture

```
celestial_computations/
├── aether.py    — Constants: Stems, Branches, Five Phases, mappings
├── logos.py     — Algorithms: BaziCalculator, SolarTerms, Ephemeris
├── harmon.py    — Relations: Ten Gods, Branch Interactions, Hexagrams
└── praxis.py    — Interface: CelestialAgent API, CLI, formatting

scripts/
├── bazi_bihourly.py      — English bi-hourly transit vs natal report
└── bazi_bihourly_cn.py   — 中文双时辰对参

skills/
├── celestial-computations-subagent/  — Hermes agent subagent pattern
└── bazi-decision-making/             — Metaphysical decision counterweight
```

## Malaysia Timezone Note

Births before 1982-01-01 in Malaysia use **UTC+7:30** (MYT), not the current UTC+8.

## Testing

```bash
pytest tests/ -v
```