"""
ShunShi — 顺势而为决策引擎
===========================
Kairos-integrated four-stage temporal decision system.

Architecture adapted from external "顺势而为决策支持系统":
  1. Personal Calibration  (个人校准)  — Bazi Four Pillars
  2. Situational Simulation (情景模拟)  — Coin-toss hexagram
  3. Environment Tuning     (环境调优)  — Fengshui direction
  4. Intuition Verification (直觉确认)  — Shengbei cup toss

All computations route through Kairos ground-truth modules:
  - logos.py      →  BaziCalculator (JDN day pillar, solar terms)
  - hexagram_calculator.py →  64 hexagrams (trigram-composed binary)
  - fengshui.py   →  Kua number & direction analysis
"""

import random
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any, Union

from .logos import BaziCalculator, SolarTermCalculator
from .harmon import BaziAnalyzer
from .hexagram_calculator import (
    HexagramCalculator,
    Hexagram as KairosHexagram,
    HEXAGRAM_BY_NUMBER,
    HEXAGRAM_BY_BINARY,
)
from .fengshui import kua_number, direction_analysis, analyze as fengshui_analyze


# ═══════════════════════════════════════════════════════════════
# COIN TOSS HEXAGRAM GENERATION
# ═══════════════════════════════════════════════════════════════


def _coin_toss() -> int:
    """
    Traditional three-coin method.
    Each coin: 2 (yang-heads) or 3 (yin-tails).
    Sum: 6=老阴(old-yin), 7=少阳(young-yang),
         8=少阴(young-yin), 9=老阳(old-yang).

    Probabilities match traditional distribution:
      P(6)=1/8  P(7)=3/8  P(8)=3/8  P(9)=1/8
    """
    return sum(random.choice([2, 3]) for _ in range(3))


def toss_hexagram() -> Dict:
    """
    Generate a complete hexagram reading via six coin tosses.

    Returns:
        {
            'lines': [7, 8, 9, 7, 6, 7],          # bottom→top (line 1 to line 6)
            'changing_positions': [3, 5],          # 1-based from bottom
            'original': <KairosHexagram>,          # 本卦
            'changed': <KairosHexagram> | None,    # 变卦 (None if no moving lines)
            'moving_line_count': 2,
        }
    """
    lines = [_coin_toss() for _ in range(6)]   # [line1, line2, ..., line6] bottom→top
    changing = [i + 1 for i, v in enumerate(lines) if v in (6, 9)]  # 1-based

    # Build Kairos binary: top→bottom
    yangs  = [1 if v in (7, 9) else 0 for v in lines]  # bottom→top
    binary = ''.join(str(yangs[5 - i]) for i in range(6))  # [5]=top, ..., [0]=bottom
    original = HEXAGRAM_BY_BINARY[binary]

    # Changed hexagram: flip changing lines
    if changing:
        flipped = [
            1 - yangs[i] if (i + 1) in changing else yangs[i]
            for i in range(6)
        ]
        chg_bin = ''.join(str(flipped[5 - i]) for i in range(6))
        changed = HEXAGRAM_BY_BINARY[chg_bin]
    else:
        changed = None

    return {
        'lines': lines,
        'changing_positions': changing,
        'original': original,
        'changed': changed,
        'moving_line_count': len(changing),
    }


# ═══════════════════════════════════════════════════════════════
# SHENGBEI (圣杯) VERIFICATION
# ═══════════════════════════════════════════════════════════════


def shengbei_toss() -> Tuple[List[str], bool]:
    """
    Simulated 圣杯 (moon-block) divination.
    Requires three consecutive '圣杯' results for approval.

    Returns:
        (results, approved)
    """
    cups = [random.choice(['圣杯', '笑杯', '盖杯']) for _ in range(3)]
    approved = cups.count('圣杯') == 3
    return cups, approved


# ═══════════════════════════════════════════════════════════════
# SHUNSHI DECISION ENGINE
# ═══════════════════════════════════════════════════════════════


