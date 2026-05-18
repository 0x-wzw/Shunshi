"""
Harmon: Relationship Calculations
"""

from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum, auto

from .aether import CelestialConstants, Element

class RelationType(Enum):
    PRODUCES = auto()
    CONTROLS = auto()
    SAME = auto()
    CLASH = auto()
    COMBINE = auto()

@dataclass
class Relation:
    source: str
    target: str
    relation_type: RelationType
    description: str
    strength: float

class StemBranchRelations:
    def analyze_element_relationship(self, elem1: Element, elem2: Element):
        if elem1 == elem2:
            return Relation(elem1.name, elem2.name, RelationType.SAME, "Harmony", 0.7)
        if CelestialConstants.PRODUCTION_CYCLE.get(elem1) == elem2:
            return Relation(elem1.name, elem2.name, RelationType.PRODUCES, f"{elem1.name} produces {elem2.name}", 0.8)
        if CelestialConstants.CONTROL_CYCLE.get(elem1) == elem2:
            return Relation(elem1.name, elem2.name, RelationType.CONTROLS, f"{elem1.name} controls {elem2.name}", 0.9)
        return Relation(elem1.name, elem2.name, RelationType.SAME, "Complex", 0.3)

class BaziAnalyzer:
    """Complete Bazi chart analysis: element counting, ten gods, branch interactions."""

    TEN_GOD_NAMES = {
        "same_polarity": "比肩 Bi Jian",       # Same element + same polarity
        "diff_polarity": "劫财 Jie Cai",        # Same element + diff polarity
        "produced_same": "食神 Shi Shen",       # DM produces, same polarity
        "produced_diff": "伤官 Shang Guan",     # DM produces, diff polarity
        "produces_same": "偏财 Pian Cai",       # Produces DM, same polarity
        "produces_diff": "正财 Zheng Cai",      # Produces DM, diff polarity
        "controls_same": "七杀 Qi Sha",         # Controls DM, same polarity
        "controls_diff": "正官 Zheng Guan",     # Controls DM, diff polarity
        "controlled_same": "偏印 Pian Yin",     # DM controls, same polarity
        "controlled_diff": "正印 Zheng Yin",    # DM controls, diff polarity
    }

    # Inverse lookups needed for ten-god computation
    _PRODUCES = {Element.WOOD: Element.FIRE, Element.FIRE: Element.EARTH,
                 Element.EARTH: Element.METAL, Element.METAL: Element.WATER,
                 Element.WATER: Element.WOOD}
    _CONTROLS = {Element.WOOD: Element.EARTH, Element.EARTH: Element.WATER,
                 Element.WATER: Element.FIRE, Element.FIRE: Element.METAL,
                 Element.METAL: Element.WOOD}
    _PRODUCED_BY = {v: k for k, v in _PRODUCES.items()}
    _CONTROLLED_BY = {v: k for k, v in _CONTROLS.items()}

    def determine_ten_god(self, day_master, other):
        """Compute the ten-god relationship of `other` relative to `day_master`."""
        dm = day_master
        ot = other
        same_pol = dm.polarity == ot.polarity

        if dm.element == ot.element:
            return self.TEN_GOD_NAMES["same_polarity"] if same_pol else self.TEN_GOD_NAMES["diff_polarity"]

        # DM produces other → 食神/伤官
        if self._PRODUCES.get(dm.element) == ot.element:
            return self.TEN_GOD_NAMES["produced_same"] if same_pol else self.TEN_GOD_NAMES["produced_diff"]

        # Other produces DM → 偏财/正财 (other is the resource that DM "controls" by being produced)
        # Wait: in standard Bazi, the one that PRODUCES the DM is 正印/偏印 (印星).
        # The one that DM CONTROLS is 正财/偏财 (财星).
        # Let's re-derive carefully:
        #
        # 印 (Resource): element that PRODUCES day master
        #   same polarity → 偏印, diff polarity → 正印
        # 财 (Wealth): element that day master CONTROLS
        #   same polarity → 偏财, diff polarity → 正财
        # 官 (Officer): element that CONTROLS day master
        #   same polarity → 七杀, diff polarity → 正官
        # 食伤 (Expression): element that day master PRODUCES
        #   same polarity → 食神, diff polarity → 伤官
        # 比劫 (Companion): same element as day master
        #   same polarity → 比肩, diff polarity → 劫财

        # Other produces DM → 印 (Resource)
        if self._PRODUCED_BY.get(dm.element) == ot.element:
            return self.TEN_GOD_NAMES["controlled_same"] if same_pol else self.TEN_GOD_NAMES["controlled_diff"]

        # DM controls other → 财 (Wealth)
        if self._CONTROLS.get(dm.element) == ot.element:
            return self.TEN_GOD_NAMES["produces_same"] if same_pol else self.TEN_GOD_NAMES["produces_diff"]

        # Other controls DM → 官 (Officer)
        if self._CONTROLLED_BY.get(dm.element) == ot.element:
            return self.TEN_GOD_NAMES["controls_same"] if same_pol else self.TEN_GOD_NAMES["controls_diff"]

        return "Unknown"

    def analyze_chart(self, pillars):
        """Full chart analysis with real element counts and ten-god assignments."""
        dm = pillars.day_master

        # ── Count elements from all stems + branches ──
        counts = {"WOOD": 0, "FIRE": 0, "EARTH": 0, "METAL": 0, "WATER": 0}
        pillars_list = [
            ("year", pillars.year_pillar),
            ("month", pillars.month_pillar),
            ("day", pillars.day_pillar),
            ("hour", pillars.hour_pillar),
        ]

        ten_gods = {}
        for label, (stem, branch) in pillars_list:
            # Count stem element
            counts[stem.element.name] += 1
            # Count branch element
            counts[branch.element.name] += 1
            # Compute ten god for this stem (vs day master)
            if stem != dm or label == "day":
                ten_gods[label] = self.determine_ten_god(dm, stem)

        return {
            "day_master": {
                "stem": dm.character,
                "element": dm.element.name,
                "polarity": "阳" if dm.polarity.value == 1 else "阴",
            },
            "ten_gods": ten_gods,
            "balance": counts,
        }

# HexagramRelations removed — superseded by hexagram_calculator.HexagramCalculator
