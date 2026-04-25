#!/usr/bin/env python3
"""
八字双时辰对参（天文精算版）— Generic Bazi Engine
Astrum Harmonis Celestialis — Complete computational framework

Features:
1. 太阳黄经精确计算节气（ephem）- Solar longitude for precise solar terms
2. 七政星历（日月+五星位置）- Planetary positions (7 celestial bodies)
3. 周易六十四卦（I Ching 64 Hexagrams）- Complete hexagram system
4. 大运、旬空、旺相休囚死、刑害破 - Da Yun, Xun Kong, Wu Xing states
5. 天干合化、地支三合/三会/六合/六冲 - Stem/Branch interactions
6. 藏干十神、纳音五行 - Hidden stems, Ten Gods, Na Yin

Usage:
    Configure via BAZI_CONFIG_PATH env var or modify CONFIG dict below.
    JSON format: {"natal_chart": {...}, "day_master": "...", ...}

Environment:
    BAZI_CONFIG_PATH - Path to JSON configuration file
"""

import math
from datetime import datetime, timezone, timedelta

try:
    import ephem
    EPHEM_AVAILABLE = True
except ImportError:
    EPHEM_AVAILABLE = False

# ═══════════════════════════════════════════════════════════════════
# 天文引擎常量
# ═══════════════════════════════════════════════════════════════════

SOLAR_TERMS_CN = [
    '立春','雨水','惊蛰','春分','清明','谷雨',
    '立夏','小满','芒种','夏至','小暑','大暑',
    '立秋','处暑','白露','秋分','寒露','霜降',
    '立冬','小雪','大雪','冬至','小寒','大寒'
]
BRANCH_ORDER = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']
WESTERN_ZODIAC = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼']

OBSERVER_LAT = '3.1390'
OBSERVER_LON = '101.6869'

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION — Set your personal chart or use BAZI_CONFIG_PATH
# ═══════════════════════════════════════════════════════════════════

import json, os
from pathlib import Path

def load_config():
    """Load configuration from file (BAZI_CONFIG_PATH env var) or use defaults."""
    config_path = os.getenv('BAZI_CONFIG_PATH')
    if config_path and Path(config_path).exists():
        try:
            with open(config_path) as f:
                data = json.load(f)
                if data:
                    return data
        except (json.JSONDecodeError, IOError):
            pass
    # Default: demo configuration — replace with your own
    return {
        "natal_chart": {
            "年": {"干": "甲", "支": "子"},   # Example: Wood Rat
            "月": {"干": "丙", "支": "寅"},  # Fire Tiger
            "日": {"干": "戊", "支": "辰"},  # Earth Dragon
            "时": {"干": "庚", "支": "午"},  # Metal Horse
        },
        "day_master": "戊",
        "luck_pillars": [
            ("丁卯", 4, 14), ("丙寅", 14, 24), ("乙丑", 24, 34),
            ("甲子", 34, 44), ("癸亥", 44, 54), ("壬戌", 54, 64),
        ],
        "birth_info": {"year": 1990, "month": 1, "day": 1, "hour": 12, "minute": 0},
        "observer": {"lat": "39.9042", "lon": "116.4074"},
    }

CONFIG = load_config()
本命 = CONFIG["natal_chart"]  # Natl chart
日主 = CONFIG["day_master"]   # Day Master
LUCK_PILLAR_SEQUENCE = CONFIG["luck_pillars"]
OBSERVER_LAT = CONFIG["observer"]["lat"]
OBSERVER_LON = CONFIG["observer"]["lon"]

# ═══════════════════════════════════════════════════════════════════
# 天干地支五行常量
# ═══════════════════════════════════════════════════════════════════

天干 = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
地支 = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
五行 = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土',
        '庚':'金','辛':'金','壬':'水','癸':'水'}

# 十神 — auto-generated based on Day Master
def 生成十神映射(day_master):
    """Generate Ten Gods mapping for given Day Master."""
    if day_master not in 天干:
        return {}
    dm_idx = 天干.index(day_master)
    dm_element = 五行[day_master]
    
    result = {}
    for stem in 天干:
        stem_idx = 天干.index(stem)
        stem_el = 五行[stem]
        
        # 生我者为印 Resource
        if stem_el == {'木':'水','火':'木','土':'火','金':'土','水':'金'}[dm_element]:
            result[stem] = '正印' if stem_idx % 2 == 0 else '偏印'
        # 我生者为食伤 Output
        elif dm_element == {'木':'水','火':'木','土':'火','金':'土','水':'金'}[stem_el]:
            result[stem] = '伤官' if stem_idx % 2 == 0 else '食神'
        # 克我者为官杀 Officer
        elif stem_el == {'木':'金','火':'水','土':'木','金':'火','水':'土'}[dm_element]:
            result[stem] = '正官' if stem_idx % 2 == 0 else '七杀'
        # 我克者为财 Wealth
        elif dm_element == {'木':'金','火':'水','土':'木','金':'火','水':'土'}[stem_el]:
            result[stem] = '正财' if stem_idx % 2 == 0 else '偏财'
        # 同我者为比劫 Sibling
        else:
            result[stem] = '比肩' if stem_idx == dm_idx else '劫财'
    return result

十神 = 生成十神映射(日主)
十神配置 = CONFIG.get('ten_gods', 十神)  # Allow override

