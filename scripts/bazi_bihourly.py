#!/usr/bin/env python3
"""
Bazi Bi-Hourly Aspect Comparison
Loads user profile from ~/.hermes/.bazi-private.json or environment variables.
Natal Chart comparison against current transit pillars.
"""

import json
import math
from datetime import datetime, timezone, timedelta

# ═══════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════

HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
FIVE_ELEMENTS = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'}
ELEMENT_EN = {'木':'Wood','火':'Fire','土':'Earth','金':'Metal','水':'Water'}
STEM_EN = {'甲':'Jia','乙':'Yi','丙':'Bing','丁':'Ding','戊':'Wu','己':'Ji','庚':'Geng','辛':'Xin','壬':'Ren','癸':'Gui'}
BRANCH_EN = {'子':'Zi','丑':'Chou','寅':'Yin','卯':'Mao','辰':'Chen','巳':'Si','午':'Wu','未':'Wei','申':'Shen','酉':'You','戌':'Xu','亥':'Hai'}
def is_yang_stem(stem):
    """Yang stems have even indices in the Heavenly Stems array."""
    return HEAVENLY_STEMS.index(stem) % 2 == 0

# Ten Gods for Ding Fire (丁) Day Master
TEN_GODS_DING = {
    '甲':'正印','乙':'偏印','丙':'劫財','丁':'比肩',
    '戊':'傷官','己':'食神','庚':'正財','辛':'偏財',
    '壬':'正官','癸':'七殺'
}
TEN_GODS_EN = {
    '正印':'Direct Resource','偏印':'Indirect Resource','劫財':'Rob Wealth','比肩':'Friend',
    '傷官':'Hurting Officer','食神':'Eating God','正財':'Direct Wealth','偏財':'Indirect Wealth',
    '正官':'Direct Officer','七殺':'Seven Killings'
}

# Branch clashes (冲)
CLASHES = {'子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥',
           '午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳'}

# Branch combinations (合)
COMBINATIONS = {'子':'丑合土','丑':'子合土','寅':'亥合木','亥':'寅合木',
                '卯':'戌合火','戌':'卯合火','辰':'酉合金','酉':'辰合金',
                '巳':'申合水','申':'巳合水','午':'未合火/土','未':'午合火/土'}

# Hidden stems (藏干)
HIDDEN_STEMS = {
    '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],
    '辰':['戊','乙','癸'],'巳':['丙','戊','庚'],'午':['丁','己'],'未':['己','丁','乙'],
    '申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲']
}

# Na Yin (纳音) lookup - 30 pairs in the 60-cycle
NA_YIN = [
    '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
    '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
    '霹雳火','松柏木','长流水','砂石金','山下火','平地木',
    '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
    '桑柘木','大溪水','沙中土','天上火','石榴木','大海水'
]
NA_YIN_EN = {
    '海中金':'Sea Metal','炉中火':'Furnace Fire','大林木':'Great Forest Wood',
    '路旁土':'Roadside Earth','剑锋金':'Sword Metal','山头火':'Mountain Fire',
    '涧下水':'Stream Water','城头土':'Wall Earth','白蜡金':'White Wax Metal',
    '杨柳木':'Willow Wood','泉中水':'Spring Water','屋上土':'Roof Earth',
    '霹雳火':'Thunder Fire','松柏木':'Pine Wood','长流水':'Long Stream Water',
    '砂石金':'Sand Metal','山下火':'Mountain Fire','平地木':'Flatland Wood',
    '壁上土':'Wall Earth','金箔金':'Gold Foil Metal','覆灯火':'Lamp Fire',
    '天河水':'Heavenly Water','大驿土':'Post Earth','钗钏金':'Hairpin Metal',
    '桑柘木':'Mulberry Wood','大溪水':'Brook Water','沙中土':'Sand Earth',
    '天上火':'Heavenly Fire','石榴木':'Pomegranate Wood','大海水':'Ocean Water'
}

