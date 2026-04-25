---
name: bazi-interpretation
description: Translate structured Bazi cronjob output into plain-language life guidance — career, wealth, relationships, health.
trigger: User receives a Bazi report (bazi-bihourly-aspects / bazi-daily / bazi-luck-pillar) and asks for interpretation, translation, or advice.
---

# Bazi Interpretation Skill

## 1. Identify the Day Master
- Locate 日柱 in the native (本命) column — the first character is the Day Master (e.g. 丁 = Ding Fire).
- Map to one of 10 Stems with plain-language archetype:
  - 甲乙木 = Tree — growing, branching, needs space and patience
  - 丙丁火 = Fire — warm, visible, burns out without fuel
  - 戊己土 = Earth — stable, nourishing, slow to change
  - 庚辛金 = Metal — sharp, disciplined, can cut both ways
  - 壬癸水 = Water — flowing, adaptive, hard to pin down

## 2. Determine Body Strength (身强身弱)
- Check the season (month branch = 月令):
  - Same element or supportive element (e.g. Fire in summer, Wood in spring) → 身强
  - Opposing or draining element (e.g. Fire in winter, Metal in summer) → 身弱
- For weak body: emphasize 印比 (resource + peers) as support
- For strong body: emphasize 官杀/食伤/财 as outlets

## 3. Map the 5 Elements to Life Domains

| Element | 十神 Role | Life Domain | When Strong | When Weak |
|---------|----------|-------------|-------------|-----------|
| 印 (Resource) | Mentor, learning, safety net | Education, credentials, backing | Confidence, lazy risk | Insecurity, overwork |
| 比/劫 (Peers) | Friends, rivals, team | Network, competition, collaborations | Strength in numbers | Resource drain |
| 食/伤 (Output) | Expression, creativity | Content, communication, innovation | Prolific but scattered | Blocked expression |
| 财 (Wealth) | Money, assets, resources | Income, investments, practical gains | Material abundance | Financial pressure |
| 官/杀 (Authority) | Pressure, rules, leadership | Career, status, external demands | Achievement, stress | Escape, rebellion |

## 4. Interpret Current Luck Pillar (大运)
- State the current 10-year pillar and remaining years.
- Determine if the pillar's stem/branch are favorable elements.
- Call out upcoming pillar transitions (especially favorable ones like entering a 印/比 or 财 pillar).

## 5. Interpret Annual/Monthly/Daily Flow (流运)
- For each column (年/月/日/时), note:
  - **Supportive interaction** (e.g. 生 = generates, 合 = combines favorably, 比肩/劫财 = same element)
  - **Opposing interaction** (e.g. 克 = suppresses, 冲 = clashes, 官杀 overwhelming)
  - **Special markers**: 伏吟 = repetition/mirroring (avoid major decisions), 空亡 = empty/depleted sector

## 6. Domain-Specific Advice

### Career
- Weak body + heavy 官杀 → needs platform, hierarchy, mentorship; avoid solo entrepreneurship
- Strong body + heavy 印 → needs output channel, avoid becoming a "perpetual student"
- Transitional years (换运前1-2年) → consolidate, don't leap

### Wealth
- 正财 (manifest wealth) vs 偏财 (hidden/speculative wealth)
- Weak body + heavy 财 → "small frame big bag" — can't carry the wealth, avoid big bets
- Favor element match → favorable investment style (e.g. 土 = property, 木 = growth/compounding)

### Relationships
- 官杀 (for women) or 财 (for men) represents partner energy
- 合 (combination) in partner sector → meeting someone; but check if 合 is "合化" (transforming away the useful element)

### Health
- Day Master element = core vitality
- Element suppressing Day Master = chronic stress organ
- Seasonal alignment: winter weakens fire, summer weakens water, etc.

## 7. Output Format
- Start with one-sentence archetype (e.g. "冬夜烛火，有人添柴")
- Use tables for structured data (5 Elements, Luck Pillars, domain advice)
- End with "人生使用说明书" summary table + tactical next-year bullets
- All language plain/conversational; avoid classical jargon unless followed by translation

## Example Workflow Inputs
- Cronjob report: `bazi-bihourly-aspects`
- Manual query: `translate bazi`
- Follow-up: `career advice`, `investment`, `health`

## Safety
- Never diagnose medical conditions — frame as "constitutional watch points"
- Never predict specific losses/gains — frame as favorable/unfavorable conditions
- Respect user preference for standalone bazi (no forced linkage to other domains like ERC-8004 or monitoring)
