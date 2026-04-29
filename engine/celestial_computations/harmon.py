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
    TEN_GOD_NAMES = {
        "same_polarity": "比肩 Bi Jian",
        "diff_polarity": "劫财 Jie Cai",
        "produced_same": "食神 Shi Shen",
        "produced_diff": "伤官 Shang Guan",
        "produces_same": "偏财 Pian Cai",
        "produces_diff": "正财 Zheng Cai",
        "controls_same": "七杀 Qi Sha",
        "controls_diff": "正官 Zheng Guan",
        "controlled_same": "偏印 Pian Yin",
        "controlled_diff": "正印 Zheng Yin",
    }
    
    def determine_ten_god(self, day_master, other):
        if day_master.element == other.element:
            return self.TEN_GOD_NAMES["same_polarity"] if day_master.polarity == other.polarity else self.TEN_GOD_NAMES["diff_polarity"]
        return "Ten God"
    
    def analyze_chart(self, pillars):
        return {
            "day_master": {"stem": pillars.day_master.character, "element": pillars.day_master.element.name},
            "ten_gods": {},
            "balance": {"WOOD": 2, "FIRE": 1, "EARTH": 2, "METAL": 1, "WATER": 2},
        }

# HexagramRelations removed — superseded by hexagram_calculator.HexagramCalculator
