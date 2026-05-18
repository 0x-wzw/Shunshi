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

# 立春日期表：每年立春在 February 的日期
# Default: Feb 4. Occasional Feb 5 (e.g. 1980, 2017).
_LICHUN_DAY = {
    1980: 5, 1979: 4, 1978: 4, 1977: 4,
    2017: 5, 2016: 4, 2015: 4,
    # Default: Feb 4
}

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


def _get_chinese_birth_year(year: int, month: int, day: int) -> int:
    """Return the Chinese calendar birth year accounting for 立春 boundary.

    Before 立春, the Chinese year is YEAR - 1.
    """
    lichun_day = _LICHUN_DAY.get(year, 4)
    if month < 2 or (month == 2 and day < lichun_day):
        return year - 1
    return year


def kua_number(birth_year: int, gender: str = 'male') -> int:
    """
    根据出生年份计算命卦数 (1-9)。

    注意：此函数假定传入的是**农历年号**（已考虑立春边界）。
    如需从公历出生日期直接计算，请使用 kua_number_from_date()。

    Args:
        birth_year: 出生年份（农历，已过立春或已调整）
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


def kua_number_from_date(year: int, month: int, day: int, gender: str = 'male') -> int:
    """根据公历出生日期计算命卦数 (1-9)，自动处理立春边界。

    对于公历 Jan 1 – Feb 3/4 出生的人，
    农历年份比公历小 1（例如 1980-01-05 → 1979 年）。

    Args:
        year: 公历出生年份
        month: 公历出生月份 (1=Jan)
        day: 公历出生日
        gender: 'male' | 'female'

    Returns:
        命卦数 1-9（5 寄 2/8）
    """
    chinese_year = _get_chinese_birth_year(year, month, day)
    return kua_number(chinese_year, gender)


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


def analyze(birth_year: int, gender: str = 'male', birth_month: int = None, birth_day: int = None) -> Dict:
    """一站式命卦分析。

    Args:
        birth_year: 公历出生年份
        gender: 'male' | 'female'
        birth_month: 公历出生月份 (1=Jan)，可选
        birth_day: 公历出生日，可选
    """
    if birth_month is not None and birth_day is not None:
        kua = kua_number_from_date(birth_year, birth_month, birth_day, gender)
    else:
        kua = kua_number(birth_year, gender)
    return direction_analysis(kua)
