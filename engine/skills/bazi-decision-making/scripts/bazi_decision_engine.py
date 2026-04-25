#!/usr/bin/env python3
"""
Bazi Decision Engine

A decision-making subagent that provides metaphysical counterbalance
to purely mathematical/computational analysis using Chinese celestial
cosmology (Bazi/Four Pillars, Five Elements/Wuxing).

Usage:
    python bazi_decision_engine.py --brief decision_brief.yaml
    python bazi_decision_engine.py --mode counterpoint --datetime "2026-04-14T14:30:00+08:00"
"""

import argparse
import yaml
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Literal
from dataclasses import dataclass, asdict
import sys

# Ensure celestial-computations is available
try:
    from celestial_computations import CelestialAgent
except ImportError:
    print("Error: celestial-computations skill required.")
    print("Ensure ~/.hermes/skills/celestial-computations is installed.")
    sys.exit(1)


@dataclass
class ElementalClimate:
    """Five Elements distribution in a Bazi chart."""
    wood: int = 0
    fire: int = 0
    earth: int = 0
    metal: int = 0
    water: int = 0
    
    def dominant(self) -> tuple:
        """Return (element, count) of dominant element."""
        elems = {
            'wood': self.wood, 'fire': self.fire, 'earth': self.earth,
            'metal': self.metal, 'water': self.water
        }
        return max(elems.items(), key=lambda x: x[1])
    
    def weakest(self) -> tuple:
        """Return (element, count) of weakest element."""
        elems = {
            'wood': self.wood, 'fire': self.fire, 'earth': self.earth,
            'metal': self.metal, 'water': self.water
        }
        return min(elems.items(), key=lambda x: x[1])