# 天干合化
天干合 = {'甲':'己合土','乙':'庚合金','丙':'辛合水','丁':'壬合木','戊':'癸合火'}
天干合对 = {'甲':'己','己':'甲','乙':'庚','庚':'乙','丙':'辛','辛':'丙','丁':'壬','壬':'丁','戊':'癸','癸':'戊'}

# 地支六冲/六合/六害/六破/三刑/三合
六冲 = {'子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥',
        '午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳'}
六合 = {'子':'丑合土','丑':'子合土','寅':'亥合木','亥':'寅合木',
        '卯':'戌合火','戌':'卯合火','辰':'酉合金','酉':'辰合金',
        '巳':'申合水','申':'巳合水','午':'未合火土','未':'午合火土'}
六害 = {'子':'未','丑':'午','寅':'巳','卯':'辰','申':'亥','酉':'戌',
        '未':'子','午':'丑','巳':'寅','辰':'卯','亥':'申','戌':'酉'}
六破 = {'子':'酉','丑':'辰','寅':'亥','卯':'午','巳':'申','未':'戌',
        '酉':'子','辰':'丑','亥':'寅','午':'卯','申':'巳','戌':'未'}
三刑 = {
    '寅':'巳申无恩刑','巳':'申寅无恩刑','申':'寅巳无恩刑',
    '丑':'戌未恃势刑','戌':'未丑恃势刑','未':'丑戌恃势刑',
    '子':'卯无礼刑','卯':'子无礼刑'
}
三合 = {'申':'子辰合水局','子':'申辰合水局','辰':'申子合水局',
        '寅':'午戌合火局','午':'寅戌合火局','戌':'寅午合火局',
        '巳':'酉丑合金局','酉':'巳丑合金局','丑':'巳酉合金局',
        '亥':'卯未合木局','卯':'亥未合木局','未':'亥卯合木局'}

藏干 = {
    '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],
    '辰':['戊','乙','癸'],'巳':['丙','戊','庚'],'午':['丁','己'],'未':['己','丁','乙'],
    '申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲']
}

# 纳音五行（30对）
纳音 = [
    '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
    '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
    '霹雳火','松柏木','长流水','砂石金','山下火','平地木',
    '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
    '桑柘木','大溪水','沙中土','天上火','石榴木','大海水'
]

# 十二值日神
十二神 = ['建','除','满','平','定','执','破','危','成','收','开','闭']

# 煞方
煞方 = {
    '申':'南','子':'南','辰':'南',
    '寅':'北','午':'北','戌':'北',
    '亥':'西','卯':'西','未':'西',
    '巳':'东','酉':'东','丑':'东'
}

# ═══════════════════════════════════════════════════════════════════
# 周易六十四卦系统 (Zhouyi / I Ching 64 Gua System)
# ═══════════════════════════════════════════════════════════════════

# 伏羲先天八卦数 (Later Heaven sequence numbers)
先天八卦数 = {'乾':1, '兑':2, '离':3, '震':4, '巽':5, '坎':6, '艮':7, '坤':8}
先天八卦二进制 = {'乾':'111', '兑':'011', '离':'101', '震':'001', '巽':'110', '坎':'010', '艮':'100', '坤':'000'}

# 后天八卦 (Later Heaven / King Wen arrangement)
后天八卦 = {'坎':'北', '坤':'西南', '震':'东', '巽':'东南', '乾':'西北', '兑':'西', '艮':'东北', '离':'南'}

