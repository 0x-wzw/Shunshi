"""
Hexagram Calculator — 周易卦象计算引擎
========================================
Complete I Ching / Zhouyi hexagram mathematics:
- 8 Trigrams with binary, element, symbol mappings
- All 64 hexagrams from combining any two trigrams
- Opposite, Nuclear, Changed hexagram calculations
- Day Pillar (日柱) to Hexagram mapping
- Leibniz binary representation
"""

from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional, Set
from enum import Enum

# ═══════════════════════════════════════════════════════════════
# TRIGRAM DATA
# ═══════════════════════════════════════════════════════════════

@dataclass(frozen=True)
class Trigram:
    """八卦 (Bagua) — Fundamental trigram"""
    index: int           # 0–7
    name_cn: str         # e.g. 乾
    name_en: str         # e.g. Heaven
    binary: str          # 3-bit, top to bottom (阳=1, 阴=0)
    symbol: str          # ☰, ☷, etc.
    element: str         # 金/木/水/火/土
    family_role: str     # 父/母/长男/中男/少男/长女/中女/少女
    direction: str       # 方位

# King Wen order: Qian, Dui, Li, Zhen, Xun, Kan, Gen, Kun
# Binary top→bottom (Yao order: 上爻最上)
TRIGRAMS = [
    Trigram(0, "乾", "Heaven",  "111", "☰", "Metal", "Father",   "Southwest"),
    Trigram(1, "兑", "Lake",    "011", "☱", "Metal", "Youngest Daughter", "West"),
    Trigram(2, "离", "Fire",    "101", "☲", "Fire",  "Middle Daughter",   "South"),
    Trigram(3, "震", "Thunder", "001", "☳", "Wood",  "Eldest Son",        "East"),
    Trigram(4, "巽", "Wind",    "110", "☴", "Wood",  "Eldest Daughter",   "Southeast"),
    Trigram(5, "坎", "Water",   "010", "☵", "Water", "Middle Son",        "North"),
    Trigram(6, "艮", "Mountain","100", "☶", "Earth", "Youngest Son",      "Northeast"),
    Trigram(7, "坤", "Earth",   "000", "☷", "Earth", "Mother",            "Southwest"),
]

TRIGRAM_BY_NAME = {t.name_cn: t for t in TRIGRAMS}
TRIGRAM_BY_BINARY = {t.binary: t for t in TRIGRAMS}
TRIGRAM_BY_INDEX = {t.index: t for t in TRIGRAMS}

# ═══════════════════════════════════════════════════════════════
# 64 HEXAGRAMS
# ═══════════════════════════════════════════════════════════════

@dataclass
class Hexagram:
    """六十四卦 — Complete hexagram record"""
    number: int          # 1–64 (King Wen order)
    name_cn: str         # e.g. 乾为天
    name_en: str         # e.g. The Creative
    binary: str          # 6-bit, top to bottom
    upper_trigram: Trigram
    lower_trigram: Trigram
    gua_ci: str          # 卦辞 (judgment)
    element_composition: Tuple[str, str]  # (upper element, lower element)

    @property
    def symbol(self) -> str:
        return self.upper_trigram.symbol + self.lower_trigram.symbol

    @property
    def gua_xiang(self) -> str:
        """卦象描述 e.g. 天行健"""
        return f"{self.upper_trigram.name_cn}上{self.lower_trigram.name_cn}下"

    def to_dict(self) -> dict:
        return {
            "number": self.number,
            "name": f"{self.name_cn} ({self.name_en})",
            "binary": self.binary,
            "symbol": self.symbol,
            "upper": self.upper_trigram.name_cn,
            "lower": self.lower_trigram.name_cn,
            "element_up": self.upper_trigram.element,
            "element_lo": self.lower_trigram.element,
        }