class ShunShiEngine:
    """
    顺势决策引擎 — 四步闭环决策系统。

    Usage:
        engine = ShunShiEngine(datetime(1990, 5, 20, 10), gender='male')
        result = engine.full_decision("是否应该接受上海的工作机会？")
    """

    def __init__(self, birth_dt: datetime, gender: str = 'male'):
        self.birth = birth_dt
        self.gender = gender

        # ── Stage 1 dependencies ──
        self.bazi_calc = BaziCalculator()
        self.analyzer   = BaziAnalyzer()
        self.hex_calc   = HexagramCalculator()

        self._pillars = self.bazi_calc.calculate(
            birth_dt.year, birth_dt.month, birth_dt.day, birth_dt.hour
        )
        self._analysis = self.analyzer.analyze_chart(self._pillars)

        # Element balance from pillars
        self._element_count = self._count_elements()

        # Fengshui
        self._kua = kua_number(birth_dt.year, gender)
        self._fengshui = direction_analysis(self._kua)

    # ── helpers ─────────────────────────────────────────

    def _count_elements(self) -> Dict[str, int]:
        """Count Five Element occurrences across all four pillars."""
        counts = {'WOOD': 0, 'FIRE': 0, 'EARTH': 0, 'METAL': 0, 'WATER': 0}
        for attr in ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar']:
            stem, branch = getattr(self._pillars, attr)
            counts[stem.element.name] += 1
            counts[branch.element.name] += 1
        return counts

    # ── Stage 1: Personal Calibration ───────────────────

    def personal_calibration(self) -> Dict:
        """
        第一步：个人系统校准 — 八字排盘与五行分析。

        Returns:
            {
                '四柱': {'年': '庚午', '月': '辛巳', '日': '甲子', '时': '己巳'},
                '日主': '甲',
                '日主五行': 'WOOD',
                '五行分布': {'WOOD': 2, 'FIRE': 1, ...},
                '日主简评': str,
            }
        """
        dm = self._pillars.day_master
        dm_element = dm.element.name

        # Simple balance heuristic
        dm_count = self._element_count.get(dm_element, 0)
        if dm_count >= 4:
            balance_note = '日主过旺，喜克泄（克制或消耗为宜）'
        elif dm_count <= 1:
            balance_note = '日主偏弱，喜生扶（生助或比助为宜）'
        else:
            balance_note = '日主中和，顺势而为'

        return {
            '四柱': {
                '年': f'{self._pillars.year_pillar[0].character}{self._pillars.year_pillar[1].character}',
                '月': f'{self._pillars.month_pillar[0].character}{self._pillars.month_pillar[1].character}',
                '日': f'{self._pillars.day_pillar[0].character}{self._pillars.day_pillar[1].character}',
                '时': f'{self._pillars.hour_pillar[0].character}{self._pillars.hour_pillar[1].character}',
            },
            '日主': dm.character,
            '日主五行': dm_element,
            '日主阴阳': '阳' if dm.polarity.value == 1 else '阴',
            '五行分布': self._element_count,
            '日主简评': balance_note,
        }

    # ── Stage 2: Situational Simulation ─────────────────

    def situational_simulation(self, question: str = '') -> Dict:
        """
        第二步：情景模拟 — 铜钱起卦得本卦/变卦。

        Returns:
            {
                '本卦': {'number': 3, 'name': '水雷屯', ...},
                '变卦': {...} | None,
                '变爻': [3, 5],
                '爻象': [7, 8, 9, 7, 6, 7],
                '解读提示': str,
            }
        """
        reading = toss_hexagram()

        orig = reading['original']
        chg  = reading.get('changed')

        # Interpretation prompt (LLM-ready placeholder)
        if chg:
            tip = (
                f'当前本卦 {orig.number} {orig.name_cn}（{orig.name_en}），'
                f'变卦 {chg.number} {chg.name_cn}（{chg.name_en}），'
                f'变爻位置第{reading["changing_positions"]}爻。'
                f'请结合问题「{question}」解读本卦之机和变爻之转。'
            )
        else:
            tip = (
                f'当前本卦 {orig.number} {orig.name_cn}（{orig.name_en}），'
                f'无变爻，静卦。'
                f'请结合问题「{question}」解读卦象之势。'
            )

        return {
            '本卦': orig.to_dict(),
            '变卦': chg.to_dict() if chg else None,
            '变爻': reading['changing_positions'],
            '爻象': reading['lines'],
            '解读提示': tip,
        }

    # ── Stage 3: Environment Tuning ─────────────────────

    def environment_tuning(self) -> Dict:
        """
        第三步：环境调优 — 根据命卦和日主五行给方位建议。

        Returns:
            {
                '命卦': int,
                '五行': str,
                '宅命分组': str,
                '最佳方位': str,
                '日主五行': str,
                '综合建议': str,
            }
        """
        dm_elem = self._pillars.day_master.element.name
        elem_cn = {'WOOD': '木', 'FIRE': '火', 'EARTH': '土',
                   'METAL': '金', 'WATER': '水'}

        return {
            '命卦': self._fengshui['命卦'],
            '五行': self._fengshui['五行'],
            '宅命分组': self._fengshui['宅命分组'],
            '最佳方位': self._fengshui['最佳方位'],
            '日主五行': elem_cn.get(dm_elem, dm_elem),
            '综合建议': (
                f'日主属{elem_cn.get(dm_elem, dm_elem)}，'
                f'命卦{self._fengshui["命卦"]}（{self._fengshui["宅命分组"]}）。'
                f'空间布置宜以{self._fengshui["最佳方位"]}为尊位。'
            ),
        }

    # ── Stage 4: Intuition Verification ─────────────────

    def intuition_verification(self) -> Dict:
        """
        第四步：直觉确认 — 模拟圣杯掷筊。

        Returns:
            {
                '掷筊结果': ['圣杯', '笑杯', '盖杯'],
                '通过': bool,
                '提示': str,
            }
        """
        cups, approved = shengbei_toss()
        return {
            '掷筊结果': cups,
            '通过': approved,
            '提示': (
                '神明应允，可行'
                if approved
                else f'未获三圣杯（{", ".join(cups)}），建议三思或择日再问'
            ),
        }

    # ── Stage 5: Full Decision (all four stages) ────────

    def full_decision(self, question: str = '') -> Dict:
        """
        运行完整四步决策闭环。

        Returns:
            {
                '问题': str,
                '个人校准': {...Stage 1...},
                '情景模拟': {...Stage 2...},
                '环境调优': {...Stage 3...},
                '直觉确认': {...Stage 4...},
                '综合决断': str,
            }
        """
        cali = self.personal_calibration()
        sim  = self.situational_simulation(question)
        env  = self.environment_tuning()
        cups = self.intuition_verification()

        # Synthesise a summary
        orig_hex = sim['本卦']['name']
        summary = (
            f'日主{cali["日主"]}（{cali["日主五行"]}{cali["日主阴阳"]}），'
            f'{cali["日主简评"]}。'
            f'起卦得《{orig_hex}》'
        )
        if sim['变卦']:
            summary += f'，之《{sim["变卦"]["name"]}》'
        summary += (
            f'，变爻{sim["变爻"]}。'
            f'地利取{env["最佳方位"]}方。'
            f'圣杯{"通过" if cups["通过"] else "未通过"}。'
        )

        return {
            '问题': question,
            '个人校准': cali,
            '情景模拟': sim,
            '环境调优': env,
            '直觉确认': cups,
            '综合决断': summary,
        }

    # ── Convenience ─────────────────────────────────────

    def kua_info(self) -> Dict:
        """Quick access to fengshui Kua number info."""
        return self._fengshui

    def bazi_summary(self) -> str:
        """One-line bazi summary."""
        p = self._pillars
        return (
            f'{p.year_pillar[0].character}{p.year_pillar[1].character} '
            f'{p.month_pillar[0].character}{p.month_pillar[1].character} '
            f'{p.day_pillar[0].character}{p.day_pillar[1].character} '
            f'{p.hour_pillar[0].character}{p.hour_pillar[1].character}'
        )