# 六十四卦 (64 Hexagrams) - Complete listing
# Format: (卦序, 卦名, 上卦, 下卦, 二进制, 卦意)
六十四卦表 = [
    (1, '乾', '乾', '乾', '111111', '天行健，君子以自强不息'),
    (2, '坤', '坤', '坤', '000000', '地势坤，君子以厚德载物'),
    (3, '屯', '坎', '震', '010001', '水雷屯，万物始生'),
    (4, '蒙', '艮', '坎', '100010', '山水蒙，启蒙教育'),
    (5, '需', '坎', '乾', '010111', '水天需，等待时机'),
    (6, '讼', '乾', '坎', '111010', '天水讼，争讼'),
    (7, '师', '坤', '坎', '000010', '地水师，率众'),
    (8, '比', '坎', '坤', '010000', '水地比，亲近'),
    (9, '小畜', '巽', '乾', '110111', '风天小畜，小有蓄积'),
    (10, '履', '乾', '兑', '111011', '天泽履，履行'),
    (11, '泰', '坤', '乾', '000111', '地天泰，通泰'),
    (12, '否', '乾', '坤', '111000', '天地否，闭塞'),
    (13, '同人', '乾', '离', '111101', '天火同人，与人同道'),
    (14, '大有', '离', '乾', '101111', '火天大有，盛大丰盛'),
    (15, '谦', '坤', '艮', '000100', '地山谦，谦虚'),
    (16, '豫', '震', '坤', '001000', '雷地豫，愉悦'),
    (17, '随', '兑', '震', '011001', '泽雷随，顺从'),
    (18, '蛊', '艮', '巽', '100110', '山风蛊，腐朽生变'),
    (19, '临', '坤', '兑', '000011', '地泽临，督导'),
    (20, '观', '巽', '坤', '110000', '风地观，观察'),
    (21, '噬嗑', '离', '震', '101001', '火雷噬嗑，明罚敕法'),
    (22, '贲', '艮', '离', '100101', '山火贲，文饰'),
    (23, '剥', '艮', '坤', '100000', '山地剥，剥落'),
    (24, '复', '坤', '震', '000001', '地雷复，反复'),
    (25, '无妄', '乾', '震', '111001', '天雷无妄，无妄之灾'),
    (26, '大畜', '艮', '乾', '100111', '山天大畜，蓄积'),
    (27, '颐', '艮', '震', '100001', '山雷颐，颐养'),
    (28, '大过', '兑', '巽', '011110', '泽风大过，过度'),
    (29, '坎', '坎', '坎', '010010', '坎为水，险陷'),
    (30, '离', '离', '离', '101101', '离为火，光明'),
    (31, '咸', '兑', '艮', '011100', '泽山咸，感应'),
    (32, '恒', '震', '巽', '001110', '雷风恒，恒久'),
    (33, '遁', '乾', '艮', '111100', '天山遁，退避'),
    (34, '大壮', '震', '乾', '001111', '雷天大壮，强盛'),
    (35, '晋', '离', '坤', '101000', '火地晋，晋升'),
    (36, '明夷', '坤', '离', '000101', '地火明夷，光明受损'),
    (37, '家人', '巽', '离', '110101', '风火家人，家庭'),
    (38, '睽', '离', '兑', '101011', '火泽睽，背离'),
    (39, '蹇', '坎', '艮', '010100', '水山蹇，险阻'),
    (40, '解', '震', '坎', '001010', '雷水解，解脱'),
    (41, '损', '艮', '兑', '100011', '山泽损，减损'),
    (42, '益', '巽', '震', '110001', '风雷益，增益'),
    (43, '夬', '兑', '乾', '011111', '泽天夬，决断'),
    (44, '姤', '乾', '巽', '111110', '天风姤，相遇'),
    (45, '萃', '兑', '坤', '011000', '泽地萃，聚集'),
    (46, '升', '坤', '巽', '000110', '地风升，上升'),
    (47, '困', '兑', '坎', '011010', '泽水困，困穷'),
    (48, '井', '坎', '巽', '010110', '水风井，井水'),
    (49, '革', '兑', '离', '011101', '泽火革，变革'),
    (50, '鼎', '离', '巽', '101110', '火风鼎，鼎新'),
    (51, '震', '震', '震', '001001', '震为雷，震动'),
    (52, '艮', '艮', '艮', '100100', '艮为山，静止'),
    (53, '渐', '巽', '艮', '110100', '风山渐，渐进'),
    (54, '归妹', '震', '兑', '001011', '雷泽归妹，嫁娶'),
    (55, '丰', '震', '离', '001101', '雷火丰，盛大'),
    (56, '旅', '离', '艮', '101100', '火山旅，旅行'),
    (57, '巽', '巽', '巽', '110110', '巽为风，顺从'),
    (58, '兑', '兑', '兑', '011011', '兑为泽，喜悦'),
    (59, '涣', '巽', '坎', '110010', '风水涣，涣散'),
    (60, '节', '坎', '兑', '010011', '水泽节，节制'),
    (61, '中孚', '巽', '兑', '110011', '风泽中孚，诚信'),
    (62, '小过', '震', '艮', '001100', '雷山小过，小有过越'),
    (63, '既济', '坎', '离', '010101', '水火既济，已成'),
    (64, '未济', '离', '坎', '101010', '火水未济，未成'),
]

# 卦名索引
卦名索引 = {g[1]: g for g in 六十四卦表}

# 干支对应八卦 (纳甲法)
# 根据京房纳甲体系 - 天干配卦
def 干配八卦(stem):
    干卦对应 = {
        '甲':'乾', '乙':'坤', '丙':'艮', '丁':'兑',
        '戊':'坎', '己':'离', '庚':'震', '辛':'巽',
        '壬':'乾', '癸':'坤'
    }
    return 干卦对应.get(stem, '乾')

def 支配八卦(branch):
    支卦对应 = {
        '子':'坎', '丑':'坤', '寅':'艮', '卯':'震',
        '辰':'巽', '巳':'离', '午':'离', '未':'坤',
        '申':'乾', '酉':'兑', '戌':'乾', '亥':'乾'
    }
    return 支卦对应.get(branch, '乾')

# 从四柱起卦 (时间卦/八字卦)
def 四柱起卦(四柱, method='日柱'):
    """Generate hexagram from Bazi pillars.
    method: '日柱' (day stem/branch) or '年月' (year/month)
    """
    if method == '日柱':
        上卦 = 干配八卦(四柱['日']['干'])
        下卦 = 支配八卦(四柱['日']['支'])
    elif method == '年月':
        上卦 = 干配八卦(四柱['年']['干'])
        下卦 = 支配八卦(四柱['月']['支'])
    else:
        上卦 = '乾'
        下卦 = '乾'
    
    # Find hexagram
    return 起卦(上卦, 下卦)

def 起卦(upper_trigram, lower_trigram):
    """Generate hexagram from upper and lower trigrams."""
    for g in 六十四卦表:
        if g[2] == upper_trigram and g[3] == lower_trigram:
            return g
    return None

def 卦二进制(卦序):
    """Get binary encoding of hexagram (1=Yang, 0=Yin)."""
    if 1 <= 卦序 <= 64:
        return 六十四卦表[卦序-1][4]
    return None

def 错卦(卦序):
    """Opposite hexagram - flip all 6 lines."""
    binary = 卦二进制(卦序)
    if not binary:
        return None
    flipped = ''.join('0' if b == '1' else '1' for b in binary)
    for g in 六十四卦表:
        if g[4] == flipped:
            return g
    return None