class BaziDecisionEngine:
    """
    Engine for generating metaphysical counterpoints to mathematical analysis.
    """
    
    # Elemental mapping for stems
    STEM_ELEMENTS = {
        '甲': 'wood', '乙': 'wood',
        '丙': 'fire', '丁': 'fire',
        '戊': 'earth', '己': 'earth',
        '庚': 'metal', '辛': 'metal',
        '壬': 'water', '癸': 'water'
    }
    
    # Elemental mapping for branches (primary)
    BRANCH_ELEMENTS = {
        '寅': 'wood', '卯': 'wood',
        '巳': 'fire', '午': 'fire',
        '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
        '申': 'metal', '酉': 'metal',
        '亥': 'water', '子': 'water'
    }
    
    # Season mapping for branches
    BRANCH_SEASONS = {
        '寅': 'spring', '卯': 'spring', '辰': 'spring',
        '巳': 'summer', '午': 'summer', '未': 'summer',
        '申': 'autumn', '酉': 'autumn', '戌': 'autumn',
        '亥': 'winter', '子': 'winter', '丑': 'winter'
    }
    
    # Production cycle (supporting relationships)
    PRODUCES = {
        'wood': 'fire', 'fire': 'earth', 'earth': 'metal',
        'metal': 'water', 'water': 'wood'
    }
    
    # Destruction cycle (controlling relationships)
    DESTROYS = {
        'wood': 'earth', 'earth': 'water', 'water': 'fire',
        'fire': 'metal', 'metal': 'wood'
    }
    
    # Cognitive bias mapping
    BIAS_MAP = {
        'wood_excessive': {
            'bias': 'Growth Bias',
            'description': 'Tendency toward expansion without sufficient maintenance',
            'correction': 'Force maintenance seasons; plan for consolidation phases'
        },
        'fire_excessive': {
            'bias': 'Action Bias',
            'description': 'Preference for visible action over quiet preparation',
            'correction': 'Implement cooling-off periods; value invisible work'
        },
        'earth_excessive': {
            'bias': 'Analysis Paralysis',
            'description': 'Over-caution and excessive deliberation',
            'correction': 'Ship at 80%; set irreversible deadlines'
        },
        'metal_excessive': {
            'bias': 'Over-Reduction',
            'description': 'Excessive simplification, cutting too deeply',
            'correction': 'Maintain 10% inefficiency buffer'
        },
        'water_excessive': {
            'bias': 'Optionality Trap',
            'description': 'Keeping all doors open, avoiding commitment',
            'correction': 'Make small irrevocable commitments'
        },
        'wood_deficient': {
            'bias': 'Stagnation Bias',
            'description': 'Resistance to growth and new directions',
            'correction': 'Schedule exploratory phases'
        },
        'fire_deficient': {
            'bias': 'Visibility Avoidance',
            'description': 'Avoiding necessary communication and presence',
            'correction': 'Build in communication checkpoints'
        },
        'earth_deficient': {
            'bias': 'Foundation Neglect',
            'description': 'Building without adequate support structures',
            'correction': 'Audit infrastructure before scaling'
        },
        'metal_deficient': {
            'bias': 'Precision Avoidance',
            'description': 'Fuzzy boundaries and unclear commitments',
            'correction': 'Define precise success/failure criteria'
        },
        'water_deficient': {
            'bias': 'Rigidity',
            'description': 'Inability to adapt to changing conditions',
            'correction': 'Build in flexibility review points'
        }
    }
    
    def __init__(self):
        self.celestial = CelestialAgent()
    
    def analyze_decision(
        self,
        decision_time: datetime,
        mathematical_input: Optional[Dict] = None,
        request_type: Literal["counterpoint", "complement", "full", "timing"] = "counterpoint",
        brief: Optional[Dict] = None
    ) -> Dict:
        """
        Generate metaphysical analysis of a decision at a given time.
        
        Args:
            decision_time: When the decision was proposed/initiated
            mathematical_input: Optional results from computational analysis
            request_type: Type of analysis to provide
            brief: Optional full brief from parent agent
            
        Returns:
            Structured assessment with counterpoints and synthesis
        """
        # Calculate birth chart of the decision
        chart = self.celestial.bazi_chart(
            decision_time.year,
            decision_time.month,
            decision_time.day,
            decision_time.hour
        )
        
        # Analyze elemental climate
        climate = self._analyze_elemental_climate(chart)
        
        # Determine timing status
        timing = self._assess_timing(chart, decision_time)
        
        # Generate counterpoints if mathematical input provided
        counterpoints = None
        if mathematical_input:
            counterpoints = self._generate_counterpoints(chart, climate, mathematical_input)
        
        # Detect biases
        biases = self._detect_biases(climate)
        
        # Build synthesis
        synthesis = self._build_synthesis(
            chart, climate, timing, counterpoints, request_type
        )
        
        return {
            "meta": {
                "decision_birth_time": decision_time.isoformat(),
                "analysis_type": request_type,
                "chart": chart
            },
            "birth_chart": {
                "year": chart.get("year", {}),
                "month": chart.get("month", {}),
                "day": chart.get("day", {}),
                "hour": chart.get("hour", {}),
                "day_master": chart.get("day_master", {}),
                "day_master_element": self._get_element(chart.get("day_master", {}).get("stem", ""))
            },
            "energetic_climate": {
                "element_distribution": asdict(climate),
                "day_master_strength": self._assess_day_master_strength(chart, climate),
                "dominant_element": climate.dominant(),
                "weakest_element": climate.weakest(),
                "season": self._get_season(chart)
            },
            "timing_assessment": timing,
            "counterpoints": counterpoints,
            "bias_analysis": biases,
            "synthesis": synthesis
        }
    
    def _analyze_elemental_climate(self, chart: Dict) -> ElementalClimate:
        """Count elements in chart pillars."""
        elems = ElementalClimate()
        
        for pillar in ['year', 'month', 'day', 'hour']:
            p = chart.get(pillar, {})
            stem = p.get('stem', '')
            branch = p.get('branch', '')
            
            if stem in self.STEM_ELEMENTS:
                e = self.STEM_ELEMENTS[stem]
                setattr(elems, e, getattr(elems, e) + 2)  # Stems weighted more
            
            if branch in self.BRANCH_ELEMENTS:
                e = self.BRANCH_ELEMENTS[branch]
                setattr(elems, e, getattr(elems, e) + 1)
        
        return elems
    
    def _get_element(self, stem: str) -> str:
        """Get element for a stem."""
        return self.STEM_ELEMENTS.get(stem, 'unknown')
    
    def _get_season(self, chart: Dict) -> str:
        """Determine dominant season from month branch."""
        month = chart.get('month', {})
        branch = month.get('branch', '')
        return self.BRANCH_SEASONS.get(branch, 'unknown')
    
    def _assess_day_master_strength(self, chart: Dict, climate: ElementalClimate) -> str:
        """Assess if Day Master is strong, weak, or balanced."""
        day_master = chart.get('day_master', {})
        dm_elem = self._get_element(day_master.get('stem', ''))
        
        # Count supporting elements (same + producing element)
        support_count = getattr(climate, dm_elem, 0)  # Same element
        produces = self.PRODUCES.get(dm_elem)
        if produces:
            support_count += getattr(climate, produces, 0) * 0.8  # Producing element
        
        # Count controlling elements
        total = sum([climate.wood, climate.fire, climate.earth, climate.metal, climate.water])
        control_ratio = 1 - (support_count / total) if total > 0 else 0
        
        if support_count >= 4:
            return "strong"
        elif support_count <= 2:
            return "weak"
        else:
            return "balanced"
    
    def _assess_timing(self, chart: Dict, dt: datetime) -> Dict:
        """Assess timing quality for the decision."""
        month = chart.get('month', {})
        day = chart.get('day', {})
        
        month_branch = month.get('branch', '')
        day_branch = day.get('branch', '')
        
        # Check for clashes (6 pairs)
        clashes = {
            '子': '午', '午': '子',
            '丑': '未', '未': '丑',
            '寅': '申', '申': '寅',
            '卯': '酉', '酉': '卯',
            '辰': '戌', '戌': '辰',
            '巳': '亥', '亥': '巳'
        }
        
        has_clash = clashes.get(day_branch) == month_branch
        
        # Season-alignment check
        season = self._get_season(chart)
        season_element = {
            'spring': 'wood', 'summer': 'fire',
            'late_summer': 'earth', 'autumn': 'metal', 'winter': 'water'
        }.get(season, 'unknown')
        
        dm_elem = self._get_element(chart.get('day_master', {}).get('stem', ''))
        season_supports = (
            season_element == dm_elem or  # Same element
            self.PRODUCES.get(season_element) == dm_elem  # Produces day master
        )
        
        # Determine status
        if has_clash:
            status = "unfavorable"
            reason = f"Branch clash detected: {day_branch} clashes with {month_branch}"
        elif not season_supports:
            status = "cautionary"
            reason = f"Seasonal ({season}) energy does not strongly support decision"
        else:
            status = "favorable"
            reason = f"Seasonal alignment supports the decision climate"
        
        return {
            "status": status,
            "reason": reason,
            "has_clash": has_clash,
            "clash_details": f"{day_branch}-{clashes.get(day_branch, 'none')}" if has_clash else None,
            "seasonal_alignment": "supported" if season_supports else "neutral/challenging",
            "current_season": season
        }
    
    def _generate_counterpoints(
        self, 
        chart: Dict, 
        climate: ElementalClimate,
        mathematical: Dict
    ) -> Dict:
        """Generate counter-arguments to mathematical reasoning."""
        
        counterpoints = {
            "temporal": {
                "mathematical_assumption": "Time is fungible—decision effectiveness depends only on content",
                "metaphysical_reality": "Every moment has a unique energetic signature",
                "critique": "The analysis treats time as neutral substrate, ignoring temporal energetic context",
                "recommendation": "Consider postponing or accelerating based on cyclic peaks"
            },
            "relational": {
                "mathematical_assumption": "Stakeholders are rational agents with predictable responses",
                "metaphysical_reality": "Relationships have energetic dynamics beyond visible transactions",
                "critique": "The model understates emotional/political undercurrents",
                "recommendation": "Map Ten God dynamics to anticipate resistance patterns"
            },
            "systemic": {
                "mathematical_assumption": "Variables can be isolated and optimized independently",
                "metaphysical_reality": "Elements exist in generating/controlling cycles",
                "critique": "Second and third-order interactions may amplify or neutralize intended effects",
                "recommendation": "Model cascade effects across the full system"
            }
        }
        
        # Customize based on climate
        weakest = climate.weakest()
        if weakest[1] == 0:
            counterpoints["blindspot"] = {
                "what_was_invisible": f"Complete absence of {weakest[0].upper()} element",
                "why_it_matters": f"This represents {'foundation/support' if weakest[0]=='earth' else 'adaptability' if weakest[0]=='water' else 'growth' if weakest[0]=='wood' else 'action/visibility' if weakest[0]=='fire' else 'structure/boundaries'}",
                "suggested_inquiry": f"How will you compensate for missing {weakest[0]} energy?"
            }
        
        return counterpoints
    
    def _detect_biases(self, climate: ElementalClimate) -> List[Dict]:
        """Detect potential cognitive biases from elemental imbalances."""
        biases = []
        
        for elem in ['wood', 'fire', 'earth', 'metal', 'water']:
            count = getattr(climate, elem)
            
            if count >= 4:
                key = f"{elem}_excessive"
                if key in self.BIAS_MAP:
                    biases.append(self.BIAS_MAP[key])
            elif count == 0:
                key = f"{elem}_deficient"
                if key in self.BIAS_MAP:
                    biases.append(self.BIAS_MAP[key])
        
        return biases
    
    def _build_synthesis(
        self,
        chart: Dict,
        climate: ElementalClimate,
        timing: Dict,
        counterpoints: Optional[Dict],
        request_type: str
    ) -> Dict:
        """Build integrative synthesis."""
        
        # Determine agreement level based on timing status
        status = timing.get("status", "neutral")
        if status == "favorable":
            agreement = "full"
        elif status == "cautionary":
            agreement = "qualified"
        elif status == "unfavorable":
            agreement = "disagreement"
        else:
            agreement = "partial"
        
        # Build verdict
        weakest = climate.weakest()
        verdict_map = {
            "favorable": "proceed",
            "cautionary": "proceed_with_modifications",
            "unfavorable": "delay",
            "neutral": "uncertain"
        }
        
        modifications = []
        if weakest[0] == 'earth' and weakest[1] <= 1:
            modifications.append({
                "area": "Foundation",
                "change": "Strengthen infrastructure before executing",
                "reason": "Earth deficiency threatens structural integrity"
            })
        if climate.weakest()[0] == 'water':
            modifications.append({
                "area": "Adaptability",
                "change": "Build in contingency triggers",
                "reason": "Water deficiency may limit pivot capacity"
            })
        
        return {
            "agreement_with_mathematical": agreement,
            "verdict": verdict_map.get(status, "uncertain"),
            "confidence": "medium" if status == "cautionary" else "high" if status == "favorable" else "low",
            "modifications_recommended": modifications,
            "rationale": f"Timing assessment: {timing.get('reason', 'No specific timing data')}"
        }


