#!/usr/bin/env python3
"""
Kairos 每日全息决断报告 — 顺势 × 时辰 × 养生
=============================================
Unified daily temporal decision report combining:
  A. Shunshi 四步决断 (Four-stage decision flow)
     → Personal Calibration → Situational Simulation
     → Environment Tuning → Intuition Verification
  B. 十二时辰卦象对参 (12-shichen hexagram grid)
     → Hexagram per shichen + natal element interaction
     → Meridian/养生 guidance per period
  C. 全日总评 (Daily synthesis)

Backend: Kairos engine (celestial_computations/)
Source:  ~/.hermes/.bazi-private.json  (NEVER commit)

Output: Markdown to stdout → cron delivers to Telegram
        Optional Notion upload if NOTION_API_KEY is set.
"""

import json, os, re, sys, time
from datetime import datetime, timedelta, timezone

HOME = os.path.expanduser("~/.hermes")
PRIVATE_FILE = os.path.join(HOME, ".bazi-private.json")

# ── Load birth data ────────────────────────────────────────────
with open(PRIVATE_FILE) as f:
    priv = json.load(f)

name = priv["name"]
b = priv["birth"]
birth_dt = datetime(b["year"], b["month"], b["day"], b["hour"], b["minute"])
gender = priv["gender"]

sys.path.insert(0, os.path.expanduser("~/Kairos/engine"))
from celestial_computations.shunshi import ShunShiEngine, toss_hexagram, shengbei_toss
from celestial_computations.hexagram_calculator import HexagramCalculator, HEXAGRAM_BY_NUMBER
from celestial_computations.logos import BaziCalculator
from celestial_computations.harmon import BaziAnalyzer
from celestial_computations.fengshui import kua_number_from_date, direction_analysis
from celestial_computations.aether import CelestialConstants, Element

# ── Constants ──────────────────────────────────────────────────
heavenly = "甲乙丙丁戊己庚辛壬癸"
earthly  = "子丑寅卯辰巳午未申酉戌亥"
elem_cn  = {"WOOD": "木", "FIRE": "火", "EARTH": "土", "METAL": "金", "WATER": "水"}