# 12 Day Officers
DAY_OFFICERS = ['建','除','满','平','定','执','破','危','成','收','开','闭']
DAY_OFFICERS_EN = {
    '建':'Establishment','除':'Removal','满':'Fullness','平':'Balance',
    '定':'Settlement','执':'Execution','破':'Destruction','危':'Danger',
    '成':'Completion','收':'Harvest','开':'Opening','闭':'Closing'
}

# Sha directions by day branch triple harmony
SHA_DIRECTION = {
    '申':'南','子':'南','辰':'南',   # Shen-Zi-Chen → South
    '寅':'北','午':'北','戌':'北',    # Yin-Wu-Xu → North
    '亥':'西','卯':'西','未':'西',    # Hai-Mao-Wei → West
    '巳':'东','酉':'东','丑':'东'     # Si-You-Chou → East
}
SHA_EN = {'南':'South','北':'North','西':'West','东':'East'}

# Solar term boundaries for 2026 (approximate dates)
SOLAR_TERMS_2026 = [
    ('小寒', 1, 5), ('大寒', 1, 20), ('立春', 2, 4), ('雨水', 2, 18),
    ('惊蛰', 3, 5), ('春分', 3, 20), ('清明', 4, 5), ('谷雨', 4, 20),
    ('立夏', 5, 5), ('小满', 5, 21), ('芒种', 6, 5), ('夏至', 6, 21),
    ('小暑', 7, 7), ('大暑', 7, 22), ('立秋', 8, 7), ('处暑', 8, 23),
    ('白露', 9, 7), ('秋分', 9, 23), ('寒露', 10, 8), ('霜降', 10, 23),
    ('立冬', 11, 7), ('小雪', 11, 22), ('大雪', 12, 7), ('冬至', 12, 21),
]

# Hour branches (2-hour periods)
HOUR_BRANCHES = [
    (23, 1, '子'), (1, 3, '丑'), (3, 5, '寅'), (5, 7, '卯'),
    (7, 9, '辰'), (9, 11, '巳'), (11, 13, '午'), (13, 15, '未'),
    (15, 17, '申'), (17, 19, '酉'), (19, 21, '戌'), (21, 23, '亥')
]

# ═══════════════════════════════════════════════════════════════════
# NATAL CHART — {_USER_NAME} {_USER_NAME}
# ═══════════════════════════════════════════════════════════════════
# USER PROFILE LOADER
# ═══════════════════════════════════════════════════════════════════

import os, sys, json as _json

def _load_user_profile():
    home = os.path.expanduser("~/.hermes")
    priv = os.path.join(home, ".bazi-private.json")
    if os.path.exists(priv):
        with open(priv, encoding="utf-8") as f:
            return _json.load(f)
    return {
        "name": os.getenv("BAZI_NAME", "User"),
        "birth": {
            "year": int(os.getenv("BAZI_BIRTH_YEAR", "1990")),
            "month": int(os.getenv("BAZI_BIRTH_MONTH", "1")),
            "day": int(os.getenv("BAZI_BIRTH_DAY", "1")),
            "hour": int(os.getenv("BAZI_BIRTH_HOUR", "12")),
            "minute": int(os.getenv("BAZI_BIRTH_MINUTE", "0")),
        },
        "gender": os.getenv("BAZI_GENDER", "male"),
    }

_PROFILE = _load_user_profile()
_USER_NAME = _PROFILE.get("name", "User")

# Build natal chart from engine if available; fallback to cached data
try:
    _eng = os.path.join(os.path.dirname(__file__), "..", "engine")
    if _eng not in sys.path:
        sys.path.insert(0, _eng)
    from celestial_computations.logos import BaziCalculator
    _bc = BaziCalculator()
    _b = _PROFILE["birth"]
    _fp = _bc.calculate(_b["year"], _b["month"], _b["day"], _b["hour"])
    NATAL_CHART = {
        "year":  {"stem": _fp.year_pillar[0].character,   "branch": _fp.year_pillar[1].character},
        "month": {"stem": _fp.month_pillar[0].character,  "branch": _fp.month_pillar[1].character},
        "day":   {"stem": _fp.day_pillar[0].character,    "branch": _fp.day_pillar[1].character},
        "hour":  {"stem": _fp.hour_pillar[0].character,   "branch": _fp.hour_pillar[1].character},
    }
    DAY_MASTER = _fp.day_master.character