def load_brief(path: str) -> Dict:
    """Load decision brief from YAML file."""
    with open(path, 'r') as f:
        return yaml.safe_load(f)


def parse_datetime(dt_str: str) -> datetime:
    """Parse ISO 8601 datetime string."""
    # Handle various formats
    formats = [
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(dt_str, fmt)
        except ValueError:
            continue
    
    raise ValueError(f"Could not parse datetime: {dt_str}")


def main():
    parser = argparse.ArgumentParser(description="Bazi Decision Engine")
    parser.add_argument("--brief", "-b", help="Path to decision brief YAML file")
    parser.add_argument("--datetime", "-d", help="Decision datetime (ISO 8601)")
    parser.add_argument("--mode", "-m", 
                       choices=["counterpoint", "complement", "full", "timing"],
                       default="full",
                       help="Analysis mode")
    parser.add_argument("--output", "-o", choices=["yaml", "json", "markdown"],
                       default="yaml",
                       help="Output format")
    
    args = parser.parse_args()
    
    engine = BaziDecisionEngine()
    
    # Determine inputs
    brief = None
    if args.brief:
        brief = load_brief(args.brief)
        dt_str = brief.get("decision_context", {}).get("decision_birth_time", datetime.now().isoformat())
        decision_time = parse_datetime(dt_str)
        mode = brief.get("request_type", args.mode)
        math_input = brief.get("mathematical_recommendation")
    elif args.datetime:
        decision_time = parse_datetime(args.datetime)
        mode = args.mode
        math_input = None
    else:
        decision_time = datetime.now()
        mode = args.mode
        math_input = None
    
    # Run analysis
    result = engine.analyze_decision(
        decision_time=decision_time,
        mathematical_input=math_input,
        request_type=mode,
        brief=brief
    )
    
    # Output
    if args.output == "json":
        print(json.dumps(result, indent=2))
    elif args.output == "yaml":
        print(yaml.dump(result, default_flow_style=False, allow_unicode=True))
    else:
        # Markdown summary
        print(f"# Bazi Decision Analysis\n")
        print(f"**Decision Birth Time:** {result['meta']['decision_birth_time']}\n")
        
        bc = result['birth_chart']
        print(f"## Birth Chart\n")
        print(f"| Pillar | Stem | Branch |")
        print(f"|--------|------|--------|")
        for p in ['year', 'month', 'day', 'hour']:
            pillar = bc.get(p, {})
            print(f"| {p.capitalize()} | {pillar.get('stem', '-')} | {pillar.get('branch', '-')} |")
        print(f"\n**Day Master:** {bc['day_master']} ({bc['day_master_element']})\n")
        
        ec = result['energetic_climate']
        print(f"## Energetic Climate\n")
        print(f"- **Dominant:** {ec['dominant_element'][0]} ({ec['dominant_element'][1]} points)")
        print(f"- **Weakest:** {ec['weakest_element'][0]} ({ec['weakest_element'][1]} points)")
        print(f"- **Season:** {ec['season']}")
        print(f"- **Day Master Strength:** {ec['day_master_strength']}\n")
        
        ta = result['timing_assessment']
        print(f"## Timing Assessment\n")
        print(f"**Status:** {ta['status'].upper()}")
        print(f"**Reason:** {ta['reason']}\n")
        
        if result['bias_analysis']:
            print(f"## Detected Biases\n")
            for bias in result['bias_analysis']:
                print(f"- **{bias['bias']}**: {bias['description']}")
                print(f"  - Correction: {bias['correction']}\n")
        
        syn = result['synthesis']
        print(f"## Synthesis\n")
        print(f"**Agreement with Mathematical View:** {syn['agreement_with_mathematical']}")
        print(f"**Verdict:** {syn['verdict']}")
        print(f"**Confidence:** {syn['confidence']}")
        if syn['modifications_recommended']:
            print(f"\n**Recommended Modifications:**")
            for mod in syn['modifications_recommended']:
                print(f"- *{mod['area']}*: {mod['change']}")


if __name__ == "__main__":
    main()