# King Wen sequence — upper trigram varies slowest, lower fastest
HEXAGRAM_NAMES_CN = [
    "乾为天", "坤为地", "水雷屯", "山水蒙", "水天需", "天水讼", "地水师", "水地比",
    "风天小畜", "天泽履", "地天泰", "天地否", "天火同人", "火天大有", "地山谦", "雷地豫",
    "泽雷随", "山风蛊", "地泽临", "风地观", "火雷噬嗑", "山火贲", "山地剥", "地雷复",
    "天雷无妄", "山天大畜", "山雷颐", "泽风大过", "坎为水", "离为火", "泽山咸", "雷风恒",
    "天山遁", "雷天大壮", "火地晋", "地火明夷", "风火家人", "火泽睽", "水山蹇", "雷水解",
    "山泽损", "风雷益", "泽天夬", "天风姤", "泽地萃", "地风升", "泽水困", "水风井",
    "泽火革", "火风鼎", "震为雷", "艮为山", "风山渐", "雷泽归妹", "雷火丰", "火山旅",
    "巽为风", "兑为泽", "风水涣", "水泽节", "风泽中孚", "雷山小过", "水火既济", "火水未济",
]

HEXAGRAM_NAMES_EN = [
    "The Creative", "The Receptive", "Difficulty at the Beginning", "Youthful Folly",
    "Waiting", "Conflict", "The Army", "Holding Together",
    "Small Taming", "Treading", "Peace", "Standstill",
    "Fellowship", "Great Possession", "Modesty", "Enthusiasm",
    "Following", "Work on the Decayed", "Approach", "Contemplation",
    "Biting Through", "Grace", "Splitting Apart", "Return",
    "Innocence", "Taming Power of the Great", "Corners of the Mouth", "Preponderance of the Great",
    "The Abysmal", "The Clinging", "Influence", "Duration",
    "Retreat", "The Power of the Great", "Progress", "Darkening of the Light",
    "The Family", "Opposition", "Obstruction", "Deliverance",
    "Decrease", "Increase", "Breakthrough", "Coming to Meet",
    "Gathering Together", "Pushing Upward", "Oppression", "The Well",
    "Revolution", "The Cauldron", "The Arousing", "Keeping Still",
    "Development", "The Marrying Maiden", "Abundance", "The Wanderer",
    "The Gentle", "The Joyous", "Dispersion", "Limitation",
    "Inner Truth", "Preponderance of the Small", "After Completion", "Before Completion",
]

# Judgment phrases (simplified)
GUA_CI = [
    "元亨利贞", "元亨利牝马之贞", "元亨利贞，勿用有攸往", "亨。匪我求童蒙，童蒙求我",
    "有孚，光亨，贞吉", "有孚，窒惕，中吉，终凶", "贞，丈人吉", "吉，原筮元永贞",
    "亨，密云不雨", "履虎尾，不咥人，亨", "小往大来，吉亨", "否之匪人",
    "同人于野，亨", "元亨", "亨，君子有终", "利建侯行师",
    "元亨利贞，无咎", "元亨，利涉大川", "元亨利贞，至于八月有凶", "盥而不荐，有孚颙若",
    "亨，利用狱", "亨，小利有攸往", "不利有攸往", "亨，出入无疾",
    "元亨利贞，其匪正有眚", "利贞，不家食吉", "贞吉，观颐自求口实", "栋桡，利有攸往",
    "有孚维心，亨", "利贞，亨", "亨利贞，取女吉", "元亨利贞，无咎",
    "亨，小利贞", "利贞", "康侯用锡马蕃庶", "利艰贞",
    "利女贞", "小事吉", "利西南，不利东北", "利西南",
    "有孚，元吉", "利有攸往，利涉大川", "扬于王庭", "女壮，勿用取女",
    "亨，王假有庙", "元亨，利见大人", "亨，贞大人吉", "改邑不改井",
    "巳日乃孚，元亨利贞", "元吉，亨", "亨，震来虩虩", "艮其背，不获其身",
    "女归吉，利贞", "征凶，无攸利", "亨，王假之", "小亨，旅贞吉",
    "小亨，利有攸往", "亨利贞", "亨，王假有庙", "亨，苦节不可贞",
    "豚鱼吉，利涉大川", "亨，利贞", "初吉终乱", "亨，小狐汔济",
]

