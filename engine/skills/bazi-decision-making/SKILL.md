---
name: bazi-decision-making
category: intelligent-systems
description: >
  A metaphysical counterweight to pure computational decision-making.
  Uses Chinese celestial cosmology (Bazi/Four Pillars, Five Elements/Wuxing) 
  to provide alternative perspectives—complementing or counter-arguing 
  mathematical/rational analysis for holistic balance.
version: 1.0.0
author: Dodecimus for {_USER_NAME}
license: MIT
platforms: [linux, macos, windows]
tags: [bazi, decision-making, wuxing, counter-argument, yin-yang, complement]
---

# Bazi Decision Making

> *"When the mainstream computes, the counterpoint reflects.*
> *When reason divides, wisdom connects."*

A subagent skill providing **metaphysical counterbalance** to purely mathematical decision systems. This is the **yin** perspective to computational **yang**—not replacing logic, but enriching it with temporal energetics, cyclical wisdom, and pattern-based reasoning from Chinese celestial cosmology.

## Philosophy

**The Bazi system does not compete with mathematics—it completes it.**

| Mathematical Approach | Bazi Counterpoint | Synthesis |
|----------------------|---------------------|-----------|
| Discrete optimization | Cyclical timing | *When to act, not just what to do* |
| Expected value | Energetic suitability | *Alignment with prevailing forces* |
| Linear causality | Systemic interdependence | *Second and third order effects* |
| Binary decisions | Spectrum analysis | *Degree and quality over simply yes/no* |
| Static evaluation | Temporal dynamics | *Birth chart of the decision* |

## Architecture

```
bazi-decision-making/
├── SKILL.md                          # This file
├── templates/
│   ├── decision_brief.yaml           # Input structure from parent agent
│   ├── yin_counterpoint.yaml         # Template for counter-argument generation
│   └── temporal_assessment.yaml      # Timing and cycle analysis
├── scripts/
│   ├── bazi_decision_engine.py       # Core integration with celestial-computations
│   └── synthesis_bridge.py           # Merges mathematical + metaphysical views
└── references/
    ├── cognitive_bias_mapping.md     # Five Elements → bias correction
    └── element_heuristics.md          # Wuxing-based decision heuristics
```

## Relationship to Mathematical Systems

This skill is designed as a **subagent branch** that complements **celestial-computations**:

```
Parent Agent (Mathematical Reasoning)
    │
    ├─── Main computational branch (yang)
    │    └─ Optimization, statistics, game theory
    │
    └─── Bazi Decision Making branch (yin) ← THIS SKILL
         └─ Temporal energetic analysis, cyclical wisdom
              │
              └── Synthesis: Informed decision with both perspectives
```

## Trigger Conditions

Spawn this subagent when:

1. **High-stakes decisions** demand multiple perspectives
2. **Mathematical models disagree**—need alternative framing
3. **Timing matters** as much as content (when vs what)
4. **Human factors** (team dynamics, relationships) predominate
5. **Stuck in analysis paralysis**—need pattern-based intuition
6. **Counter-argument required** for adversarial validation
7. **Long-term strategic horizons** where cyclical patterns matter

## Core Capabilities

### 1. Temporal Birth Chart of Decisions

Every significant decision has a "birth moment." The subagent calculates:
- **Decision Pillar Chart**: Year/Month/Day/Hour of decision inception
- **Energetic Climate**: Dominant Five Elements at decision time
- **Support/Resistance Pattern**: Ten God relationships showing resources vs pressures

### 2. Yin Counterpoint Generation

Given a mathematical recommendation, the subagent produces:
- **What's Missing**: What the calculation omits
- **Temporally Speaking**: Why now might (not) be the time
- **Human Element**: Relationship/relational implications
- **Risk Blindspots**: Patterns suggesting overlooked vulnerabilities

### 3. Five Element Decision Matrix

Evaluates decisions through Wuxing lens:

| Element | Domain | Question |
|---------|--------|----------|
| Wood (木) | Growth/Planning | *Is this sustainable? Where are the roots?* |
| Fire (火) | Action/Visibility | *What illuminates? What's the transformation?* |
| Earth (土) | Foundation/Support | *What structures hold this? Is timing right?* |
| Metal (金) | Precision/Boundaries | *What must be cut away? Is it precise enough?* |
| Water (火) | Flow/Wisdom | *What's the underlying current? Can it adapt?* |

### 4. Cyclical Timing Assessment