# 64 卦象 insight database (卦辞 + 象意 + 关键词)
HEXAGRAM_INSIGHTS = {
    1:  ("天行健，君子以自强不息", "刚健中正，纯阳之首。万物创始，元亨利贞。", "开创·领导·进取"),
    2:  ("地势坤，君子以厚德载物", "柔顺承天，包容万物。安贞之吉，应地无疆。", "包容·承载·守成"),
    3:  ("云雷屯，君子以经纶", "万物始生，郁结未通。艰难困苦，玉汝于成。", "初创·艰难·扎根"),
    4:  ("山下出泉，童蒙求我", "启蒙发智，教育为本。匪我求童蒙，童蒙求我。", "启蒙·学习·谨慎"),
    5:  ("云上于天，需。饮食宴乐", "待时而动，不犯险行。有孚光亨，贞吉利涉。", "等待·筹备·耐心"),
    6:  ("天与水违行，讼。作事谋始", "天水相违，争讼之象。慎始谋终，防患未然。", "争议·诉讼·预防"),
    7:  ("地中有水，师。容民畜众", "师出有名，众志成城。丈人吉，无咎。", "团队·纪律·行动"),
    8:  ("地上有水，比。建万国亲诸侯", "亲附团结，吉无不利。先王以建万国。", "团结·合作·亲近"),
    9:  ("风行天上，小畜。懿文德", "密云不雨，蓄势待发。自我西郊，未可行也。", "蓄力·蓄积·蓄势"),
    10: ("上天下泽，履。辨上下定民志", "履虎尾不咥人，亨。如临深渊，如履薄冰。", "谨慎·规则·履行"),
    11: ("天地交，泰。财成天地之道", "小往大来，吉亨。天地交而万物通。", "通达·吉祥·交流"),
    12: ("天地不交，否。俭德辟难", "大往小来，不利君子贞。天地闭，贤人隐。", "闭塞·隐忍·守静"),
    13: ("天与火，同人。类族辨物", "同人于野，亨。利涉大川，利君子贞。", "合作·共识·和谐"),
    14: ("火在天上，大有。遏恶扬善", "其德刚健而文明，应乎天而时行。", "丰盛·大有·收获"),
    15: ("地中有山，谦。裒多益寡", "天道亏盈而益谦。谦尊而光，卑而不可逾。", "谦虚·退让·受益"),
    16: ("雷出地奋，豫。作乐崇德", "豫顺以动，天地如之。利建侯行师。", "喜悦·预备·乐观"),
    17: ("泽中有雷，随。向晦入宴息", "天下随时，随之时义大矣哉。", "跟随·顺应·随和"),
    18: ("山下有风，蛊。振民育德", "先甲三日，后甲三日。终则有始，天行也。", "腐败·革新·整治"),
    19: ("泽上有地，临。教思无穷", "刚浸而长，说而顺，刚中而应。", "临近·督导·关怀"),
    20: ("风行地上，观。省方观民设教", "大观在上，顺而巽，中正以观天下。", "观察·审视·学习"),
    21: ("雷电，噬嗑。明罚敕法", "柔得中而上行，虽不当位，利用狱也。", "果断·执行·决断"),
    22: ("山下有火，贲。明庶政无敢折狱", "观乎天文以察时变，观乎人文以化成天下。", "修饰·文明·外表"),
    23: ("山附于地，剥。厚下安宅", "顺而止之，观象也。君子尚消息盈虚，天行也。", "剥落·衰退·守成"),
    24: ("雷在地中，复。闭关商旅不行", "七日来复，天行也。利有攸往。", "回复·重启·新生"),
    25: ("天下雷行，物与无妄。茂对时", "刚自外来而为主于内，动而健，刚中而应。", "真实·无妄·自然"),
    26: ("天在山中，大畜。多识前言往行", "刚健笃实辉光，日新其德。利涉大川。", "大蓄·蓄德·蓄力"),
    27: ("山下有雷，颐。慎言语节饮食", "观颐，自求口实。养正则吉。", "养生·颐养·自足"),
    28: ("泽灭木，大过。独立不惧", "栋桡，利有攸往，亨。独立不惧，遁世无闷。", "过度·非常·超拔"),
    29: ("水洊至，习坎。常德行习教事", "维心亨，行有尚。险之时用大矣哉。", "险阻·考验·诚信"),
    30: ("明两作，离。继明照四方", "柔丽乎中正，故亨。畜牝牛吉。", "光明·依附·文明"),
    31: ("山上有泽，咸。虚受人", "二气感应以相与。天地感而万物化生。", "感应·交流·情感"),
    32: ("雷风，恒。立不易方", "恒亨无咎利贞，久于其道也。", "恒久·稳定·坚持"),
    33: ("天下有山，遁。远小人不恶而严", "遁亨，小利贞。与时行也。", "退避·隐忍·保全"),
    34: ("雷在天上，大壮。非礼弗履", "大者壮也。刚以动，故壮。", "壮大·刚健·节制"),
    35: ("明出地上，晋。自昭明德", "康侯用锡马蕃庶，昼日三接。", "晋升·光明·进取"),
    36: ("明入地中，明夷。莅众用晦而明", "内文明而外柔顺，以蒙大难。", "韬晦·隐忍·待机"),
    37: ("风自火出，家人。言有物行有恒", "女正位乎内，男正位乎外。", "家庭·内务·亲情"),
    38: ("上火下泽，睽。同而异", "二女同居，其志不同行。天地睽而其事同。", "背离·分歧·求同"),
    39: ("山上有水，蹇。反身修德", "见险而能止，知矣哉。利西南，不利东北。", "困难·险难·反省"),
    40: ("雷雨作，解。赦过宥罪", "险以动，动而免乎险，解。", "解除·化解·释放"),
    41: ("山下有泽，损。惩忿窒欲", "损下益上，其道上行。损而有孚，元吉。", "减损·节制·奉献"),
    42: ("风雷，益。见善则迁有过则改", "天施地生，其益无方。利涉大川。", "增益·受益·扩大"),
    43: ("泽上于天，夬。施禄及下", "健而说，决而和。扬于王庭，孚号有厉。", "决断·裁决·果断"),
    44: ("天下有风，姤。施命诰四方", "柔遇刚也。勿用取女，不可与长也。", "相遇·邂逅·防范"),
    45: ("泽上于地，萃。除戎器戒不虞", "聚以正也。观其所聚，天地万物之情可见。", "聚集·会聚·团结"),
    46: ("地中升木，升。顺德积小以高大", "柔以时升，巽而顺，刚中而应。", "上升·进步·积累"),
    47: ("泽无水，困。致命遂志", "刚掩也。险以说，困而不失其所，亨。", "困顿·坚持·不渝"),
    48: ("木上有水，井。劳民劝相", "改邑不改井，无丧无得。往来井井。", "源泉·持续·供给"),
    49: ("泽中有火，革。治历明时", "二女同居，其志不相得，故革。天地革而四时成。", "变革·革新·改革"),
    50: ("木上有火，鼎。正位凝命", "圣人亨以享上帝，而大亨以养圣贤。", "鼎新·建设·立命"),
    51: ("洊雷，震。恐惧修省", "震来虩虩，笑言哑哑。震惊百里。", "震动·警醒·奋发"),
    52: ("兼山，艮。思不出其位", "艮其背不获其身，行其庭不见其人。", "静止·止步·反思"),
    53: ("山上有木，渐。居贤德善俗", "进得位，往有功也。进以正，可以正邦也。", "渐进·稳步·徐进"),
    54: ("泽上有雷，归妹。永终知敝", "归妹，天地之大义也。天地不交而万物不兴。", "婚嫁·归宿·非常"),
    55: ("雷电皆至，丰。折狱致刑", "日中则昃，月盈则食。天地盈虚，与时消息。", "丰盛·盛大·警惕"),
    56: ("山上有火，旅。明慎用刑不留狱", "旅小亨，旅贞吉。旅之时义大矣哉。", "旅行·漂泊·谨慎"),
    57: ("随风，巽。申命行事", "重巽以申命，刚巽乎中正而志行。", "深入·顺从·渗透"),
    58: ("丽泽，兑。朋友讲习", "兑说也。刚中而柔外，说以利贞。", "喜悦·交流·畅快"),
    59: ("风行水上，涣。享帝立庙", "刚来而不穷，柔得位乎外而上同。", "涣散·疏散·化解"),
    60: ("泽上有水，节。制数度议德行", "节亨，苦节不可贞。天地节而四时成。", "节制·节约·规矩"),
    61: ("泽上有风，中孚。议狱缓死", "柔在内而刚得中，说而巽。信及豚鱼。", "诚信·信任·中孚"),
    62: ("山上有雷，小过。行过乎恭", "小者过而亨也。过以利贞，与时行也。", "小过·谨慎·守度"),
    63: ("水在火上，既济。思患豫防", "初吉终乱。其道穷也。", "完成·成功·守成防变"),
    64: ("火在水上，未济。慎辨物居方", "小狐汔济，濡其尾，无攸利。物不可穷也。", "未竟·开始·谨慎"),
}