def 互卦(卦序):
    """Nuclear hexagram - lines 234 and 345.
    从第2、3、4爻取互卦上卦，从第3、4、5爻取互卦下卦"""
    binary = 卦二进制(卦序)
    if not binary:
        return None
    # Original: line6 line5 line4 line3 line2 line1 (from top)
    # But stored as: 111111 (top line first in traditional binary)
    # Actually: position 0 = top line, position 5 = bottom line
    upper = binary[2:5]   # lines 3,4,5 (indices 2,3,4)
    lower = binary[3:6]   # lines 4,5,6 (indices 3,4,5)
    nuclear_bin = upper + lower
    for g in 六十四卦表:
        if g[4] == nuclear_bin:
            return g
    return None

def 复卦(卦序):
    """Returning hexagram - reverse the order."""
    卦 = 六十四卦表[卦序-1]
    return 起卦(卦[3], 卦[2])  # swap upper/lower

# 卦象与五行、方位、数字对应
def 卦五行(卦名):
    五行属性 = {
        '乾':'金', '兑':'金', '离':'火', '震':'木',
        '巽':'木', '坎':'水', '艮':'土', '坤':'土'
    }
    return 五行属性.get(卦名[0], '金')  # Based on first char (upper trigram usually)

# 体用分析 (Main Body / Application)
def 体用分析(主卦, 年支=None, 月支=None):
    """Analyze body (self) and application (other) in hexagram.
    Based on month branch determining '旺' trigram."""
    月建旺相 = {'寅':'木', '卯':'木', '巳':'火', '午':'火', 
                '申':'金', '酉':'金', '亥':'水', '子':'水',
                '辰':'土', '戌':'土', '丑':'土', '未':'土'}
    月令五行 = 月建旺相.get(月支, '土') if 月支 else '火'
    # 体 = 克我者为用，我克者为体 (simplified)
    return 月令五行

def 卦象解读(卦序, 月令支=None, 动爻=None):
    """Generate interpretation text for hexagram."""
    卦 = 六十四卦表[卦序-1]
    lines = []
    lines.append(f"【{卦[1]}卦】第{卦序}卦")
    lines.append(f"卦象：{卦[2]}上{卦[3]}下")
    lines.append(f"卦义：{卦[5]}")
    
    # Opposite
    错 = 错卦(卦序)
    if 错:
        lines.append(f"错卦：{错[1]}卦（阴阳全变，{错[5]}）")
    
    # Nuclear
    互 = 互卦(卦序)
    if 互:
        lines.append(f"互卦：{互[1]}卦（内部变化，{互[5]}）")
    
    # Moving line interpretation
    if 动爻 and 1 <= 动爻 <= 6:
        lines.append(f"动爻：第{动爻}爻")
        lines.append(f"之卦：由{卦[1]}变其动爻，事态将转向{'吉' if 动爻 in [1,5] else '需谨慎'}")
    
    # Month influence
    if 月令支:
        体用 = 体用分析(卦, 月支=月令支)
        lines.append(f"月令 {月令支}，体用 {体用}")
    
    return ' | '.join(lines)

# 旺相休囚死
旺相休囚 = {
    '寅':{'木':'旺','火':'相','水':'休','金':'囚','土':'死'},
    '卯':{'木':'旺','火':'相','水':'休','金':'囚','土':'死'},
    '巳':{'火':'旺','土':'相','木':'休','水':'囚','金':'死'},
    '午':{'火':'旺','土':'相','木':'休','水':'囚','金':'死'},
    '申':{'金':'旺','水':'相','土':'休','火':'囚','木':'死'},
    '酉':{'金':'旺','水':'相','土':'休','火':'囚','木':'死'},
    '亥':{'水':'旺','木':'相','金':'休','土':'囚','火':'死'},
    '子':{'水':'旺','木':'相','金':'休','土':'囚','火':'死'},
    '辰':{'土':'旺','金':'相','火':'休','木':'囚','水':'死'},
    '戌':{'土':'旺','金':'相','火':'休','木':'囚','水':'死'},
    '丑':{'土':'旺','金':'相','火':'休','木':'囚','水':'死'},
    '未':{'土':'旺','金':'相','火':'休','木':'囚','水':'死'},
}

# ═══════════════════════════════════════════════════════════════════
# 工具函数
# ═══════════════════════════════════════════════════════════════════

