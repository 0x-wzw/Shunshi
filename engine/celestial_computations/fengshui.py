"""
Fengshui — 风水命卦与方位分析
==============================
八宅派命卦计算与吉凶方位判断（东四命/西四命体系）。

算法来源：外部"顺势而为决策系统"
适配 Kairos：保持原有正确算法，添加完整吉位映射。
"""

from typing import Dict, List, Optional, Tuple

# ── 命卦常量 ─────────────────────────────────────────

EAST_LIFE = {1, 3, 4, 9}      # 东四命
WEST_LIFE = {2, 6, 7, 8}      # 西四命
CENTRE = {5}                   # 中宫（男寄坤2、女寄艮8）

# 八宅吉凶方位
DIRECTIONS_EIGHT = ['生气', '天医', '延年', '伏位', '祸害', '六煞', '五鬼', '绝命']

# 命卦 → 最佳方位
KUA_BEST_DIRECTION = {
    1: '坎（北）',
    2: '坤（西南）',
    3: '震（东）',
    4: '巽（东南）',
    6: '乾（西北）',
    7: '兑（西）',
    8: '艮（东北）',
    9: '离（南）',
}

# ── 命卦计算 ─────────────────────────────────────────


def _reduce_to_single_digit(n: int) -> int:
    """递归折至个位数（用于命卦计算）。"""
    while n >= 10:
        n = sum(int(d) for d in str(n))
    return n


def kua_number(birth_year: int, gender: str = 'male') -> int:
    """
    根据出生年份计算命卦数 (1-9)。

    Args:
        birth_year: 出生年份（公元）
        gender: 'male' | 'female'

    Returns:
        命卦数 1-9（5 寄 2/8）
    """
    year_sum = sum(int(d) for d in str(birth_year))
    base = _reduce_to_single_digit(year_sum)

    if gender == 'male':
        kua = 11 - base
    else:
        kua = 4 + base

    kua = _reduce_to_single_digit(kua)

    # 5 中宫寄位
    if kua == 5:
        return 2 if gender == 'male' else 8

    return kua


def _get_life_group(kua: int) -> str:
    """命卦分组：东四命 / 西四命。"""
    if kua in EAST_LIFE:
        return '东四命'
    if kua in WEST_LIFE:
        return '西四命'
    return '中宫'


def _get_element(kua: int) -> str:
    """命卦对应的五行。"""
    mapping = {
        1: '水', 2: '土', 3: '木', 4: '木',
        6: '金', 7: '金', 8: '土', 9: '火',
    }
    return mapping.get(kua, '未知')


# ── 方位分析 ─────────────────────────────────────────


def direction_analysis(kua: int) -> Dict:
    """
    根据命卦分析吉凶方位（八宅派简化）。

    Returns:
        {
            '命卦': int,
            '五行': str,
            '宅命分组': str,
            '最佳方位': str,
            '建议描述': str,
        }
    """
    life_group = _get_life_group(kua)
    best = KUA_BEST_DIRECTION.get(kua, '未知')
    element = _get_element(kua)

    return {
        '命卦': kua,
        '五行': element,
        '宅命分组': life_group,
        '最佳方位': best,
        '建议描述': (
            f'{life_group}，五行属{element}。'
            f'最佳方位为{best}，宜面向此方或在此方活动。'
        ),
    }


# ── 简便接口 ─────────────────────────────────────────


def analyze(birth_year: int, gender: str = 'male') -> Dict:
    """一站式命卦分析（给定出生年份和性别）。"""
    kua = kua_number(birth_year, gender)
    return direction_analysis(kua)