# Element interaction advice (based on hexagram trigram relationship)
ELEMENT_ADVICE = {
    "比和 (Harmony)": "⚡ 能量共振，事半功倍。适合开启重大事项，决断力强。",
    "生我": "🟢 得天时之助，贵人暗扶。宜借力而行，顺势而为。",
    "我生": "💧 付出而有得，但稍耗精力。适合播种、投资、布局。",
    "克我": "🔴 外来压力，需隐忍守静。大事暂缓，小事可谋。",
    "我克": "🟢 有主动权，可控局势。适合推进、说服、管理。",
}

# Shichen definitions (时辰表)
SHICHEN_TABLE = [
    ("子时", "23:00—01:00", "夜半·胆经", "万籁俱寂，阳气始萌。最适合深度休息、冥想养神。"),
    ("丑时", "01:00—03:00", "鸡鸣·肝经", "肝经当令，气血归藏。宜熟睡，忌熬夜。"),
    ("寅时", "03:00—05:00", "平旦·肺经", "阳气初生，肺经活跃。早起者可借势晨练、吐纳。"),
    ("卯时", "05:00—07:00", "日出·大肠经", "大肠经旺，天地清明。适合排便、洗漱、规划一日。"),
    ("辰时", "07:00—09:00", "食时·胃经", "胃经当令，气血充盈。早餐进食、开始重要事务。"),
    ("巳时", "09:00—11:00", "隅中·脾经", "脾经主导，精力充沛。宜攻坚、谈判、创作。"),
    ("午时", "11:00—13:00", "日中·心经", "心经当令，阳极将转。宜小憩、午餐、避免激烈争执。"),
    ("未时", "13:00—15:00", "日昳·小肠经", "小肠经旺，午后平稳。适合持续工作、学习、稳扎稳打。"),
    ("申时", "15:00—17:00", "晡时·膀胱经", "膀胱经活跃，精力再振。适合外出、运动、执行计划。"),
    ("酉时", "17:00—19:00", "日入·肾经", "肾经当令，收工归巢。适合总结、晚餐、准备休整。"),
    ("戌时", "19:00—21:00", "黄昏·心包经", "心包经旺，情绪舒缓。适合阅读、交流、轻度娱乐。"),
    ("亥时", "21:00—23:00", "人定·三焦经", "三焦经通，阴阳交接。宜放松、泡脚、准备入睡。"),
]