def 取纳音(stem, branch):
    sti = 天干.index(stem)
    bri = 地支.index(branch)
    for k in range(60):
        if k % 10 == sti and k % 12 == bri:
            return 纳音[k // 2]
    return '未知'

def 公历转儒略日(year, month, day):
    a = (14 - month) // 12
    y = year + 4800 - a
    m = month + 12 * a - 3
    return day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045

def 六十甲子序(jdn):
    return (jdn - 11) % 60

def 序转干支(idx):
    return 天干[idx % 10], 地支[idx % 12]

def 年柱(year, month, day):
    if month < 2 or (month == 2 and day < 4):
        eff_year = year - 1
    else:
        eff_year = year
    sti = (eff_year - 4) % 10
    bri = (eff_year - 4) % 12
    return 天干[sti], 地支[bri]

def 月干(year_stem, month_branch):
    寅序 = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']
    br_idx = 寅序.index(month_branch)
    ysi = 天干.index(year_stem)
    group = ysi % 5
    起干 = [2, 4, 6, 8, 0]
    stem_idx = (起干[group] + br_idx) % 10
    return 天干[stem_idx]

def 时支(hour):
    时辰表 = [(23,1,'子'),(1,3,'丑'),(3,5,'寅'),(5,7,'卯'),(7,9,'辰'),(9,11,'巳'),
              (11,13,'午'),(13,15,'未'),(15,17,'申'),(17,19,'酉'),(19,21,'戌'),(21,23,'亥')]
    for start, end, branch in 时辰表:
        if start == 23:
            if hour >= 23 or hour < 1:
                return branch
        elif start <= hour < end:
            return branch
    return '子'

def 时干(day_stem, hour_branch):
    dsi = 天干.index(day_stem)
    group = dsi % 5
    起干 = [0, 2, 4, 6, 8]
    hbi = 地支.index(hour_branch)
    stem_idx = (起干[group] + hbi) % 10
    return 天干[stem_idx]

def 取十二神(month_branch, day_branch):
    mb_idx = 地支.index(month_branch)
    db_idx = 地支.index(day_branch)
    diff = (db_idx - mb_idx) % 12
    return 十二神[diff]

def 五行数(四柱):
    counts = {'木':0,'火':0,'土':0,'金':0,'水':0}
    for p in 四柱.values():
        counts[五行[p['干']]] += 1
        for cg in 藏干.get(p['支'], []):
            counts[五行[cg]] += 0.5
    return counts

def 旬空(day_idx):
    xun = (day_idx // 10) % 6
    k1 = (10 - 2 * xun) % 12
    k2 = (11 - 2 * xun) % 12
    return 地支[k1], 地支[k2]

def 旺相状态(month_branch):
    return 旺相休囚.get(month_branch, {})

def 胎元(month_stem, month_branch):
    msi = 天干.index(month_stem)
    mbi_1 = 地支.index(month_branch) + 1   # 1-based for 地支 cycle
    tai_stem = 天干[(msi + 1) % 10]
    tai_branch = 地支[(mbi_1 + 3 - 1) % 12]
    return tai_stem, tai_branch

# ═══════════════════════════════════════════════════════════════════
# 天文引擎
# ═══════════════════════════════════════════════════════════════════

def get_observer(date_utc):
    ob = ephem.Observer()
    ob.lat = KL_LAT
    ob.lon = KL_LON
    ob.date = ephem.Date(date_utc)
    ob.elevation = 0
    ob.pressure = 0
    return ob

def get_sun_longitude(observer):
    sun = ephem.Sun()
    sun.compute(observer)
    eq = ephem.Equatorial(sun.ra, sun.dec, epoch=ephem.J2000)
    ecl = ephem.Ecliptic(eq)
    return math.degrees(ecl.lon) % 360

def get_solar_term_name(lon):
    idx = int(((lon - 315 + 360) % 360) / 15)
    return SOLAR_TERMS_CN[idx % 24]

def get_month_branch_from_lon(lon):
    lon_shifted = (lon + 45) % 360
    idx = int(lon_shifted // 30)
    return BRANCH_ORDER[idx]

def get_zodiac_sign(lon_deg):
    idx = int(lon_deg // 30)
    return WESTERN_ZODIAC[idx % 12]

def get_planetary_positions(observer):
    bodies = {
        '太阳': ephem.Sun(),
        '月亮': ephem.Moon(),
        '水星': ephem.Mercury(),
        '金星': ephem.Venus(),
        '火星': ephem.Mars(),
        '木星': ephem.Jupiter(),
        '土星': ephem.Saturn()
    }
    results = []
    for name, body in bodies.items():
        try:
            body.compute(observer)
            eq = ephem.Equatorial(body.ra, body.dec, epoch=ephem.J2000)
            ecl = ephem.Ecliptic(eq)
            lon = math.degrees(ecl.lon) % 360
            results.append((name, lon, get_zodiac_sign(lon)))
        except Exception:
            pass
    return results

# ═══════════════════════════════════════════════════════════════════
# 大运引擎 (命主专用)
# ═══════════════════════════════════════════════════════════════════

# 示例命局男命 → 逆排 from 丙子
大运序列 = [
    ('乙亥', 4, 14),
    ('甲戌', 14, 24),
    ('癸酉', 24, 34),
    ('壬申', 34, 44),
    ('辛未', 44, 54),
    ('庚午', 54, 64),
    ('己巳', 64, 74),
    ('戊辰', 74, 84),
]

def 当前大运(age):
    for stem_branch, start, end in 大运序列:
        if start <= age < end:
            return stem_branch, start, end
    return 大运序列[-1][0], 大运序列[-1][1], 大运序列[-1][2]

# ═══════════════════════════════════════════════════════════════════
# 关系引擎
# ═══════════════════════════════════════════════════════════════════

def 参对本命柱柱(natal, transit):
    aspects = []
    ns, nb = natal['干'], natal['支']
    ts, tb = transit['干'], transit['支']

    # 天干合化
    if ts == 天干合对.get(ns, ''):
        he_name = 天干合.get(ns, '合')
        # Extract element from strings like "己合土" → "合土" if ns is not prefix
        he_display = f"{ns}{ts}{he_name[2:]}" if len(he_name) == 4 else he_name
        aspects.append(f"✦ 天干合：{he_display}")

    # 五行生克
    生我 = {'木':'水','火':'木','土':'火','金':'土','水':'金'}
    我生 = {'木':'火','火':'土','土':'金','金':'水','水':'木'}
    克我 = {'木':'金','火':'水','土':'木','金':'火','水':'土'}

    if 生我.get(五行[ns]) == 五行[ts]:
        aspects.append(f"✦ {ts}{五行[ts]}生{ns}{五行[ns]} — 生扶")
    elif 克我.get(五行[ns]) == 五行[ts]:
        aspects.append(f"⚠ {ts}{五行[ts]}克{ns}{五行[ns]} — 克制")
    elif 我生.get(五行[ns]) == 五行[ts]:
        aspects.append(f"~ {ns}{五行[ns]}生{ts}{五行[ts]} — 泄耗")
    else:
        我克 = {v:k for k,v in 克我.items()}
        if 我克.get(五行[ns]) == 五行[ts]:
            aspects.append(f"~ {ns}{五行[ns]}克{ts}{五行[ts]} — 耗力")

    # 同五行
    if ns == ts:
        aspects.append(f"🔄 伏吟：{ns}重叠")

    # 地支六冲
    if 六冲.get(nb) == tb:
        aspects.append(f"🚨 六冲：{nb}↔{tb}")
    # 地支六合
    if nb in 六合 and tb in 六合.get(nb, ''):
        aspects.append(f"✦ 六合：{nb}+{tb}")
    # 六害
    if 六害.get(nb) == tb:
        aspects.append(f"⚡ 六害：{nb}害{tb}")
    # 六破
    if 六破.get(nb) == tb:
        aspects.append(f"⚡ 六破：{nb}破{tb}")
    # 三刑
    if nb in 三刑 and tb in 三刑[nb]:
        aspects.append(f"⚠ 三刑：{三刑[nb]}")
    # 三合
    if nb in 三合 and (tb in 三合[nb]):
        aspects.append(f"✦ 三合：{三合[nb]}")

    # 十神
    tg = 十神.get(ts, '?')
    if tg != '?':
        aspects.append(f"十神：{tg}")

    return aspects

# ═══════════════════════════════════════════════════════════════════
# 流运计算
# ═══════════════════════════════════════════════════════════════════

def 当前四柱(utc_dt):
    myt = timedelta(hours=8)
    local = utc_dt + myt
    year, month, day = local.year, local.month, local.day
    hour = local.hour

    ephem_ok = False
    sun_lon = None
    solar_term = 'N/A'
    month_branch = None
    planets = []

    if EPHEM_AVAILABLE:
        try:
            obs = get_observer(utc_dt)
            sun_lon = get_sun_longitude(obs)
            solar_term = get_solar_term_name(sun_lon)
            month_branch = get_month_branch_from_lon(sun_lon)
            planets = get_planetary_positions(obs)
            ephem_ok = True
        except Exception:
            pass

    if not ephem_ok or not month_branch:
        # fallback to hardcoded approximate boundaries
        solar_term, month_branch = _月令回退(month, day)

    ys, yb = 年柱(year, month, day)
    ms = 月干(ys, month_branch)
    jdn = 公历转儒略日(year, month, day)
    idx = 六十甲子序(jdn)
    ds, db = 序转干支(idx)
    hb = 时支(hour)
    hs = 时干(ds, hb)

    chart = {
        '年': {'干': ys, '支': yb},
        '月': {'干': ms, '支': month_branch},
        '日': {'干': ds, '支': db},
        '时': {'干': hs, '支': hb},
    }
    return chart, solar_term, sun_lon, planets, 旬空(idx)

def _月令回退(month, day):
    if (month == 2 and day >= 4) or (month == 3 and day < 5):
        return '惊蛰', '卯'
    elif (month == 3 and day >= 5) or (month == 4 and day < 5):
        return '清明', '辰'
    elif (month == 4 and day >= 5) or (month == 5 and day < 5):
        return '立夏', '巳'
    elif (month == 5 and day >= 5) or (month == 6 and day < 5):
        return '芒种', '午'
    elif (month == 6 and day >= 5) or (month == 7 and day < 7):
        return '小暑', '未'
    elif (month == 7 and day >= 7) or (month == 8 and day < 7):
        return '立秋', '申'
    elif (month == 8 and day >= 7) or (month == 9 and day < 7):
        return '白露', '酉'
    elif (month == 9 and day >= 7) or (month == 10 and day < 8):
        return '寒露', '戌'
    elif (month == 10 and day >= 8) or (month == 11 and day < 7):
        return '立冬', '亥'
    elif (month == 11 and day >= 7) or (month == 12 and day < 7):
        return '大雪', '子'
    elif (month == 12 and day >= 7) or (month == 1 and day < 5):
        return '小寒', '丑'
    else:
        return '立春', '寅'

def 当前时辰信息():
    now = datetime.now(timezone.utc)
    myt = timedelta(hours=8)
    local = now + myt
    hour = local.hour
    时辰表 = [(23,1,'子'),(1,3,'丑'),(3,5,'寅'),(5,7,'卯'),(7,9,'辰'),(9,11,'巳'),
              (11,13,'午'),(13,15,'未'),(15,17,'申'),(17,19,'酉'),(19,21,'戌'),(21,23,'亥')]
    for start, end, branch in 时辰表:
        if start == 23:
            if hour >= 23 or hour < 1:
                return '子', '23:00-1:00', '丑', '1:00-3:00'
        elif start <= hour < end:
            ni = (地支.index(branch) + 1) % 12
            next_b = 地支[ni]
            if end < 24:
                return branch, f"{start}:00-{end}:00", next_b, f"{end}:00-{end+2}:00"
            else:
                return branch, f"{start}:00-1:00", next_b, f"1:00-3:00"
    return '子', '23:00-1:00', '丑', '1:00-3:00'

# ═══════════════════════════════════════════════════════════════════
# 主报告
# ═══════════════════════════════════════════════════════════════════

def 生成报告():
    now_utc = datetime.now(timezone.utc)
    myt = timedelta(hours=8)
    now_local = now_utc + myt

    今, 今节气, 太阳黄经, 行星, 旬空日 = 当前四柱(now_utc)
    今日柱干支 = f"{今['日']['干']}{今['日']['支']}"

    当前支, 当前时, 下一支, 下一时 = 当前时辰信息()
    值日神 = 取十二神(今['月']['支'], 今['日']['支'])
    今煞方 = 煞方.get(今['日']['支'], '?')
    今纳音 = 取纳音(今['日']['干'], 今['日']['支'])

    本五行 = 五行数(本命)
    今五行 = 五行数(今)

    # 扩展模型
    旺相 = 旺相状态(今['月']['支'])
    tai_stem, tai_branch = 胎元(本命['月']['干'], 本命['月']['支'])

    # 当前年龄
    birth_date = datetime(CONFIG["birth_info"]["year"], CONFIG["birth_info"]["month"],
                          CONFIG["birth_info"]["day"], CONFIG["birth_info"]["hour"],
                          CONFIG["birth_info"]["minute"])
    age = now_local.year - birth_date.year
    if (now_local.month, now_local.day) < (birth_date.month, birth_date.day):
        age -= 1
    大运当前, 大运始, 大运终 = 当前大运(age)

    # 本命藏干十神
    本命藏干十神 = {}
    for 柱 in ['年','月','日','时']:
        b = 本命[柱]['支']
        本命藏干十神[柱] = [f"{h}({十神.get(h,'?')})" for h in 藏干.get(b, [])]

    # 对参
    对比 = {}
    for 柱名 in ['年','月','日','时']:
        对比[柱名] = 参对本命柱柱(本命[柱名], 今[柱名])

    跨柱 = []
    日月 = 参对本命柱柱(本命['日'], 今['月'])
    if 日月:
        跨柱.append(('日主 ↔ 流月', 日月))
    日年 = 参对本命柱柱(本命['日'], 今['年'])
    if 日年:
        跨柱.append(('日主 ↔ 流年', 日年))

    今日主 = 今['日']['干']
    日主十神 = 十神.get(今日主, '?')

    # ==================== 构建报告 ====================
    report = []
    report.append(f"🐉 八字双时辰对参（天文精算版）")
    report.append(f"═══════════════════════════════════")
    report.append(f"")
    report.append(f"📅 {now_local.strftime('%Y年%m月%d日 %H:%M')} 大马时间")
    if EPHEM_AVAILABLE and 太阳黄经 is not None:
        report.append(f"☀️ 太阳黄经：{太阳黄经:.2f}° | 节气：{今节气}")
    else:
        report.append(f"☀️ 节气：{今节气}")
    report.append(f"时辰：{当前支}时（{当前时}）| 下一时辰：{下一支}时（{下一时}）")
    report.append(f"值日：{值日神}日 | 煞方：{今煞方} | 纳音：{今纳音}")
    report.append(f"旬空：{旬空日[0]}、{旬空日[1]}")
    report.append(f"")

    # 七政星历
    if EPHEM_AVAILABLE and 行星:
        report.append(f"🌍 七政星历")
        for name, lon, zod in 行星:
            report.append(f"  {name}：{lon:>7.2f}° [{zod}]")
        report.append(f"")

    # 本命四柱
    report.append(f"🔸 本命四柱（日主）")
    for 柱 in ['年','月','日','时']:
        n = 本命[柱]
        纳 = 取纳音(n['干'], n['支'])
        藏 = '/'.join(本命藏干十神[柱])
        report.append(f"  {柱}柱：{n['干']}{n['支']}【{纳}】藏干：{藏}")
    report.append(f"  胎元：{tai_stem}{tai_branch} | 大运：{大运当前}（{大运始}–{大运终}岁）")
    report.append(f"")

    # 流运四柱
    report.append(f"🔹 流运四柱")
    for 柱 in ['年','月','日','时']:
        n = 今[柱]
        纳 = 取纳音(n['干'], n['支'])
        十 = 十神.get(n['干'], '?')
        report.append(f"  {柱}柱：{n['干']}{n['支']}【{纳}】十神：{十}")
    report.append(f"")

    # 旺相休囚死
    if 旺相:
        report.append(f"🌊 旺相休囚死（月令 {今['月']['支']}）")
        order = ['旺','相','休','囚','死']
        buckets = {st: [] for st in order}
        for el, st in 旺相.items():
            buckets[st].append(el)
        line_items = []
        for st in order:
            if buckets[st]:
                line_items.append(f"{'='.join(buckets[st])}={st}")
        report.append(f"  {' | '.join(line_items)}")
        report.append(f"")

    # 周易六十四卦 (I Ching 64 Hexagrams)
    本命卦 = 四柱起卦(本命, method='日柱')
    今卦 = 四柱起卦(今, method='日柱')
    
    if 本命卦 and 今卦:
        本命错 = 错卦(本命卦[0])
        本命互 = 互卦(本命卦[0])
        今错 = 错卦(今卦[0])
        今互 = 互卦(今卦[0])
        
        report.append(f"☯️ 六十四卦 (周易)")
        report.append(f"─────────────────────────────")
        report.append(f"")
        report.append(f"🔸 本命卦（日柱起）")
        report.append(f"  【{本命卦[1]}卦】第{本命卦[0]}卦 | {本命卦[2]}上{本命卦[3]}下")
        report.append(f"  卦义：{本命卦[5]}")
        if 本命错:
            report.append(f"  错卦：{本命错[1]}卦 — {本命错[5]}")
        if 本命互:
            report.append(f"  互卦：{本命互[1]}卦 — {本命互[5]}")
        report.append(f"")
        report.append(f"🔹 流运卦（日柱起）")
        report.append(f"  【{今卦[1]}卦】第{今卦[0]}卦 | {今卦[2]}上{今卦[3]}下")
        report.append(f"  卦义：{今卦[5]}")
        if 今错:
            report.append(f"  错卦：{今错[1]}卦 — {今错[5]}")
        if 今互:
            report.append(f"  互卦：{今互[1]}卦 — {今互[5]}")
        
        # 对比本命卦与流运卦
        report.append(f"")
        report.append(f"🔗 卦象对参")
        if 本命卦[0] == 今卦[0]:
            report.append(f"  🔄 伏吟：本命卦与流运卦相同，{本命卦[1]}卦重叠之象")
        elif 本命卦[1] == 今卦[1]:
            report.append(f"  ✦ 同卦：卦名相同但排列可能不同，{本命卦[1]}之呼应")
        else:
            变化关系 = []
            if 本命卦[2] == 今卦[2]:
                变化关系.append(f"上卦相同({本命卦[2]})")
            if 本命卦[3] == 今卦[3]:
                变化关系.append(f"下卦相同({本命卦[3]})")
            if 本命错 and 本命错[0] == 今卦[0]:
                变化关系.append(f"流运为错卦之象")
            if 本命互 and 本命互[0] == 今卦[0]:
                变化关系.append(f"流运为本命互卦")
            if 变化关系:
                report.append(f"  变化：{' | '.join(变化关系)}")
            else:
                report.append(f"  变化：卦象全变，事多转折")
        report.append(f"")

    # 对参
    report.append(f"⚡ 本命 ↔ 流运 对参")
    report.append(f"─────────────────────────────")
    for 柱名 in ['年','月','日','时']:
        项 = 对比[柱名]
        n = 本命[柱名]
        t = 今[柱名]
        report.append(f"")
        report.append(f"  {柱名}柱：{n['干']}{n['支']} ↔ {t['干']}{t['支']}")
        if 项:
            for a in 项:
                report.append(f"    {a}")
        else:
            report.append(f"    无明显作用")

    if 跨柱:
        report.append(f"")
        report.append(f"🔗 跨柱关系")
        for label, aspects in 跨柱:
            report.append(f"  {label}：")
            for a in aspects:
                report.append(f"    {a}")

    report.append(f"")
    report.append(f"🔥 日主对流日")
    report.append(f"  丁火日主 ↔ {今日主}{五行[今日主]}：{日主十神}")

    # 五行变化
    report.append(f"")
    report.append(f"⚖️ 五行变化（本命 → 流运）")
    report.append(f"  五行    本命   流运   变化")
    for el in ['木','火','土','金','水']:
        b = 本五行[el]
        j = 今五行[el]
        net = j - b
        arrow = '↑' if net > 0 else ('↓' if net < 0 else '─')
        report.append(f"  {el}     {b:>5.1f}  {j:>5.1f}  {net:>+5.1f} {arrow}")

    # 警示
    report.append(f"")
    report.append(f"🚨 重点关注")
    警示 = []
    for 柱名, 项 in 对比.items():
        for a in 项:
            if '六冲' in a:
                警示.append(f"⚠️ {柱名}柱六冲")
            if '伏吟' in a:
                警示.append(f"🔄 {柱名}柱伏吟")
            if '三刑' in a:
                警示.append(f"⚠️ {柱名}柱三刑")
            if '六害' in a:
                警示.append(f"⚡ {柱名}柱六害")
            if '六破' in a:
                警示.append(f"⚡ {柱名}柱六破")
            if '克制' in a and 柱名 in ['月','年']:
                警示.append(f"⚠️ {柱名}柱官杀克身")
    if 值日神 in ['破','危']:
        警示.append(f"⚠️ {值日神}日 — 大事勿用")
    if 今五行['水'] - 本五行['水'] > 1.5:
        警示.append(f"⚠️ 水旺克火 — 日主受抑")
    if 今五行['金'] - 本五行['金'] > 1:
        警示.append(f"⚠️ 金旺耗火 — 财星过重")

    if 警示:
        for w in 警示:
            report.append(f"  {w}")
    else:
        report.append(f"  无明显冲克")

    摘要 = {
        '日柱干支': 今日柱干支,
        '值日神': 值日神,
        '煞方': 今煞方,
        '五行变化': {el: 今五行[el]-本五行[el] for el in 今五行},
        '日主十神': 日主十神,
        '节气': 今节气,
        '旬空': 旬空日,
        '旺相': 旺相,
    }

    return '\n'.join(report), 今, 摘要


if __name__ == '__main__':
    报告, _, 摘要 = 生成报告()
    print(报告)
    print(f"\n\n【摘要】")
    for k, v in 摘要.items():
        print(f"  {k}：{v}")