except Exception:
    # Fallback: parse cached bazi string or use default
    _cached = _PROFILE.get("bazi", "").split()
    if len(_cached) == 4:
        _yr, _mo, _dy, _hr = _cached
        NATAL_CHART = {
            "year":  {"stem": _yr[0], "branch": _yr[1]},
            "month": {"stem": _mo[0], "branch": _mo[1]},
            "day":   {"stem": _dy[0], "branch": _dy[1]},
            "hour":  {"stem": _hr[0], "branch": _hr[1]},
        }
        DAY_MASTER = _PROFILE.get("day_master", "丁")
    else:
        NATAL_CHART = {"year": {"stem": "甲", "branch": "子"}, "month": {"stem": "甲", "branch": "子"},
                       "day":   {"stem": "甲", "branch": "子"}, "hour":  {"stem": "甲", "branch": "子"}}
        DAY_MASTER = "甲"

# ═══════════════════════════════════════════════════════════════════
# COMPUTATION ENGINE
# ═══════════════════════════════════════════════════════════════════

def gregorian_to_jdn(year, month, day):
    """Julian Day Number from Gregorian date."""
    a = (14 - month) // 12
    y = year + 4800 - a
    m = month + 12 * a - 3
    return day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045

def sexagenary_index(jdn):
    """60-cycle index from JDN. Index 0 = 甲子."""
    return (jdn - 11) % 60

def get_stem_branch(index):
    """Get stem and branch from 60-cycle index."""
    return HEAVENLY_STEMS[index % 10], EARTHLY_BRANCHES[index % 12]

def get_year_pillar(year, month, day):
    """Year pillar — changes at 立春 (~Feb 4)."""
    if month < 2 or (month == 2 and day < 4):
        effective_year = year - 1
    else:
        effective_year = year
    sti = (effective_year - 4) % 10
    bri = (effective_year - 4) % 12
    return HEAVENLY_STEMS[sti], EARTHLY_BRANCHES[bri]

def get_month_branch(month, day):
    """Month branch from solar terms."""
    # Simplified: use solar term boundaries
    if (month == 2 and day >= 4) or (month == 3 and day < 5):
        return '寅'
    elif (month == 3 and day >= 5) or (month == 4 and day < 5):
        return '卯'
    elif (month == 4 and day >= 5) or (month == 5 and day < 5):
        return '辰'
    elif (month == 5 and day >= 5) or (month == 6 and day < 5):
        return '巳'
    elif (month == 6 and day >= 5) or (month == 7 and day < 7):
        return '午'
    elif (month == 7 and day >= 7) or (month == 8 and day < 7):
        return '未'
    elif (month == 8 and day >= 7) or (month == 9 and day < 7):
        return '申'
    elif (month == 9 and day >= 7) or (month == 10 and day < 8):
        return '酉'
    elif (month == 10 and day >= 8) or (month == 11 and day < 7):
        return '戌'
    elif (month == 11 and day >= 7) or (month == 12 and day < 7):
        return '亥'
    elif (month == 12 and day >= 7) or (month == 1 and day < 5):
        return '子'
    else:  # Jan 5 - Feb 3
        return '丑'