# ═══════════════════════════════════════════════════════════════
# CORE COMPUTATION
# ═══════════════════════════════════════════════════════════════

def compute_all(birth_dt: datetime, gender: str) -> dict:
    """Run all computations once — returns structured data for report generation."""

    engine = ShunShiEngine(birth_dt, gender=gender)
    hcalc = HexagramCalculator()
    bazi_calc = BaziCalculator()

    now = datetime.now(timezone.utc)
    today_str = now.strftime("%Y-%m-%d")
    today_cn = now.strftime("%Y年%m月%d日")

    # ── A. Shunshi Four-Stage ──
    question = f"今日({today_str})的最佳行动策略是什么？"
    cali   = engine.personal_calibration()
    sim    = engine.situational_simulation(question)
    env    = engine.environment_tuning()
    cups   = engine.intuition_verification()
    decision = engine.full_decision(question)

    # ── B. 12-Shichen Hexagram Grid ──
    natal = bazi_calc.calculate(birth_dt.year, birth_dt.month, birth_dt.day, birth_dt.hour)
    dm = natal.day_master
    dm_elem = dm.element.name

    # Compute tomorrow's day stem for 五鼠遁 (the shichen hour-stem calculation)
    tomorrow = now + timedelta(days=1)
    tom_pillars = bazi_calc.calculate(tomorrow.year, tomorrow.month, tomorrow.day, 12)
    tom_day_stem = tom_pillars.day_pillar[0].character
    day_stem_idx = heavenly.index(tom_day_stem)
    hour_stem_start = (day_stem_idx * 2) % 10

    shichen_rows = []
    for i, (shi_name, time_range, poetic, body_hint) in enumerate(SHICHEN_TABLE):
        hs = heavenly[(hour_stem_start + i) % 10]
        hb = earthly[i]
        h = hcalc.day_pillar_to_hexagram(hs, hb, method="composite")
        rel = hcalc.trigram_element_relation(h.upper_trigram, h.lower_trigram)

        # Energy tier vs day master (not trigram-internal)
        stem_tri = hcalc.STEM_TO_TRIGRAM.get(hs)
        energy_vs_dm = _element_vs_dm(stem_tri.element, dm_elem) if stem_tri else "?"

        insight_text, xiangyi, tags = HEXAGRAM_INSIGHTS.get(h.number, ("", "", ""))
        advice = ELEMENT_ADVICE.get(rel, "保持平常心，随遇而安。")

        # Natal interaction: does the hexagram element align with day master?
        natal_interaction = _natal_hexagram_interaction(h, dm_elem, rel)

        shichen_rows.append({
            "shi": shi_name, "time": time_range, "poetic": poetic,
            "ganzhi": f"{hs}{hb}", "num": h.number, "name": h.name_cn,
            "name_en": h.name_en, "symbol": h.symbol,
            "up": h.upper_trigram.name_cn, "lo": h.lower_trigram.name_cn,
            "rel": rel, "energy_vs_dm": energy_vs_dm,
            "gua_ci": h.gua_ci, "insight": insight_text, "xiangyi": xiangyi,
            "tags": tags, "advice": advice, "body": body_hint,
            "natal_xi": natal_interaction,
        })

    # Peak/warning periods
    peak_s = [r for r in shichen_rows if r["energy_vs_dm"] in ("比和", "生我")]
    warn_s = [r for r in shichen_rows if r["energy_vs_dm"] in ("克我", "我生")]

    return {
        "meta": {"name": name, "date": today_str, "date_cn": today_cn,
                 "bazi": engine.bazi_summary(), "gender": gender},
        "shunshi": {"cali": cali, "sim": sim, "env": env, "cups": cups,
                     "decision": decision},
        "shichen": shichen_rows,
        "summary": {"peaks": peak_s, "warnings": warn_s, "dm": dm,
                    "dm_elem": dm_elem},
    }


