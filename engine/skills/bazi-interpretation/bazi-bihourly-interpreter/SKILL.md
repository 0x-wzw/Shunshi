---
name: bazi-bihourly-interpreter
title: Bazi Bi-Hourly Plain-Language Interpreter
description: Translate Classical Chinese bazi cronjob reports into actionable plain-language Chinese advice.
triggers:
  - user forwards a bazi-bihourly-aspects cronjob response
  - user asks for 白话文/白话文解析/plain language analysis of bazi report
---

## Steps

1. Identify the user's birth chart from user profile ({_USER_NAME}, Day Master 丁火, >{?} {?} {?} {?}).
2. Identify the current date, day pillar, and hour pillar from the cronjob report.
3. Present the report timeline in plain Chinese:
   - Date/time/节气
   - Day Master condition (日主强弱)
   - Hour pillar interaction with natal chart (especially 时柱冲合)
   - Current luck pillars and month influences (流月/流年)
4. Translate classical terms into modern concepts:
   - 官杀 = 压力/上级/官方
   - 伤官 = 才华/叛逆/消耗
   - 印星 = 贵人/庇护/能量来源
   - 比劫 = 朋友/竞争/合作
   - 财星 = 财富/资源/感情 (对男性)
   - 合 = 合作/牵绊
   - 冲 = 冲突/变动/不稳定
   - 泄 = 消耗/付出/疲惫
   - 克 = 压制/打击/控制
5. Provide structured analysis:
   - 用户状态 (your condition)
   - 时段特点 (period characteristics)
   - 风险警示 (risks & what to avoid)
   - 行动建议 (actionable recommendations, including 方位/activity/mindset)
   - 身体信号 (physical cues if relevant)
6. Include a comparison table when user asks about multiple time periods (e.g., 申时 vs 酉时).
7. End with a "one-sentence summary" (一句话总结) in quotation format.
8. Use emoji markers for readability (🔴 high risk, 🟡 caution, 🟢 positive, ⭐ highlight).

## Pitfalls

- Never link bazi analysis to other domains (e.g., ERC-8004, trading decisions) unless user explicitly asks. User prefers bazi as standalone.
- Keep the tone advisory, not deterministic. Use "宜...忌..." pattern.
- When user's Day Master is weak (e.g., 丁火冬生), emphasize conservation over expansion.
- If hour pillar involves 巳亥相冲 (Si-Hai clash) or 伤官见官 (Shang-Guan meets Guan), explicitly warn against signing documents, arguing with authority, or impulsive decisions.
- Check 煞方 and warn against that direction if relevant.
- The user frequently asks about specific hours (e.g., "我17点到19点的八字如何"); be ready to compute/adapt analysis to adjacent time periods.