def get_month_stem(year_stem, month_branch):
    """Month stem via 五虎遁 (Five Tigers)."""
    branch_order = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']
    br_idx = branch_order.index(month_branch)
    # Year stem group determines starting stem for 寅 month
    ysi = HEAVENLY_STEMS.index(year_stem)
    group = ysi % 5  # 0=甲己, 1=乙庚, 2=丙辛, 3=丁壬, 4=戊癸
    start_stems = [2, 4, 6, 8, 0]  # 丙, 戊, 庚, 壬, 甲 (0-indexed)
    stem_idx = (start_stems[group] + br_idx) % 10
    return HEAVENLY_STEMS[stem_idx]

def get_hour_branch(hour):
    """Hour branch from 24-hour clock."""
    for start, end, branch in HOUR_BRANCHES:
        if start <= hour < end:
            return branch
        if start == 23:  # 23-1 wraps
            if hour >= 23 or hour < 1:
                return branch
    return '子'  # fallback

def get_hour_stem(day_stem, hour_branch):
    """Hour stem via 五鼠遁 (Five Rats)."""
    dsi = HEAVENLY_STEMS.index(day_stem)
    group = dsi % 5  # 0=甲己, 1=乙庚, 2=丙辛, 3=丁壬, 4=戊癸
    start_stems = [0, 2, 4, 6, 8]  # 甲, 丙, 戊, 庚, 壬
    hbi = EARTHLY_BRANCHES.index(hour_branch)
    stem_idx = (start_stems[group] + hbi) % 10
    return HEAVENLY_STEMS[stem_idx]

def get_na_yin(stem, branch):
    """Na Yin for a pillar."""
    sti = HEAVENLY_STEMS.index(stem)
    bri = EARTHLY_BRANCHES.index(branch)
    # Position in 60-cycle
    # Need to find the sexagenary index of this combination
    # Stem i, Branch j → index k where k%10==i and k%12==j
    # Solve: k ≡ i (mod 10), k ≡ j (mod 12) → CRT
    for k in range(60):
        if k % 10 == sti and k % 12 == bri:
            pair_idx = k // 2
            return NA_YIN[pair_idx]
    return 'Unknown'

def compute_transit_chart(dt_utc):
    """Compute the transit (current) Bazi chart for a given UTC datetime."""
    # Convert to Malaysia time (UTC+8 now, but we need the current local time)
    myt = timedelta(hours=8)
    dt_local = dt_utc + myt
    
    year = dt_local.year
    month = dt_local.month
    day = dt_local.day
    hour = dt_local.hour
    
    # Year pillar
    ys, yb = get_year_pillar(year, month, day)
    
    # Month pillar
    mb = get_month_branch(month, day)
    ms = get_month_stem(ys, mb)
    
    # Day pillar (via JDN)
    jdn = gregorian_to_jdn(year, month, day)
    idx = sexagenary_index(jdn)
    ds, db = get_stem_branch(idx)
    
    # Hour pillar
    hb = get_hour_branch(hour)
    hs = get_hour_stem(ds, hb)
    
    return {
        'year':  {'stem': ys, 'branch': yb},
        'month': {'stem': ms, 'branch': mb},
        'day':   {'stem': ds, 'branch': db},
        'hour':  {'stem': hs, 'branch': hb},
    }

def get_current_solar_term(month, day):
    """Find the current solar term."""
    current = SOLAR_TERMS_2026[0]
    for name, m, d in SOLAR_TERMS_2026:
        if (month, day) >= (m, d):
            current = (name, m, d)
        else:
            break
    return current[0]

def get_day_officer(month_branch, day_branch):
    """12 Day Officers — month branch = 建, count forward."""
    mb_idx = EARTHLY_BRANCHES.index(month_branch)
    db_idx = EARTHLY_BRANCHES.index(day_branch)
    diff = (db_idx - mb_idx) % 12
    return DAY_OFFICERS[diff]