def _element_vs_dm(hour_elem: str, dm_elem: str) -> str:
    """Relationship of shichen hour-stem element TO the day master.
    Normalizes element names (Metal→METAL) since trigrams use title-case."""
    _normalize = {"Metal": "METAL", "Wood": "WOOD", "Fire": "FIRE",
                  "Earth": "EARTH", "Water": "WATER"}
    he = _normalize.get(hour_elem, hour_elem.upper())
    if he == dm_elem:
        return "比和"
    prod = {"METAL": "WATER", "WATER": "WOOD", "WOOD": "FIRE",
            "FIRE": "EARTH", "EARTH": "METAL"}
    ctrl = {"METAL": "WOOD", "WOOD": "EARTH", "EARTH": "WATER",
            "WATER": "FIRE", "FIRE": "METAL"}
    if prod.get(he) == dm_elem:
        return "生我"
    if prod.get(dm_elem) == he:
        return "我生"
    if ctrl.get(he) == dm_elem:
        return "克我"
    if ctrl.get(dm_elem) == he:
        return "我克"
    return "?"


def _natal_hexagram_interaction(h, dm_elem: str, rel: str) -> str:
    """Describe how the hexagram interacts with the natal day master."""
    h_elems = {h.upper_trigram.element, h.lower_trigram.element}
    prod = {"Wood": "Fire", "Fire": "Earth", "Earth": "Metal",
            "Metal": "Water", "Water": "Wood"}

    if dm_elem in h_elems:
        return "卦象五行与日主同气，得心应手的时刻"
    if any(prod.get(e) == dm_elem for e in h_elems):
        return "卦气生我，天时助你，可放手一搏"
    if rel == "比和 (Harmony)":
        return "天地人和，能量最旺的时刻"
    return "卦气平和，日常事务可如常推进"


# ═══════════════════════════════════════════════════════════════
# FORMATTERS
# ═══════════════════════════════════════════════════════════════