# King Wen binary mapping: derived from 卦名 trigram decomposition
# Each binary = upper_trigram(3 bits) + lower_trigram(3 bits) top→bottom
HEXAGRAM_BINARIES = [
    "111111", "000000", "010001", "100010", "010111", "111010", "000010", "010000",
    "110111", "111011", "000111", "111000", "111101", "101111", "000100", "001000",
    "011001", "100110", "000011", "110000", "101001", "100101", "100000", "000001",
    "111001", "100111", "100001", "011110", "010010", "101101", "011100", "001110",
    "111100", "001111", "101000", "000101", "110101", "101011", "010100", "001010",
    "100011", "110001", "011111", "111110", "011000", "000110", "011010", "010110",
    "011101", "101110", "001001", "100100", "110100", "001011", "001101", "101100",
    "110110", "011011", "110010", "010011", "110011", "001100", "010101", "101010",
]

# Build the full HEXAGRAMS list
HEXAGRAMS: List[Hexagram] = []
for i in range(64):
    binary = HEXAGRAM_BINARIES[i]
    upper_binary = binary[:3]
    lower_binary = binary[3:]
    upper = TRIGRAM_BY_BINARY[upper_binary]
    lower = TRIGRAM_BY_BINARY[lower_binary]
    HEXAGRAMS.append(Hexagram(
        number=i + 1,
        name_cn=HEXAGRAM_NAMES_CN[i],
        name_en=HEXAGRAM_NAMES_EN[i],
        binary=binary,
        upper_trigram=upper,
        lower_trigram=lower,
        gua_ci=GUA_CI[i],
        element_composition=(upper.element, lower.element)
    ))

HEXAGRAM_BY_NUMBER = {h.number: h for h in HEXAGRAMS}
HEXAGRAM_BY_BINARY = {h.binary: h for h in HEXAGRAMS}

# ═══════════════════════════════════════════════════════════════
# CALCULATOR CLASS
# ═══════════════════════════════════════════════════════════════

