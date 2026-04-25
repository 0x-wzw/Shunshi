#!/usr/bin/env python3
"""
八字24小时全日对参（天文精算版）— {_USER_NAME}
出生：


功能：每日运行一次，输出当日12个时辰完整对参报告
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bazi_bihourly_cn as bz
from datetime import datetime, timezone, timedelta

myt = timedelta(hours=8)

# 时辰定义（当日00:00起始，共12个周期=24小时）
时辰表 = [
    ('子',  0,  1, '00:00-01:00'),
    ('丑',  1,  3, '01:00-03:00'),
    ('寅',  3,  5, '03:00-05:00'),
    ('卯',  5,  7, '05:00-07:00'),
    ('辰',  7,  9, '07:00-09:00'),
    ('巳',  9, 11, '09:00-11:00'),
    ('午', 11, 13, '11:00-13:00'),
    ('未', 13, 15, '13:00-15:00'),
    ('申', 15, 17, '15:00-17:00'),
    ('酉', 17, 19, '17:00-19:00'),
    ('戌', 19, 21, '19:00-21:00'),
    ('亥', 21, 23, '21:00-23:00'),
]


def _get_static_day(date_myt):
    """取得当日不变的四柱元素（年/月/日柱），用正午计算。"""
    noon_utc = datetime(date_myt.year, date_myt.month, date_myt.day, 4, 0, 0, tzinfo=timezone.utc)
    chart, solar_term, sun_lon, planets, xunkong = bz.当前四柱(noon_utc)
    return {
        'chart': chart,
        '节气': solar_term,
        '太阳黄经': sun_lon,
        '行星': planets,
        '旬空': xunkong,
    }


def _get_hour_chart(day_chart, rep_h):
    """取得指定小时的完整四柱。"""
    # rep_h 是 MYT 小时（0-23）
    date_myt = datetime.now(timezone.utc) + myt
    # 用当天的 rep_h 构建 UTC
    test_myt = datetime(date_myt.year, date_myt.month, date_myt.day, rep_h, 0, 0)
    test_utc = test_myt.replace(tzinfo=timezone.utc) - myt
    chart, _, _, _, _ = bz.当前四柱(test_utc)
    return chart


def _analyze_period(natal, transit):
    """对本命与流运四柱做关系分析。"""
    results = {}
    for pillar in ['年', '月', '日', '时']:
        results[pillar] = bz.参对本命柱柱(natal[pillar], transit[pillar])
    # 跨柱
    results['日↔流月'] = bz.参对本命柱柱(natal['日'], transit['月'])
    results['日↔流年'] = bz.参对本命柱柱(natal['日'], transit['年'])
    return results


def _score_period(aspects_dict):
    """为单个时辰打分并分类吉凶。"""
    吉 = []; 凶 = []; 平 = []
    for k, v in aspects_dict.items():
        for a in v:
            if any(x in a for x in ['六合', '三合', '生扶', '天干合']):
                吉.append(f"{k}:{a}")
            elif any(x in a for x in ['六冲', '三刑', '六害', '六破', '克制', '官杀']):
                凶.append(f"{k}:{a}")
            elif any(x in a for x in ['伏吟', '泄耗', '耗力']):
                平.append(f"{k}:{a}")
    score = len(吉) * 1.0 - len(凶) * 1.5 + len(平) * 0.2
    return score, 吉, 凶, 平


def _hour_pillar(day_stem, hour_branch):
    """计算时柱天干地支。当前四柱()已经计算时支，但时干需重新算。"""
    hs = bz.时干(day_stem, hour_branch)
    return hs, hour_branch


def 生成全日报告(target_date_myt=None):
    if target_date_myt is None:
        target_date_myt = (datetime.now(timezone.utc) + myt).date()
    elif isinstance(target_date_myt, datetime):
        target_date_myt = target_date_myt.date()

    # ── 日间静态信息 ──
    日间 = _get_static_day(target_date_myt)
    今 = 日间['chart']
    今节气 = 日间['节气']
    行星 = 日间['行星']
    旬空日 = 日间['旬空']

    今日柱干支 = f"{今['日']['干']}{今['日']['支']}"
    值日神 = bz.取十二神(今['月']['支'], 今['日']['支'])
    今煞方 = bz.煞方.get(今['日']['支'], '?')
    今纳音 = bz.取纳音(今['日']['干'], 今['日']['支'])

    本五行 = bz.五行数(bz.本命)
    旺相 = bz.旺相状态(今['月']['支'])

    # 年龄与大运
    >birth = datetime(year, month, day, hour, minute)  # from user profile
    age = target_date_myt.year - birth.year
    if (target_date_myt.month, target_date_myt.day) < (birth.month, birth.day):
        age -= 1
    大运当前, 大运始, 大运终 = bz.当前大运(age)
    tai_stem, tai_branch = bz.胎元(bz.本命['月']['干'], bz.本命['月']['支'])

    今日主 = 今['日']['干']
    日主十神 = bz.十神.get(今日主, '?')

    # ── 报告头部 ──
    date_str = target_date_myt.strftime('%Y-%m-%d')
    date_cn = target_date_myt.strftime('%Y年%m月%d日')
    report = []
    report.append(f"🐉 八字24小时全日对参（天文精算版）")
    report.append(f"{'='*52}")
    report.append(f"")
    report.append(f"📅 {date_cn} 大马时间")
    report.append(f"👤 {_USER_NAME} | 日主丁火 | 本命：>{?} {?} {?} {?}")
    report.append(f"🎋 节气：{今节气} | 值日：{值日神}日")
    report.append(f"🧭 煞方：{今煞方} | 纳音：{今纳音}")
    report.append(f"📌 旬空：{旬空日[0]}、{旬空日[1]} | 大运：{大运当前}（{大运始}–{大运终}岁）")
    report.append(f"🌱 胎元：{tai_stem}{tai_branch}")
    report.append(f"")

    if bz.EPHEM_AVAILABLE and 行星:
        report.append(f"🌍 七政星历")
        for name, lon, zod in 行星:
            report.append(f"  {name}：{lon:>7.2f}° [{zod}]")
        report.append(f"")

    # 旺相休囚
    if 旺相:
        report.append(f"🌊 旺相休囚死（月令 {今['月']['支']}）")
        order = ['旺', '相', '休', '囚', '死']
        buckets = {st: [] for st in order}
        for el, st in 旺相.items():
            buckets[st].append(el)
        items = []
        for st in order:
            if buckets[st]:
                items.append(f"{'='.join(buckets[st])}={st}")
        report.append(f"  {' | '.join(items)}")
        report.append(f"")

    # 本命四柱
    report.append(f"🔸 本命四柱")
    for 柱 in ['年', '月', '日', '时']:
        n = bz.本命[柱]
        纳 = bz.取纳音(n['干'], n['支'])
        藏 = '/'.join([f"{h}({bz.十神.get(h, '?')})" for h in bz.藏干.get(n['支'], [])])
        report.append(f"  {柱}柱：{n['干']}{n['支']}【{纳}】藏干：{藏}")
    report.append(f"")

    # 流日四柱（不含时柱）
    report.append(f"🔹 流日四柱（{date_cn}）")
    for 柱 in ['年', '月', '日']:
        n = 今[柱]
        纳 = bz.取纳音(n['干'], n['支'])
        十 = bz.十神.get(n['干'], '?')
        report.append(f"  {柱}柱：{n['干']}{n['支']}【{纳}】十神：{十}")
    report.append(f"  流日天干：{今日主}{bz.五行[今日主]}（{日主十神}）")
    report.append(f"")

    # ── 周易卦象 ──
    本命卦 = bz.四柱起卦(bz.本命, method='日柱')
    今卦 = bz.四柱起卦(今, method='日柱')
    if 本命卦 and 今卦:
        report.append(f"☯️ 周易六十四卦")
        report.append(f"─────────────────────────────")
        report.append(f"🔸 本命卦（日柱起）：【{本命卦[1]}卦】第{本命卦[0]}卦")
        report.append(f"   {本命卦[2]}上{本命卦[3]}下 | {本命卦[5]}")
        report.append(f"🔹 流运卦（日柱起）：【{今卦[1]}卦】第{今卦[0]}卦")
        report.append(f"   {今卦[2]}上{今卦[3]}下 | {今卦[5]}")
        if 本命卦[0] == 今卦[0]:
            report.append(f"⚠️ 伏吟：本命卦与流运卦相同")
        elif bz.错卦 and bz.错卦(本命卦[0]) and bz.错卦(本命卦[0])[0] == 今卦[0]:
            report.append(f"🔗 流运为错卦之象，阴阳全变")
        report.append(f"")

    # ── 时辰详批 ──
    report.append(f"⏰ 十二时辰详批")
    report.append(f"{'─'*52}")

    period_scores = []
    period_data = []

    for branch, start_h, end_h, time_str in 时辰表:
        rep_h = start_h  # 用时段起点作为计算基准

        # 构建该小时的UTC，用于四柱计算
        test_myt = datetime(target_date_myt.year, target_date_myt.month, target_date_myt.day, rep_h, 0, 0)
        test_utc = test_myt.replace(tzinfo=timezone.utc) - myt
        流时四柱, _, _, _, _ = bz.当前四柱(test_utc)

        # 覆盖时柱（确保时支正确，因为当前四柱()用local.hour，00:00会得子，正确）
        hb = bz.时支(rep_h)
        hs = bz.时干(流时四柱['日']['干'], hb)
        流时四柱['时'] = {'干': hs, '支': hb}

        # 关系分析
        aspects = _analyze_period(bz.本命, 流时四柱)
        score, 吉, 凶, 平 = _score_period(aspects)
        period_scores.append((branch, score, 吉, 凶))
        period_data.append({
            'branch': branch, 'time': time_str,
            'hour_pillar': f"{hs}{hb}", 'hour_tenshen': bz.十神.get(hs, '?'),
            'score': score, 'good': 吉, 'bad': 凶, 'neutral': 平,
            'aspects': aspects,
        })

        # 输出
        emoji = '🟢' if score > 1.5 else ('🟡' if score >= -1 else '🔴')
        report.append(f"")
        report.append(f"{emoji} 【{branch}时】{time_str}")
        report.append(f"{'─'*30}")
        report.append(f"  时柱：{hs}{hb} | 十神：{bz.十神.get(hs, '?')}")

        # 本命↔流运各柱
        for pillar in ['时', '日', '月', '年']:
            items = aspects[pillar]
            if items:
                report.append(f"  {pillar}柱对参：")
                for a in items[:3]:
                    report.append(f"    {a}")

        # 跨柱
        if aspects['日↔流月']:
            report.append(f"  日主↔流月：")
            for a in aspects['日↔流月'][:2]:
                report.append(f"    {a}")
        if aspects['日↔流年']:
            report.append(f"  日主↔流年：")
            for a in aspects['日↔流年'][:2]:
                report.append(f"    {a}")

        # 五行变化
        今五行 = bz.五行数(流时四柱)
        report.append(f"  五行变化：")
        for el in ['木', '火', '土', '金', '水']:
            net = 今五行[el] - 本五行[el]
            arrow = '↑' if net > 0.5 else ('↓' if net < -0.5 else '─')
            report.append(f"    {el} {arrow} ({net:+.1f})")

        # 评语
        if 凶:
            report.append(f"  ⚠️ 忌：{' | '.join([a.split(':')[1][:20] for a in 凶[:2]])}")
        if 吉:
            report.append(f"  ✅ 吉：{' | '.join([a.split(':')[1][:20] for a in 吉[:2]])}")

        if score > 1.5:
            report.append(f"  ⭐ 吉时，利决策、谈判、行动")
        elif score < -1.5:
            report.append(f"  🚨 冲克明显，宜静守、避风险")
        else:
            report.append(f"  ⚖️ 平稳，宜守成、内省")

    # ── 全日总评 ──
    report.append(f"")
    report.append(f"{'='*52}")
    report.append(f"📊 全日总评")
    report.append(f"{'='*52}")

    period_scores.sort(key=lambda x: x[1], reverse=True)

    report.append(f"")
    report.append(f"🌟 最佳时辰 TOP3：")
    for i, (branch, score, ji, xiong) in enumerate(period_scores[:3], 1):
        e = '🟢' if score > 1.5 else '🟡'
        report.append(f"  {i}. {e} {branch}时（{score:+.1f}分）")

    report.append(f"")
    report.append(f"⚠️ 需谨慎时辰：")
    risky = [(b, s, j, x) for b, s, j, x in period_scores if s < -1]
    if risky:
        for branch, score, ji, xiong in risky:
            report.append(f"  🔴 {branch}时（{score:+.1f}分）")
    else:
        report.append(f"  全日平稳，无大凶险")

    # 五行日运
    report.append(f"")
    report.append(f"⚖️ 日主丁火今日五行气象：")
    day_chart_noon = _get_static_day(target_date_myt)['chart']
    今五行_noon = bz.五行数(day_chart_noon)
    for el in ['木', '火', '土', '金', '水']:
        net = 今五行_noon[el] - 本五行[el]
        arrow = '↑' if net > 0 else ('↓' if net < 0 else '─')
        report.append(f"  {el}: {本五行[el]:.1f} → {今五行_noon[el]:.1f}  {arrow} ({net:+.1f})")

    report.append(f"")
    report.append(f"💡 核心建议：")
    best = period_scores[0]
    worst = period_scores[-1]
    report.append(f"  最佳窗口：{best[0]}时 ({时辰表[[b for b,_,_,_ in 时辰表].index(best[0])][3]})")
    if worst[1] < -1:
        report.append(f"  最需规避：{worst[0]}时 ({时辰表[[b for b,_,_,_ in 时辰表].index(worst[0])][3]})")
    if 日主十神 in ['正官', '七杀']:
        report.append(f"  官杀日，宜谨慎对待权威事务，不冒进")
    elif 日主十神 in ['正印', '偏印']:
        report.append(f"  印星日，利学习、求教、获得支持")
    elif 日主十神 in ['正财', '偏财']:
        report.append(f"  财星日，利理财、资源整合")
    elif 日主十神 in ['伤官', '食神']:
        report.append(f"  食伤日，利表达、创作、展现才华")
    elif 日主十神 in ['劫财', '比肩']:
        report.append(f"  比劫日，利合作，亦需防竞争")
    report.append(f"")

    # 摘要
    summary = {
        'date': date_str,
        'date_cn': date_cn,
        'day_pillar': 今日柱干支,
        'solar_term': 今节气,
        'duty_god': 值日神,
        'sha_direction': 今煞方,
        'day_tenshen': 日主十神,
        'best_shichen': best[0],
        'worst_shichen': worst[0] if worst[1] < -1 else None,
        'avg_score': round(sum(s for _, s, _, _ in period_scores) / 12, 2),
        'hourly': period_data,
    }

    return '\n'.join(report), summary, date_str


if __name__ == '__main__':
    报告, 摘要, date_str = 生成全日报告()
    print(报告)
    print(f"\n\n【JSON 摘要】")
    print(json.dumps(摘要, ensure_ascii=False, indent=2))