def format_markdown(data: dict) -> str:
    """Format the unified report as Markdown for Telegram delivery."""
    m = data["meta"]
    s = data["shunshi"]
    sc = data["shichen"]
    su = data["summary"]

    lines = []

    # ── HEADER ──
    lines.append(f"## 🌀 Kairos 每日全息决断")
    lines.append(f"**{m['date_cn']} · {m['name']} · {m['bazi']} · {m['gender']}命**")
    lines.append("")

    # ── A. SHUNSHI ──
    lines.append("## 一、顺势四步决断")
    lines.append("")

    # A1: Personal Calibration
    cal = s["cali"]
    lines.append("### 🧘 个人校准")
    lines.append(f"**四柱**: 年{cal['四柱']['年']} 月{cal['四柱']['月']} 日{cal['四柱']['日']} 时{cal['四柱']['时']}")
    lines.append(f"**日主**: {cal['日主']}（{cal['日主五行']}{cal['日主阴阳']}）")
    lines.append(f"**简评**: {cal['日主简评']}")
    lines.append(f"**五行分布**: " + " | ".join(f"{e} {c}" for e, c in cal["五行分布"].items()))
    lines.append("")

    # A2: Situational Simulation
    sim = s["sim"]
    lines.append("### 🔮 今日卦象")
    orig = sim["本卦"]
    chg = sim.get("变卦")
    lines.append(f"**本卦**: #{orig['number']} {orig['name']} {orig.get('symbol','')}")
    lines.append(f"**卦辞**: {orig.get('gua_ci','')}")
    if chg:
        lines.append(f"**变卦**: #{chg['number']} {chg['name']} → 变爻{sim['变爻']}")
        lines.append(f"**解读**: {sim['解读提示'][:150]}")
    else:
        lines.append(f"**静卦** — 无变爻，守势为主")
    lines.append("")

    # A3: Environment
    env = s["env"]
    lines.append("### 🏯 地利方位")
    lines.append(f"**命卦**: {env['命卦']}（{env['宅命分组']}·五行属{env['五行']}）")
    lines.append(f"**最佳方位**: {env['最佳方位']}")
    lines.append(f"**建议**: {env['综合建议']}")
    lines.append("")

    # A4: Intuition
    cu = s["cups"]
    cup_str = " · ".join(cu["掷筊结果"])
    status = "✅ 三圣杯 — 神明应允，可行" if cu["通过"] else "⚠️ 未获三圣杯 — 建议三思慎行"
    lines.append("### 🥢 直觉确认（圣杯）")
    lines.append(f"**掷筊**: {cup_str}")
    lines.append(f"**结果**: {status}")
    lines.append("")

    # A5: Synthesis
    lines.append("### 🌟 今日综合决断")
    lines.append(f"*{s['decision']['综合决断']}*")
    lines.append("")

    # ── B. 12-SHICHEN GRID ──
    lines.append("---")
    lines.append("")
    lines.append("## 二、十二时辰卦象对参")
    lines.append("")

    # Quick overview table
    peak_names = [r["shi"] for r in su["peaks"]] if su["peaks"] else ["无特别峰值"]
    warn_names = [r["shi"] for r in su["warnings"]] if su["warnings"] else ["无"]
    lines.append(f"⚡ **能量峰值**: {', '.join(peak_names)}")
    lines.append(f"🔴 **需留意**: {', '.join(warn_names)}")
    lines.append("")

    for r in sc:
        # Energy emoji
        emoji_map = {"比和": "⚡", "生我": "🟢", "我克": "🟢", "我生": "💧", "克我": "🔴"}
        emoji = emoji_map.get(r["energy_vs_dm"], "⚪")

        lines.append(f"### {emoji} {r['shi']} {r['time']}")
        lines.append(f"**{r['ganzhi']} · #{r['num']} {r['name']} {r['symbol']}**")
        lines.append(r"")
        lines.append(f"卦辞: {r['gua_ci']}")
        lines.append(f"象意: {r['xiangyi']}")
        lines.append(f"卦气: {r['rel']} ｜ 对你: {r['energy_vs_dm']} ｜ {r['natal_xi']}")
        lines.append(f"建议: {r['advice']}")
        lines.append(f"养生: {r['body']}")
        lines.append("")

    # ── C. DAILY SYNTHESIS ──
    lines.append("---")
    lines.append("")
    lines.append("## 三、全日总评")
    lines.append("")
    dm = su["dm"]
    lines.append(f"**日主**: {dm.character}（{elem_cn.get(su['dm_elem'], su['dm_elem'])}）")
    lines.append(f"**运势基调**: {cal['日主简评']}")
    lines.append("")

    if su["peaks"]:
        lines.append("### ⚡ 最佳窗口")
        for r in su["peaks"]:
            lines.append(f"- **{r['shi']}** {r['time']} — #{r['num']} {r['name']} — {r['energy_vs_dm']}")
    if su["warnings"]:
        lines.append("### 🔴 需谨慎")
        for r in su["warnings"]:
            lines.append(f"- **{r['shi']}** {r['time']} — #{r['num']} {r['name']} — {r['energy_vs_dm']}")
    lines.append("")

    # ── FOOTER ──
    lines.append("---")
    lines.append("*每日 23:00 UTC 自动生成 · Kairos Engine 顺势 × 时辰 × 养生*")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════