class HexagramCalculator:
    """
    卦象计算器 — Core operations for hexagram manipulation.
    """

    # ── 1. Trigram Operations ──────────────────────────────────

    @staticmethod
    def get_trigram(name_or_index) -> Trigram:
        """Get trigram by name (cn/en), index, or binary."""
        if isinstance(name_or_index, int):
            return TRIGRAM_BY_INDEX[name_or_index % 8]
        if name_or_index in TRIGRAM_BY_NAME:
            return TRIGRAM_BY_NAME[name_or_index]
        if name_or_index in TRIGRAM_BY_BINARY:
            return TRIGRAM_BY_BINARY[name_or_index]
        for t in TRIGRAMS:
            if t.name_en == name_or_index:
                return t
        raise ValueError(f"Unknown trigram: {name_or_index}")

    @staticmethod
    def trigram_element_relation(t1: Trigram, t2: Trigram) -> str:
        """
        Five-element relationship between two trigrams.
        Returns one of: 比和, 生我, 我生, 克我, 我克
        """
        e1, e2 = t1.element, t2.element
        if e1 == e2:
            return "比和 (Harmony)"
        production = {"Wood": "Fire", "Fire": "Earth", "Earth": "Metal",
                      "Metal": "Water", "Water": "Wood"}
        control = {"Wood": "Earth", "Earth": "Water", "Water": "Fire",
                     "Fire": "Metal", "Metal": "Wood"}
        if production.get(e1) == e2:
            return f"我生 ({e1} produces {e2})"
        if production.get(e2) == e1:
            return f"生我 ({e2} produces {e1})"
        if control.get(e1) == e2:
            return f"我克 ({e1} controls {e2})"
        if control.get(e2) == e1:
            return f"克我 ({e2} controls {e1})"
        return "Unknown"

    # ── 2. Generate All 64 from Two Trigrams ───────────────────

    @staticmethod
    def hexagram_from_trigrams(upper, lower) -> Hexagram:
        """
        Compose a hexagram from upper and lower trigrams.
        Accepts Trigram objects, names, indices, or binary strings.
        """
        t_up = upper if isinstance(upper, Trigram) else HexagramCalculator.get_trigram(upper)
        t_lo = lower if isinstance(lower, Trigram) else HexagramCalculator.get_trigram(lower)
        binary = t_up.binary + t_lo.binary
        return HEXAGRAM_BY_BINARY[binary]

    @classmethod
    def all_64_hexagrams(cls) -> List[Hexagram]:
        """Return all 64 hexagrams in King Wen order."""
        return HEXAGRAMS[:]

    @classmethod
    def generate_by_trigram_pairs(cls) -> List[Dict]:
        """
        Generate all 64 by pairing each of 8 trigrams as upper
        with each of 8 as lower. Returns structured records.
        """
        results = []
        for u in TRIGRAMS:
            for l in TRIGRAMS:
                h = cls.hexagram_from_trigrams(u, l)
                results.append({
                    "upper": u.name_cn,
                    "lower": l.name_cn,
                    "hexagram": h.to_dict(),
                    "relation": cls.trigram_element_relation(u, l),
                })
        return results

    # ── 3. Opposite / Nuclear / Changed ──────────────────────────

    @staticmethod
    def opposite(hexagram) -> Hexagram:
        """
        错卦 / Opposite hexagram: invert every line (Yin↔Yang).
        Also called "complementary" or "inverse binary".
        """
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        inverted = "".join("1" if c == "0" else "0" for c in h.binary)
        return HEXAGRAM_BY_BINARY[inverted]

    @staticmethod
    def nuclear(hexagram) -> Hexagram:
        """
        互卦 / Nuclear hexagram: extract middle 4 lines as lower/upper nuclear trigrams.
        Lower nuclear trigram = lines 2,3,4 counted from BOTTOM.
        Upper nuclear trigram = lines 3,4,5 counted from BOTTOM.
        """
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        lines = list(h.binary)  # index 0 = top, index 5 = bottom
        # Bottom-to-top reordering: bottom is index 5, top is index 0
        # Line 1 (bottom) = index 5
        # Line 2 = index 4
        # Line 3 = index 3
        # Line 4 = index 2
        # Line 5 = index 1
        # Line 6 (top) = index 0

        # Nuclear lower trigram = lines 2,3,4 from bottom = indices 4,3,2
        lower_binary = "".join([lines[4], lines[3], lines[2]])
        # Nuclear upper trigram = lines 3,4,5 from bottom = indices 3,2,1
        upper_binary = "".join([lines[3], lines[2], lines[1]])

        # Reverse each trigram: indices 4,3,2 are bottom→top, but binary is top→bottom
        # upper_binary[::-1] = top→bottom, lower_binary[::-1] = top→bottom
        nuclear_binary = upper_binary[::-1] + lower_binary[::-1]
        return HEXAGRAM_BY_BINARY[nuclear_binary]

    @staticmethod
    def changed(hexagram, moving_lines: List[int]) -> Hexagram:
        """
        变卦 / Changed hexagram: flip specific moving lines.
        moving_lines: 1-based from bottom (1=bottom yao, 6=top yao).
        Also called "derivative" or "transformed" hexagram.
        """
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        bits = list(h.binary)
        for line in moving_lines:
            idx = 6 - line  # line 1 (bottom) → index 5; line 6 (top) → index 0
            if 0 <= idx < 6:
                bits[idx] = "1" if bits[idx] == "0" else "0"
        return HEXAGRAM_BY_BINARY["".join(bits)]

    @staticmethod
    def all_derivatives(hexagram) -> Dict[str, Hexagram]:
        """
        Get opposite, nuclear, and all single-line changes.
        Returns: {"opposite": H, "nuclear": H, "line1": H, ...}
        """
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        result = {
            "opposite": HexagramCalculator.opposite(h),
            "nuclear": HexagramCalculator.nuclear(h),
        }
        for i in range(1, 7):
            result[f"line_{i}_change"] = HexagramCalculator.changed(h, [i])
        return result

    @staticmethod
    def hexagram_relationships(hexagram) -> Dict:
        """
        Full relationship analysis of a hexagram:
        original, opposite, nuclear, and textual description.
        """
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        opp = HexagramCalculator.opposite(h)
        nuc = HexagramCalculator.nuclear(h)
        return {
            "original": h.to_dict(),
            "opposite": opp.to_dict(),
            "nuclear": nuc.to_dict(),
            "opposite_meaning": f"错卦：全体反转，{h.name_cn} → {opp.name_cn}",
            "nuclear_meaning": f"互卦：内在隐象，{h.name_cn} 藏 {nuc.name_cn} 之机",
            "element_relation": HexagramCalculator.trigram_element_relation(
                h.upper_trigram, h.lower_trigram
            ),
        }

    # ── 4. Day Pillar → Hexagram Mapping (日柱→卦象) ────────────

    # Na Jia system: 60 stems+branches map to 60 hexagram lines
    # 分宫卦象法: 8 palaces × 8 hexagrams = 64
    # Alternative: Day stem determines trigram → compose upper/lower

    STEM_TO_TRIGRAM = {
        "甲": TRIGRAMS[3],  # 震 Thunder (Wood, Yang)
        "乙": TRIGRAMS[4],  # 巽 Wind   (Wood, Yin)
        "丙": TRIGRAMS[2],  # 离 Fire   (Fire, Yang)
        "丁": TRIGRAMS[2],  # 离 Fire   (Fire, Yin)
        "戊": TRIGRAMS[7],  # 坤 Earth  (Earth, Yang)
        "己": TRIGRAMS[7],  # 坤 Earth  (Earth, Yin)
        "庚": TRIGRAMS[0],  # 乾 Heaven (Metal, Yang)
        "辛": TRIGRAMS[0],  # 乾 Heaven (Metal, Yin) — Some schools use 兑
        "壬": TRIGRAMS[5],  # 坎 Water  (Water, Yang)
        "癸": TRIGRAMS[5],  # 坎 Water  (Water, Yin)
    }

    BRANCH_TO_TRIGRAM = {
        "子": TRIGRAMS[5],  # 坎 Water
        "丑": TRIGRAMS[7],  # 坤 Earth
        "寅": TRIGRAMS[3],  # 震 Thunder
        "卯": TRIGRAMS[4],  # 巽 Wind
        "辰": TRIGRAMS[7],  # 坤 Earth
        "巳": TRIGRAMS[2],  # 离 Fire
        "午": TRIGRAMS[2],  # 离 Fire
        "未": TRIGRAMS[7],  # 坤 Earth
        "申": TRIGRAMS[0],  # 乾 Heaven
        "酉": TRIGRAMS[0],  # 乾 Heaven
        "戌": TRIGRAMS[7],  # 坤 Earth
        "亥": TRIGRAMS[5],  # 坎 Water
    }

    # 京房八宫卦: 64 hexagrams arranged in 8 palaces
    # Each palace: 本宫卦, 一世, 二世, 三世, 四世, 五世, 游魂, 归魂
    PALACE_HEXAGRAMS = {
        "乾": [1, 44, 33, 12, 20, 23, 35, 14],   # Qian palace
        "震": [51, 16, 40, 32, 46, 48, 28, 17],  # Zhen palace
        "坎": [29, 60, 3, 63, 49, 55, 36, 7],    # Kan palace
        "艮": [52, 22, 26, 41, 38, 10, 61, 53],  # Gen palace
        "坤": [2, 24, 7, 19, 15, 36, 46, 11],    # Kun palace
        "巽": [57, 9, 37, 42, 25, 21, 27, 18],   # Xun palace
        "离": [30, 56, 50, 64, 4, 59, 6, 13],    # Li palace
        "兑": [58, 47, 45, 31, 39, 15, 62, 54],  # Dui palace
    }

    @classmethod
    def day_pillar_to_hexagram(cls, day_stem: str, day_branch: str,
                                 method: str = "composite") -> Hexagram:
        """
        Map a Day Pillar (日柱) to a hexagram.

        Methods:
            "composite": upper=stem trigram, lower=branch trigram
            "stem_only": upper=lower=stem trigram (纯卦)
            "branch_only": upper=lower=branch trigram (纯卦)
            "na_jia": use 纳甲法 to find exact hexagram
        """
        if method == "composite":
            upper = cls.STEM_TO_TRIGRAM.get(day_stem, TRIGRAMS[0])
            lower = cls.BRANCH_TO_TRIGRAM.get(day_branch, TRIGRAMS[7])
            return cls.hexagram_from_trigrams(upper, lower)
        elif method == "stem_only":
            t = cls.STEM_TO_TRIGRAM.get(day_stem, TRIGRAMS[0])
            return cls.hexagram_from_trigrams(t, t)
        elif method == "branch_only":
            t = cls.BRANCH_TO_TRIGRAM.get(day_branch, TRIGRAMS[7])
            return cls.hexagram_from_trigrams(t, t)
        elif method == "na_jia":
            # Simplified Na Jia: use stem → trigram as upper, branch → line
            return cls._na_jia_hexagram(day_stem, day_branch)
        else:
            raise ValueError(f"Unknown method: {method}")

    @classmethod
    def _na_jia_hexagram(cls, day_stem: str, day_branch: str) -> Hexagram:
        """
        Simplified 纳甲法: Map stem/branch to hexagram and line position.
        Returns the hexagram that contains this stem-branch in its line.
        """
        # Na Jia mapping: each hexagram line has a stem-branch pair
        # Mapping stem to palace (乾=甲乙, 震=庚辛, etc.)
        stem_idx = "甲乙丙丁戊己庚辛壬癸".index(day_stem)
        branch_idx = "子丑寅卯辰巳午未申酉戌亥".index(day_branch)
        cycle_pos = (stem_idx - branch_idx) % 2  # crude alignment
        palace_keys = list(cls.PALACE_HEXAGRAMS.keys())
        palace = palace_keys[branch_idx % 8]
        hex_nums = cls.PALACE_HEXAGRAMS[palace]
        # Pick hexagram based on stem within the palace
        hex_num = hex_nums[stem_idx % len(hex_nums)]
        return HEXAGRAM_BY_NUMBER[hex_num]

    @classmethod
    def day_pillar_report(cls, day_stem: str, day_branch: str) -> Dict:
        """Generate a full hexagram report for a Day Pillar."""
        h = cls.day_pillar_to_hexagram(day_stem, day_branch, method="composite")
        stem_t = cls.STEM_TO_TRIGRAM.get(day_stem)
        branch_t = cls.BRANCH_TO_TRIGRAM.get(day_branch)
        rel = cls.trigram_element_relation(stem_t, branch_t) if stem_t and branch_t else "N/A"
        deriv = cls.all_derivatives(h)
        return {
            "day_pillar": f"{day_stem}{day_branch}",
            "hexagram": h.to_dict(),
            "stem_trigram": stem_t.name_cn if stem_t else None,
            "branch_trigram": branch_t.name_cn if branch_t else None,
            "element_relation": rel,
            "opposite": deriv["opposite"].to_dict(),
            "nuclear": deriv["nuclear"].to_dict(),
            "gua_ci": h.gua_ci,
        }

    # ── 5. Utility / Lookup ──────────────────────────────────────

    @staticmethod
    def by_number(n: int) -> Hexagram:
        return HEXAGRAM_BY_NUMBER[(n - 1) % 64 + 1]

    @staticmethod
    def by_binary(binary: str) -> Hexagram:
        if len(binary) != 6 or not set(binary).issubset({"0", "1"}):
            raise ValueError("Binary must be a 6-character string of 0s and 1s")
        return HEXAGRAM_BY_BINARY[binary]

    @staticmethod
    def search_by_name(query: str) -> List[Hexagram]:
        """Search hexagrams by Chinese or English name."""
        results = []
        q = query.lower()
        for h in HEXAGRAMS:
            if q in h.name_cn.lower() or q in h.name_en.lower():
                results.append(h)
        return results

    @staticmethod
    def leibniz_number(hexagram) -> int:
        """Leibniz mapping: binary string as number (Qian=63, Kun=0)."""
        h = hexagram if isinstance(hexagram, Hexagram) else HEXAGRAM_BY_NUMBER[hexagram]
        return int(h.binary, 2)

    @staticmethod
    def from_leibniz(n: int) -> Hexagram:
        """Get hexagram from Leibniz number (0–63)."""
        binary = format(n % 64, "06b")
        return HEXAGRAM_BY_BINARY[binary]