def compute_aspect(natal, transit):
    """Compute aspect between a natal pillar and transit pillar."""
    aspects = []
    
    # Stem interactions
    ns, nb = natal['stem'], natal['branch']
    ts, tb = transit['stem'], transit['branch']
    
    # 1. Same element (比肩/劫財)
    if FIVE_ELEMENTS[ns] == FIVE_ELEMENTS[ts]:
        if ns == ts:
            aspects.append(f"伏吟 ({STEM_EN[ns]}={STEM_EN[ts]}) — Echo/Repetition")
        elif is_yang_stem(ns) == is_yang_stem(ts):
            aspects.append(f"比肩 {STEM_EN[ts]} — Friend/Peer support")
        else:
            aspects.append(f"劫財 {STEM_EN[ts]} — Competitor/Resource drain")
    
    # 2. Producing relationship (生)
    el_n = FIVE_ELEMENTS[ns]
    el_t = FIVE_ELEMENTS[ts]
    producing = {'木':'火','火':'土','土':'金','金':'水','水':'木'}
    overcoming = {'木':'土','土':'水','水':'火','火':'金','金':'木'}
    
    if el_t == producing.get(el_n, ''):
        aspects.append(f"{STEM_EN[ts]} 生 {STEM_EN[ns]} — Transit supports natal")
    elif el_n == producing.get(el_t, ''):
        aspects.append(f"{STEM_EN[ns]} 生 {STEM_EN[ts]} — Natal feeds transit (drain)")
    
    # 3. Overcoming relationship (克)
    if el_t == overcoming.get(el_n, ''):
        aspects.append(f"{STEM_EN[ts]} 克 {STEM_EN[ns]} — Transit challenges natal")
    elif el_n == overcoming.get(el_t, ''):
        aspects.append(f"{STEM_EN[ns]} 克 {STEM_EN[ts]} — Natal overcomes transit")
    
    # 4. Branch clashes
    if CLASHES.get(nb) == tb:
        aspects.append(f"⚠️ 冲: {BRANCH_EN[nb]} ↔ {BRANCH_EN[tb]} — Clash!")
    elif CLASHES.get(tb) == nb:
        aspects.append(f"⚠️ 冲: {BRANCH_EN[tb]} ↔ {BRANCH_EN[nb]} — Clash!")
    
    # 5. Branch combinations
    if nb in COMBINATIONS and tb in COMBINATIONS[nb]:
        aspects.append(f"✦ 合: {BRANCH_EN[nb]}+{BRANCH_EN[tb]} — Combination ({COMBINATIONS[nb]})")
    
    # 6. Ten God classification (from natal Day Master perspective)
    tg = TEN_GODS_DING.get(ts, '?')
    if tg != '?':
        aspects.append(f"十神: {tg} ({TEN_GODS_EN[tg]})")
    
    return aspects

def element_balance(chart):
    """Count five elements in a chart."""
    counts = {'木':0,'火':0,'土':0,'金':0,'水':0}
    for pillar in chart.values():
        counts[FIVE_ELEMENTS[pillar['stem']]] += 1
        # Hidden stems from branch
        for hs in HIDDEN_STEMS.get(pillar['branch'], []):
            counts[FIVE_ELEMENTS[hs]] += 0.5  # weighted
    return counts

def get_current_hour_branch_local():
    """Get the upcoming bi-hourly period info."""
    now = datetime.now(timezone.utc)
    myt = timedelta(hours=8)
    local = now + myt
    hour = local.hour
    for start, end, branch in HOUR_BRANCHES:
        if start == 23:
            if hour >= 23 or hour < 1:
                next_h = 1; next_b = '丑'
                return branch, f"{start}:00-{end}:00", '丑', f"1:00-3:00"
        elif start <= hour < end:
            # Find next
            ni = (EARTHLY_BRANCHES.index(branch) + 1) % 12
            next_branch = EARTHLY_BRANCHES[ni]
            if end < 24:
                return branch, f"{start}:00-{end}:00", next_branch, f"{end}:00-{end+2}:00"
            else:
                return branch, f"{start}:00-1:00", next_branch, f"1:00-3:00"
    return '子', '23:00-1:00', '丑', '1:00-3:00'

