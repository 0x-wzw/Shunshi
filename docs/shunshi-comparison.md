# 顺势而为决策系统 — 外部代码对照 Kairos 分析报告

> 创建日期：2026-04-28  
> 对照基准：`engine/celestial_computations/` (Python ground truth)

---

## 一、总体评估

外部代码提供了 **四步决策架构**（个人校准 → 情景模拟 → 环境调优 → 直觉确认），架构正确且实用。但其底层算法存在系统性错误，需要替换为 Kairos 的计算引擎。

| 子系统 | 外部代码状态 | Kairos 基准 |
|--------|:-----------:|:----------:|
| 八字排盘 | ⚠ 算法有误 | ✓ 精确（JDN + 节气边界） |
| 易经起卦 | ✗ 98% 卦名映射错误 | ✓ 64卦完整 |
| 风水命卦 | ✓ 算法正确 | — 已适配 |
| 摇卦变爻 | ✓ 逻辑正确 | ✓ |
| 圣杯验证 | ✓ 架构合理 | — 已适配 |

---

## 二、逐项分析

### 2.1 八字排盘 — 三处算法错误

#### 错误 1：月柱地支
```python
# 外部代码
yue_zhi = DI_ZHI[(year - 4) * 12 % 12 + month - 1]
#                 ^^^^^^^^^^^^^^^ 恒为 0
#                 = DI_ZHI[month - 1]
```
`(year - 4) * 12 % 12` 恒为 0，因此正月永远是子月。实际上月支由节气决定：
- 寅月始于立春（约2月4日）
- 立春前仍属丑月

**Kairos 修正**：`logos.py:SolarTermCalculator.get_zodiac_month()`

#### 错误 2：日柱基准错误
```python
base = datetime(2000, 1, 1)  # 假定为甲子日
```
2000年1月1日实际日柱为 **戊子**（非甲子），偏移24天。日主错误率40%，直接影响全部十神分析。

**Kairos 修正**：`logos.py:BaziCalculator._calculate_day_pillar()` — Fliegel & Van Flandern JDN 公式。

#### 错误 3：缺少节气边界处理
外部代码无立春边界判断，年柱可能在2月4日前使用错误年份。

**Kairos 修正**：节气边界通过 `logos.py:SolarTermCalculator` 处理。

---

### 2.2 易经起卦 — 卦名映射 98% 错误（63/64）

#### 根本原因：Little-Endian 索引 ≠ 卦序索引

```python
# 外部代码
idx = lines[0] + lines[1]*2 + ... + lines[5]*32
return HEXAGRAM_NAMES[idx]  # 列表为卦序，索引是 LE 位序
```

| 爻象 (下→上) | 外部索引 | 外部卦名 | 正确卦名 |
|:-----------:|:------:|:--------:|:--------:|
| 000000 | #1 | **乾为天** ✗ | **坤为地** |
| 000001 | #2 | 坤为地 ✗ | 地雷复 |
| 111111 | #64 | **火水未济** ✗ | **乾为天** |
| 000010 | #3 | 水雷屯 ✗ | 地水师 |

63/64 映射均错误。所有铜钱起卦结果均返回错误的卦名。

**Kairos 修正**：使用 `HEXAGRAM_BY_BINARY` 查询（trigram-composed binary）。

#### 正确做法（Kairos 内已实现）
```python
upper_trigram = trigram_from_lines[5], trigram_from_lines[4], trigram_from_lines[3]
lower_trigram = trigram_from_lines[2], trigram_from_lines[1], trigram_from_lines[0]
binary = upper_trigram + lower_trigram  # 上+下，顶→底
hexagram = HEXAGRAM_BY_BINARY[binary]
```

---

### 2.3 风水命卦 — 算法正确 ✓

外部代码的 `kua_number()` 和 `direction_analysis()` 算法与八宅派标准一致：

- 命卦数计算：`(11 - sum_digits_mod_9)`（男）、`(4 + sum_digits_mod_9)`（女）
- 东四命：[1, 3, 4, 9]；西四命：[2, 6, 7, 8]
- 吉方位映射正确

**无修正需要**，已直接适配至 `fengshui.py`。

---

### 2.4 铜钱摇卦 + 变爻 — 逻辑正确 ✓

外部代码的变爻逻辑完全正确：
- 6/9（老阴/老阳）为变爻
- 变卦 = 变爻处阴阳反转
- 本卦/变卦分列正确

**无修正需要**，已适配至 `shunshi.py`。

---

## 三、已适配的架构

### 模块结构
```
engine/celestial_computations/
├── fengshui.py        ← 命卦 + 方位分析（新建）
├── shunshi.py         ← 顺势决策引擎（新建，封装全部子系统）
├── hexagram_calculator.py  ← 64卦权威（已有）
├── logos.py                ← 八字排盘权威（已有）
├── harmon.py               ← 十神/支合（已有）
├── aether.py               ← 常量（已有）
└── praxis.py               ← CelestialAgent（已有，已清理）
```

### 决策四步闭环（已实现于 `shunshi.py`）

1. **个人校准** → `logos.py:BaziCalculator` 精确排盘
2. **情景模拟** → 铜钱起卦 + `hexagram_calculator.py` 卦名查询
3. **环境调优** → `fengshui.py` 命卦吉位
4. **直觉确认** → 模拟圣杯三次确认

---

## 四、注意事项

1. **圣杯环节**仅作结构性占位 — 实际应用中可用量子随机数或脑电接口取阈下知觉信号
2. **卦辞解读**需接入大语言模型或本地卦辞数据库
3. **外部代码的 `hexagram_to_binary()` 函数**（`format(n-1, '06b')`）与卦象二进制完全无关，已从 Kairos 中删除