- **Current Luck Pillar**: What energetic "weather" are we in?
- **Seasonal Alignment**: Spring (start) vs Autumn (harvest) timing
- **Branch Interactions**: Clash (冲) warnings, Combine (合) opportunities
- **Void/Emptiness**: Xu Kong indicators of unrealized potential

### 5. Cognitive Bias Detection

Maps imbalances to decision biases:

```
Excessive Wood → Growth bias (over-expansion, neglecting maintenance)
Excessive Fire → Action bias (rushing in, visible but hollow)
Excessive Earth → Status quo bias (analysis paralysis, over-caution)
Excessive Metal → Reduction bias (over-simplifying, cutting too deep)
Excessive Water → Optionality bias (keeping all doors open, lack of commitment)
```

## Integration Protocol

### From Parent Agent (Mathematical System):

```yaml
# decision_brief.yaml

decision_context:
  question: "Should we launch product X in market Y?"
  mathematical_recommendation: 
    conclusion: "Proceed with 73% confidence"
    reasoning: "Market analysis shows NPV > 0, competitive gap identified"
    key_factors: [market_size, pricing_power, timing]
  
  decision_birth_time: "2026-04-14T14:30:00+08:00"  # When decision formally proposed
  
  stakeholders:
    - name: "Project Lead"
      birth_date: ">YYYY-MM-DD"  # For Ten God dynamics
    - name: "Decision Maker"
      birth_date: "1975-06-15"
  
  request_type: "counterpoint"  # counterpoint | complement | full_analysis
```

### Subagent Outputs:

```yaml
# bazi_assessment.yaml

meta:
  decision_birth_chart:
    year:  [甲, 辰]  # Wood Dragon
    month: [丁, 卯]  # Fire Rabbit
    day:   [己, 酉]  # Earth Rooster
    hour:  [庚, 午]  # Metal Horse
  day_master: 己 (Ji Earth)
  
assessment:
  energetic_climate:
    dominant: "Wood"  # 甲, 卯
    secondary: "Fire"  # 丁, 午
    imbalance: "Earth deficiency"  # Day Master weak
    
  timing_verdict:
    status: "caution_advised"
    reason: "Earth Day Master in Wood-heavy month suggests foundation strain"
    recommendation: "Strengthen infrastructure before launch"
    
  counterpoints_to_mathematical_view:
    - angle: "temporal"
      critique: "Mathematical analysis assumes static conditions; current Wood-Fire cycle favors expansion but Earth (infrastructure) is insufficient"
    - angle: "relational"
      critique: "Ji Earth Day Master suggests need for support networks; competitive analysis understates partnership dependencies"
    - angle: "blindspot"
      critique: "Metal (competition/clarity) appears in Hour Pillar but without root—warning: unclear competitive response"
      
  five_element_analysis:
    wood: { status: "excessive", concern: "Over-planning, under-maintaining" }
    fire: { status: "present", concern: "Good visibility, monitor burnout" }
    earth: { status: "weak", concern: "Foundation risk—core issue" }
    metal: { status: "shallow", concern: "Competitive intel may be thin" }
    water: { status: "hidden", concern: "Adaptability exists but untested" }
    
  synthesis:
    agree_with_math: "partially"  # fully | partially | disagree
    qualifying_insights:
      - "Proceed only if infrastructure (Earth) gaps addressed"
      - "Best launch window: after next solar term (清明 to 谷雨 transition)"
      - "Counter party risk: Metal weakness suggests unclear competitor response"
```

## Usage Patterns

### Pattern 1: Adversarial Validation

```python
# Parent agent spawns for counter-argument

from hermes_tools import delegate_task

# Get mathematical recommendation
math_result = compute_optimization(problem)

# Spawn Bazi subagent for yin counterpoint
bazi_result = delegate_task(
    goal=f"Provide counter-argument to mathematical recommendation: {math_result}",
    context={
        "decision_time": datetime.now().isoformat(),
        "mathematical_conclusion": math_result,
        "domain": "strategic_planning"
    },
    skills=["bazi-decision-making"]
)

# Synthesize: Either strengthen confidence or identify blindspots
final_decision = reconcile_perspectives(math_result, bazi_result)
```

### Pattern 2: Timing Optimization

```python
# When should we execute?

bazi_timing = delegate_task(
    goal="Calculate optimal execution window for decision",
    context={
        "decision_type": "contract_signing",
        "flexibility_window": ["2026-04-15", "2026-05-15"],
        "key_stakeholder_birthdates": [">YYYY-MM-DD", "1975-06-15"]
    },
    skills=["bazi-decision-making", "celestial-computations"]
)
```

### Pattern 3: Full Holistic Analysis