# NOTION UPLOAD (optional)
# ═══════════════════════════════════════════════════════════════

def upload_to_notion(report_text: str, date_str: str, data: dict):
    """Upload the report to a Notion page if NOTION_API_KEY is configured."""
    import urllib.request, urllib.error

    notion_key = os.environ.get("NOTION_API_KEY", "")
    if not notion_key:
        env_path = os.path.expanduser("~/.hermes/.env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    if line.startswith("NOTION_API_KEY="):
                        notion_key = line.strip().split("=", 1)[1]
                        break
    if not notion_key:
        print("ℹ️ NOTION_API_KEY not set — skipping Notion upload")
        return None

    parent_id = priv.get("notion_page_id", "")
    if not parent_id:
        print("ℹ️ No notion_page_id in .bazi-private.json — skipping Notion upload")
        return None

    def _notion(path, data_payload, method="POST"):
        url = f"https://api.notion.com/v1{path}"
        req = urllib.request.Request(
            url,
            data=json.dumps(data_payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {notion_key}",
                "Notion-Version": "2025-09-03",
                "Content-Type": "application/json",
            },
            method=method,
        )
        try:
            with urllib.request.urlopen(req) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            print(f"⚠️ Notion error {e.code}: {e.read().decode('utf-8')[:200]}", file=sys.stderr)
            return None

    # Create page
    page = _notion("/pages", {
        "parent": {"page_id": parent_id},
        "properties": {"title": {"title": [{"text": {"content": f"🌀 {date_str} 每日全息决断"}}]}},
    })
    if not page or "id" not in page:
        print("⚠️ Failed to create Notion page")
        return None

    page_id = page["id"]

    # Parse markdown lines → Notion blocks
    blocks = []
    for line in report_text.split("\n"):
        if not line.strip():
            continue
        # Headings
        m = re.match(r"^(#{1,3})\s+(.*)", line)
        if m:
            level = len(m.group(1))
            blocks.append({
                "object": "block",
                "type": f"heading_{min(level, 3)}",
                f"heading_{min(level, 3)}": {
                    "rich_text": [{"type": "text", "text": {"content": m.group(2).strip()}}],
                },
            })
            continue
        # Separator
        if set(line.strip()) <= {"-", "=", "*"} and len(line.strip()) >= 5:
            blocks.append({"object": "block", "type": "divider", "divider": {}})
            continue
        # Normal text
        # Strip markdown bold/italic for cleaner Notion display
        clean = re.sub(r"\*\*(.*?)\*\*", r"\1", line)
        clean = re.sub(r"\*(.*?)\*", r"\1", clean)
        clean = re.sub(r"~~(.*?)~~", r"\1", clean)
        blocks.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": clean[:2000]}}],
            },
        })

    # Send in batches of 80
    for i in range(0, len(blocks), 80):
        batch = blocks[i : i + 80]
        _notion(f"/blocks/{page_id}/children", {"children": batch}, "PATCH")
        time.sleep(0.3)

    print(f"✅ Notion: {len(blocks)} blocks uploaded → page {page_id}")
    return page


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    data = compute_all(birth_dt, gender)
    report = format_markdown(data)
    print(report)

    # Optional Notion upload
    upload_to_notion(report, data["meta"]["date"], data)

    # Debug summary
    summary_str = data["shunshi"]["decision"]["综合决断"]
    print(f"\n<!-- SUMMARY: {summary_str} -->", file=sys.stderr)


if __name__ == "__main__":
    main()
