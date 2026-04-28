"""
Aether: Cosmological Constants and Mappings
=============================================
The foundational layer - all stems, branches, phases, and celestial mappings.
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from enum import Enum, auto

class Element(Enum):
    """Five Phases (五行)"""
    WOOD = auto()
    FIRE = auto()
    EARTH = auto()
    METAL = auto()
    WATER = auto()

class Polarity(Enum):
    """Yin/Yang polarity"""
    YANG = 1
    YIN = 0

@dataclass(frozen=True)
class HeavenlyStem:
    """天干 (Tiangan) - 10 Heavenly Stems"""
    index: int  # 0-9
    name: str
    character: str
    element: Element
    polarity: Polarity

@dataclass(frozen=True)  
class EarthlyBranch:
    """地支 (Dizhi) - 12 Earthly Branches"""
    index: int  # 0-11
    name: str
    character: str
    zodiac: str
    element: Element
    polarity: Polarity
    season: str
    direction: str

class CelestialConstants:
    """All foundational cosmological mappings"""
    
    # 10 Heavenly Stems
    HEAVENLY_STEMS = [
        HeavenlyStem(0, "Jia", "甲", Element.WOOD, Polarity.YANG),
        HeavenlyStem(1, "Yi", "乙", Element.WOOD, Polarity.YIN),
        HeavenlyStem(2, "Bing", "丙", Element.FIRE, Polarity.YANG),
        HeavenlyStem(3, "Ding", "丁", Element.FIRE, Polarity.YIN),
        HeavenlyStem(4, "Wu", "戊", Element.EARTH, Polarity.YANG),
        HeavenlyStem(5, "Ji", "己", Element.EARTH, Polarity.YIN),
        HeavenlyStem(6, "Geng", "庚", Element.METAL, Polarity.YANG),
        HeavenlyStem(7, "Xin", "辛", Element.METAL, Polarity.YIN),
        HeavenlyStem(8, "Ren", "壬", Element.WATER, Polarity.YANG),
        HeavenlyStem(9, "Gui", "癸", Element.WATER, Polarity.YIN),
    ]
    
    # 12 Earthly Branches
    EARTHLY_BRANCHES = [
        EarthlyBranch(0, "Zi", "子", "Rat", Element.WATER, Polarity.YANG, "Winter", "North"),
        EarthlyBranch(1, "Chou", "丑", "Ox", Element.EARTH, Polarity.YIN, "Winter", "Northeast"),
        EarthlyBranch(2, "Yin", "寅", "Tiger", Element.WOOD, Polarity.YANG, "Spring", "East"),
        EarthlyBranch(3, "Mao", "卯", "Rabbit", Element.WOOD, Polarity.YIN, "Spring", "East"),
        EarthlyBranch(4, "Chen", "辰", "Dragon", Element.EARTH, Polarity.YANG, "Spring", "Southeast"),
        EarthlyBranch(5, "Si", "巳", "Snake", Element.FIRE, Polarity.YIN, "Summer", "South"),
        EarthlyBranch(6, "Wu", "午", "Horse", Element.FIRE, Polarity.YANG, "Summer", "South"),
        EarthlyBranch(7, "Wei", "未", "Goat", Element.EARTH, Polarity.YIN, "Summer", "Southwest"),
        EarthlyBranch(8, "Shen", "申", "Monkey", Element.METAL, Polarity.YANG, "Autumn", "West"),
        EarthlyBranch(9, "You", "酉", "Rooster", Element.METAL, Polarity.YIN, "Autumn", "West"),
        EarthlyBranch(10, "Xu", "戌", "Dog", Element.EARTH, Polarity.YANG, "Autumn", "Northwest"),
        EarthlyBranch(11, "Hai", "亥", "Pig", Element.WATER, Polarity.YIN, "Winter", "North"),
    ]
    
    # Hidden Stems (藏干) - Primary/Secondary/Tertiary elements within each branch
    HIDDEN_STEMS = {
        0: [(9, "primary")],  # Zi - Gui
        1: [(5, "primary"), (9, "secondary"), (7, "tertiary")],  # Chou - Ji, Gui, Xin
        2: [(0, "primary"), (2, "secondary"), (4, "tertiary")],  # Yin - Jia, Bing, Wu
        3: [(1, "primary")],  # Mao - Yi
        4: [(4, "primary"), (1, "secondary"), (9, "tertiary")],  # Chen - Wu, Yi, Gui
        5: [(2, "primary"), (4, "secondary"), (6, "tertiary")],  # Si - Bing, Wu, Geng
        6: [(3, "primary"), (5, "secondary")],  # Wu - Ding, Ji
        7: [(5, "primary"), (3, "secondary"), (1, "tertiary")],  # Wei - Ji, Ding, Yi
        8: [(6, "primary"), (8, "secondary"), (4, "tertiary")],  # Shen - Geng, Ren, Wu
        9: [(7, "primary")],  # You - Xin
        10: [(4, "primary"), (7, "secondary"), (3, "tertiary")], # Xu - Wu, Xin, Ding
        11: [(8, "primary"), (0, "secondary")],  # Hai - Ren, Jia
    }
    
    # Na Yin (纳音) - 30 sound elements of the sexagenary cycle
    # Each pair shares a Na Yin element
    NA_YIN_WUXING = [
        "海中金", "海中金",  # Sea Metal (pairs 0-1: 甲子/乙丑)
        "炉中火", "炉中火",  # Furnace Fire (pairs 2-3: 丙寅/丁卯)
        "大林木", "大林木",  # Great Forest Wood (pairs 4-5: 戊辰/己巳)
        "路旁土", "路旁土",  # Roadside Earth (pairs 6-7: 庚午/辛未)
        "剑锋金", "剑锋金",  # Sword Metal (pairs 8-9: 壬申/癸酉)
        "山头火", "山头火",  # Mountain Fire (pairs 10-11: 甲戌/乙亥)
        "涧下水", "涧下水",  # Stream Water (pairs 12-13: 丙子/丁丑)
        "城头土", "城头土",  # Wall Earth (pairs 14-15: 戊寅/己卯)
        "白蜡金", "白蜡金",  # White Wax Metal (pairs 16-17: 庚辰/辛巳)
        "杨柳木", "杨柳木",  # Willow Wood (pairs 18-19: 壬午/癸未)
        "泉中水", "泉中水",  # Spring Water (pairs 20-21: 甲申/乙酉)
        "屋上土", "屋上土",  # Roof Earth (pairs 22-23: 丙戌/丁亥)
        "霹雳火", "霹雳火",  # Thunder Fire (pairs 24-25: 戊子/己丑)
        "松柏木", "松柏木",  # Pine Wood (pairs 26-27: 庚寅/辛卯)
        "长流水", "长流水",  # Long Stream Water (pairs 28-29: 壬辰/癸巳)
        "砂石金", "砂石金",  # Sand Metal (pairs 30-31: 甲午/乙未)
        "山下火", "山下火",  # Mountain Fire (pairs 32-33: 丙申/丁酉)
        "平地木", "平地木",  # Flatland Wood (pairs 34-35: 戊戌/己亥)
        "壁上土", "壁上土",  # Wall Earth (pairs 36-37: 庚子/辛丑)
        "金箔金", "金箔金",  # Gold Foil Metal (pairs 38-39: 壬寅/癸卯)
        "覆灯火", "覆灯火",  # Lamp Fire (pairs 40-41: 甲辰/乙巳)
        "天河水", "天河水",  # Heavenly Water (pairs 42-43: 丙午/丁未)
        "大驿土", "大驿土",  # Post Earth (pairs 44-45: 戊申/己酉)
        "钗钏金", "钗钏金",  # Hairpin Metal (pairs 46-47: 庚戌/辛亥)
        "桑柘木", "桑柘木",  # Mulberry Wood (pairs 48-49: 壬子/癸丑)
        "大溪水", "大溪水",  # Brook Water (pairs 50-51: 甲寅/乙卯)
        "沙中土", "沙中土",  # Sand Earth (pairs 52-53: 丙辰/丁巳)
        "天上火", "天上火",  # Heavenly Fire (pairs 54-55: 戊午/己未)
        "石榴木", "石榴木",  # Pomegranate Wood (pairs 56-57: 庚申/辛酉)
        "大海水", "大海水",  # Ocean Water (pairs 58-59: 壬戌/癸亥)
    ]
    
    # Na Yin Element Classification
    NA_YIN_ELEMENT_MAP = {
        "海中金": Element.METAL, "剑锋金": Element.METAL, "白蜡金": Element.METAL,
        "砂石金": Element.METAL, "金箔金": Element.METAL, "钗钏金": Element.METAL,
        "炉中火": Element.FIRE, "山头火": Element.FIRE, "霹雳火": Element.FIRE,
        "山下火": Element.FIRE, "覆灯火": Element.FIRE, "天上火": Element.FIRE,
        "大林木": Element.WOOD, "杨柳木": Element.WOOD, "松柏木": Element.WOOD,
        "平地木": Element.WOOD, "桑柘木": Element.WOOD, "石榴木": Element.WOOD,
        "路旁土": Element.EARTH, "城头土": Element.EARTH, "屋上土": Element.EARTH,
        "霹雳火": Element.FIRE, "壁上土": Element.EARTH, "大驿土": Element.EARTH,
        "涧下水": Element.WATER, "泉中水": Element.WATER, "长流水": Element.WATER,
        "天河水": Element.WATER, "大溪水": Element.WATER, "大海水": Element.WATER,
    }
    
    # Productive cycle
    PRODUCTION_CYCLE = {
        Element.WOOD: Element.FIRE,
        Element.FIRE: Element.EARTH,
        Element.EARTH: Element.METAL,
        Element.METAL: Element.WATER,
        Element.WATER: Element.WOOD,
    }
    
    # Controlling cycle
    CONTROL_CYCLE = {
        Element.WOOD: Element.EARTH,
        Element.EARTH: Element.WATER,
        Element.WATER: Element.FIRE,
        Element.FIRE: Element.METAL,
        Element.METAL: Element.WOOD,
    }
    
    # Branch clashes (冲)
    BRANCH_CLASHES = {
        0: 6,   # Zi vs Wu
        1: 7,   # Chou vs Wei
        2: 8,   # Yin vs Shen
        3: 9,   # Mao vs You
        4: 10,  # Chen vs Xu
        5: 11,  # Si vs Hai
    }
    
    # Branch combinations (合)
    BRANCH_COMBINATIONS = {
        0: 1,   # Zi + Chou = Earth
        2: 11,  # Yin + Hai = Wood
        3: 4,   # Mao + Xu = Fire
        5: 10,  # Si + Shen = Water
        6: 7,   # Wu + Wei = Fire
        8: 9,   # Shen + You = Metal
    }
    
    # 24 Solar Terms
    SOLAR_TERMS = [
        "Start of Spring", "Rain Water", "Awakening of Insects", "Spring Equinox",
        "Clear and Bright", "Grain Rain", "Start of Summer", "Grain Full",
        "Grain in Ear", "Summer Solstice", "Minor Heat", "Major Heat",
        "Start of Autumn", "Limit of Heat", "White Dew", "Autumn Equinox",
        "Cold Dew", "Frost Descent", "Start of Winter", "Minor Snow",
        "Major Snow", "Winter Solstice", "Minor Cold", "Major Cold",
    ]

class HeavenlyStems:
    @staticmethod
    def by_index(idx: int):
        return CelestialConstants.HEAVENLY_STEMS[idx % 10]

class EarthlyBranches:
    @staticmethod
    def by_index(idx: int):
        return CelestialConstants.EARTHLY_BRANCHES[idx % 12]
    
    @staticmethod
    def by_hour(hour: int):
        branch_index = (hour + 1) // 2 % 12
        return CelestialConstants.EARTHLY_BRANCHES[branch_index]

class SexagenaryCycle:
    @staticmethod
    def get_year_ganzhi(year: int):
        cycle_position = (year - 4) % 60
        return CelestialConstants.SEXAGENARY_CYCLE[cycle_position]

class HiddenStems:
    """
    藏干 (Canggan) - Hidden Stems within Earthly Branches.
    Each branch contains 1-3 hidden heavenly stems varying in intensity.
    """
    
    @staticmethod
    def get_hidden_stems(branch_index: int):
        """Get hidden stems for a branch by index (0-11)."""
        stems_data = CelestialConstants.HIDDEN_STEMS.get(branch_index, [])
        return [(CelestialConstants.HEAVENLY_STEMS[idx], intensity) 
                for idx, intensity in stems_data]
    
    @staticmethod
    def get_primary_stem(branch_index: int):
        """Get the primary (dominant) hidden stem."""
        stems = HiddenStems.get_hidden_stems(branch_index)
        return stems[0][0] if stems else None
    
    @staticmethod
    def get_all_for_branch(branch_name: str):
        """Get hidden stems by branch name."""
        for i, branch in enumerate(CelestialConstants.EARTHLY_BRANCHES):
            if branch.name == branch_name or branch.character == branch_name:
                return HiddenStems.get_hidden_stems(i)
        return []

class NaYin:
    """
    纳音五行 (Nayin Wuxing) - Sound element of the sexagenary cycle.
    Every two consecutive pillars share one of 30 sound elements.
    """
    
    SOUND_ELEMENTS = {
        "海中金": ("Sea Metal", "Metal"),
        "炉中火": ("Furnace Fire", "Fire"),
        "大林木": ("Great Forest Wood", "Wood"),
        "路旁土": ("Roadside Earth", "Earth"),
        "剑锋金": ("Sword Metal", "Metal"),
        "山头火": ("Mountain Fire", "Fire"),
        "涧下水": ("Stream Water", "Water"),
        "城头土": ("Wall Earth", "Earth"),
        "白蜡金": ("White Wax Metal", "Metal"),
        "杨柳木": ("Willow Wood", "Wood"),
        "泉中水": ("Spring Water", "Water"),
        "屋上土": ("Roof Earth", "Earth"),
        "霹雳火": ("Thunder Fire", "Fire"),
        "松柏木": ("Pine Wood", "Wood"),
        "长流水": ("Long Stream Water", "Water"),
        "砂石金": ("Sand Metal", "Metal"),
        "山下火": ("Mountain Fire", "Fire"),
        "平地木": ("Flatland Wood", "Wood"),
        "壁上土": ("Wall Earth", "Earth"),
        "金箔金": ("Gold Foil Metal", "Metal"),
        "覆灯火": ("Lamp Fire", "Fire"),
        "天河水": ("Heavenly Water", "Water"),
        "大驿土": ("Post Earth", "Earth"),
        "钗钏金": ("Hairpin Metal", "Metal"),
        "桑柘木": ("Mulberry Wood", "Wood"),
        "大溪水": ("Brook Water", "Water"),
        "沙中土": ("Sand Earth", "Earth"),
        "天上火": ("Heavenly Fire", "Fire"),
        "石榴木": ("Pomegranate Wood", "Wood"),
        "大海水": ("Ocean Water", "Water"),
    }
    
    @staticmethod
    def get_nayin(cycle_index: int):
        """
        Get Na Yin for a sexagenary cycle position (0-59).
        Each pair shares the same Na Yin.
        """
        if not 0 <= cycle_index < 60:
            return None
        return CelestialConstants.NA_YIN_WUXING[cycle_index]
    
    @staticmethod
    def get_element(cycle_index: int):
        """Get the five element category of a Na Yin."""
        nayin = NaYin.get_nayin(cycle_index)
        if nayin:
            return CelestialConstants.NA_YIN_ELEMENT_MAP.get(nayin)
        return None
    
    @staticmethod
    def describe(cycle_index: int):
        """Return full description of the Na Yin element."""
        nayin = NaYin.get_nayin(cycle_index)
        if nayin and nayin in NaYin.SOUND_ELEMENTS:
            english_name, element = NaYin.SOUND_ELEMENTS[nayin]
            return f"{nayin} ({english_name}, {element})"
        return None
    
    @staticmethod
    def from_pillar(stem_idx: int, branch_idx: int):
        """Get Na Yin from stem and branch indices."""
        cycle_index = (stem_idx % 10) % 60  # Simplified - actual formula is more complex
        return NaYin.get_nayin(cycle_index)