# ═══════════════════════════════════════════════════════════════════
# MAIN REPORT GENERATOR
# ═══════════════════════════════════════════════════════════════════

def generate_report():
    now_utc = datetime.now(timezone.utc)
    myt = timedelta(hours=8)
    now_local = now_utc + myt
    
    transit = compute_transit_chart(now_utc)
    
    # Current hour info
    curr_hb, curr_time, next_hb, next_time = get_current_hour_branch_local()
    
    # Solar term
    solar_term = get_current_solar_term(now_local.month, now_local.day)
    
    # Day officer
    day_officer = get_day_officer(transit['month']['branch'], transit['day']['branch'])
    
    # Sha direction
    sha_dir = SHA_DIRECTION.get(transit['day']['branch'], '?')
    
    # Na Yin for day pillar
    day_nayin = get_na_yin(transit['day']['stem'], transit['day']['branch'])
    
    # Element balances
    natal_elements = element_balance(NATAL_CHART)
    transit_elements = element_balance(transit)
    
    # Compute aspects for each pillar
    aspects = {}
    for pillar_name in ['year','month','day','hour']:
        aspects[pillar_name] = compute_aspect(NATAL_CHART[pillar_name], transit[pillar_name])
    
    # Cross-pillar aspects (natal day vs transit month, year, hour)
    cross_aspects = []
    # Natal Day Master vs Transit Month
    nm_aspects = compute_aspect(NATAL_CHART['day'], transit['month'])
    if nm_aspects:
        cross_aspects.append(("Natal Day ↔ Transit Month", nm_aspects))
    # Natal Day Master vs Transit Year
    ny_aspects = compute_aspect(NATAL_CHART['day'], transit['year'])
    if ny_aspects:
        cross_aspects.append(("Natal Day ↔ Transit Year", ny_aspects))
    
    # Natal vs Transit Day Master comparison
    natal_dm = NATAL_CHART['day']['stem']
    transit_dm = transit['day']['stem']
    dm_aspect = TEN_GODS_DING.get(transit_dm, '?')
    
    # Build the report
    report = []
    report.append(f"八字 Bi-Hourly Aspect Report")
    report.append(f"═══════════════════════════════")
    report.append(f"")
    report.append(f"📅 {now_local.strftime('%Y-%m-%d %H:%M')} MYT (UTC+8)")
    report.append(f"节气: {solar_term} | 时辰: {curr_hb}时 ({curr_time})")
    report.append(f"十二神: {day_officer} ({DAY_OFFICERS_EN.get(day_officer,'')}) | 煞方: {SHA_EN.get(sha_dir, sha_dir)}")
    report.append(f"日柱纳音: {day_nayin} ({NA_YIN_EN.get(day_nayin,'')})")
    report.append(f"")
    
    # Natal chart
    report.append(f"🔸 Natal Chart ({_USER_NAME})")
    report.append(f"   年: {NATAL_CHART['year']['stem']}{NATAL_CHART['year']['branch']} ({STEM_EN[NATAL_CHART['year']['stem']]}{BRANCH_EN[NATAL_CHART['year']['branch']]})")
    report.append(f"   月: {NATAL_CHART['month']['stem']}{NATAL_CHART['month']['branch']} ({STEM_EN[NATAL_CHART['month']['stem']]}{BRANCH_EN[NATAL_CHART['month']['branch']]})")
    report.append(f"   日: {NATAL_CHART['day']['stem']}{NATAL_CHART['day']['branch']} ({STEM_EN[NATAL_CHART['day']['stem']]}{BRANCH_EN[NATAL_CHART['day']['branch']]}) ← Day Master 丁火")
    report.append(f"   时: {NATAL_CHART['hour']['stem']}{NATAL_CHART['hour']['branch']} ({STEM_EN[NATAL_CHART['hour']['stem']]}{BRANCH_EN[NATAL_CHART['hour']['branch']]})")
    report.append(f"")
    
    # Transit chart
    report.append(f"🔹 Transit Chart (Now)")
    report.append(f"   年: {transit['year']['stem']}{transit['year']['branch']} ({STEM_EN[transit['year']['stem']]}{BRANCH_EN[transit['year']['branch']]})")
    report.append(f"   月: {transit['month']['stem']}{transit['month']['branch']} ({STEM_EN[transit['month']['stem']]}{BRANCH_EN[transit['month']['branch']]})")
    report.append(f"   日: {transit['day']['stem']}{transit['day']['branch']} ({STEM_EN[transit['day']['stem']]}{BRANCH_EN[transit['day']['branch']]})")
    report.append(f"   时: {transit['hour']['stem']}{transit['hour']['branch']} ({STEM_EN[transit['hour']['stem']]}{BRANCH_EN[transit['hour']['branch']]})")
    report.append(f"")
    
    # Aspect comparison
    report.append(f"⚡ Aspect Analysis: Natal ↔ Transit")
    report.append(f"─────────────────────────────")
    
    for pillar_name in ['year','month','day','hour']:
        p_en = {'year':'Year','month':'Month','day':'Day','hour':'Hour'}[pillar_name]
        asp = aspects[pillar_name]
        n = NATAL_CHART[pillar_name]
        t = transit[pillar_name]
        report.append(f"")
        report.append(f"  {p_en}: {n['stem']}{n['branch']} ↔ {t['stem']}{t['branch']}")
        if asp:
            for a in asp:
                report.append(f"    • {a}")
        else:
            report.append(f"    • No major aspect")
    
    # Cross-pillar
    if cross_aspects:
        report.append(f"")
        report.append(f"🔗 Cross-Pillar Aspects")
        for label, casp in cross_aspects:
            report.append(f"  {label}:")
            for a in casp:
                report.append(f"    • {a}")
    
    # Transit Day Master vs Natal
    report.append(f"")
    report.append(f"🔥 Day Master Aspect")
    report.append(f"  Natal 丁火 ↔ Transit {transit_dm}{FIVE_ELEMENTS[transit_dm]}: {dm_aspect} ({TEN_GODS_EN.get(dm_aspect,'')})")
    
    # Element balance comparison
    report.append(f"")
    report.append(f"⚖️ Element Balance")
    report.append(f"  {'Element':<8} {'Natal':>6} {'Transit':>8} {'Net':>6}")
    for el in ['木','火','土','金','水']:
        nn = natal_elements[el]
        tt = transit_elements[el]
        net = tt - nn
        arrow = '↑' if net > 0 else ('↓' if net < 0 else '─')
        report.append(f"  {el}({ELEMENT_EN[el]:<5}) {nn:>5.1f} {tt:>7.1f} {net:>+5.1f} {arrow}")
    
    # Key alerts
    report.append(f"")
    report.append(f"🚨 Key Alerts")
    alerts = []
    for pillar_name in ['year','month','day','hour']:
        for a in aspects[pillar_name]:
            if '冲' in a or 'Clash' in a:
                p_en = {'year':'Year','month':'Month','day':'Day','hour':'Hour'}[pillar_name]
                alerts.append(f"⚠️ {p_en} pillar clash detected")
            if '伏吟' in a:
                p_en = {'year':'Year','month':'Month','day':'Day','hour':'Hour'}[pillar_name]
                alerts.append(f"🔄 {p_en} pillar Fu Yin (repetition/echo)")
    
    # Day officer warning
    if day_officer in ['破','危']:
        alerts.append(f"⚠️ {day_officer} day — exercise caution with major decisions")
    
    if alerts:
        for alert in alerts:
            report.append(f"  {alert}")
    else:
        report.append(f"  No major alerts — relatively stable period")
    
    # Next bi-hour preview
    report.append(f"")
    report.append(f"⏭️ Next 时辰: {next_hb}时 ({next_time})")
    
    return '\n'.join(report)

if __name__ == '__main__':
    print(generate_report())