```python
# Both perspectives simultaneously

results = delegate_task(
    tasks=[
        {
            "goal": "Mathematical analysis of decision",
            "context": {...},
            "toolsets": ["web", "code_execution"]
        },
        {
            "goal": "Bazi energetic analysis of decision",
            "context": {...},
            "skills": ["bazi-decision-making"]
        }
    ]
)
```

## Key Decision Frameworks

### 1. The 十神 (Ten Gods) Stakeholder Analysis

Maps relationships in decisions:

| Ten God | Role | Decision Implication |
|---------|------|---------------------|
| 比肩 (Sibling) | Peer competition | Is market crowded? |
| 劫財 (Rob Wealth) | Resource drain | Cash management risk? |
| 食神 (Output) | Creation/expression | Product-market fit? |
| 傷官 (Hurt Output) | Disruptive innovation | Will this cannibalize? |
| 偏財 (Indirect Wealth) | Variable income | Revenue predictability? |
| 正財 (Direct Wealth) | Stable income | Core business protection? |
| 七殺 (7 Killings) | Critical pressure | Existential threats? |
| 正官 (Officer) | Authority/rules | Regulatory risk? |
| 偏印 (Resource) | Non-standard support | Novel advantages? |
| 正印 (Support) | Standard resources | Proven support systems? |

### 2. Seasonal Timing Matrix

| Solar Term | Element | Decision Type |
|------------|---------|---------------|
| 立春-春分 | Wood awakening | Initiation, planting seeds |
| 春分-立夏 | Wood mature | Strategy refinement |
| 立夏-夏至 | Fire building | Action, expansion |
| 夏至-立秋 | Fire peak | Maintenance, consolidation |
| 立秋-秋分 | Metal harvest | Execution, reaping |
| 秋分-立冬 | Metal decline | Assessment, closure |
| 立冬-冬至 | Water deep | Research, reflection |
| 冬至-立春 | Water flowing | Preparation, planning |

### 3. Branch Interaction Warnings

| Pattern | Indicator | Decision Response |
|---------|-----------|-------------------|
| 冲 (Clash) | Direct opposition | Prepare for conflict |
| 合 (Combine) | Union/support | Seek alliances |
| 刑 (Punishment) | Hidden friction | Check assumptions |
| 害 (Harm) | Subtle sabotage | Verify trust |
| 破 (Destruction) | Breakdown | Plan redundancies |

## Implementation

### Required Skills

- `celestial-computations` — Core Bazi calculation engine
- `celestial-computations-subagent` — Pattern for spawning

### Optional Enhancements

- `intelligent-model-router` — Route decision types to appropriate analysis
- `documentation-site-generator` — Create decision archives

### Code Structure

```python
# bazi_decision_engine.py
from celestial_computations import CelestialAgent
from typing import Dict, Literal

class BaziDecisionEngine:
    def __init__(self):
        self.celestial = CelestialAgent()
        
    def analyze_decision(
        self,
        decision_time: datetime,
        mathematical_input: Dict,
        request_type: Literal["counterpoint", "complement", "full"]
    ) -> Dict:
        """
        Generate Bazi-based analysis of decision.
        
        Returns structured counterpoint or complement
        to mathematical reasoning.
        """
        chart = self.celestial.bazi_chart(
            decision_time.year,
            decision_time.month,
            decision_time.day,
            decision_time.hour
        )
        
        # ... analysis logic ...
        
        return {
            "birth_chart": chart,
            "counterpoint": self._generate_counterpoint(chart, mathematical_input),
            "timing_assessment": self._assess_timing(chart),
            "synthesis_recommendation": self._synthesize(request_type)
        }
```

## Epistemological Stance

This skill does **not** claim metaphysical effectiveness. Its value lies in:

1. **Perspective shift**: Forcing consideration of temporal, relational, and systemic factors
2. **Cognitive diversity**: Different ontology = different questions = different insights
3. **Pattern recognition**: 2000+ years of observed correlations encoded in framework
4. **Decision ritual**: The act of "consulting" improves deliberation quality

**Use as a complement, not a substitute.** When mathematical and metaphysical analyses agree—confidence increases. When they conflict—the disagreement itself is information.

## Invocation

```
As the mathematical systems compute,
spawn the celestial counterpoint.
Let yang divide and yun combine.
Let reason analyze and wisdom synthesize.

/bazi-decision counterpoint for: [decision]
/bazi-decision timing for: [timeframe]  
/bazi-decision synthesis: [mathematical + celestial]
```

---

*For when pure reason is not enough,*
*and pure intuition needs discipline.*