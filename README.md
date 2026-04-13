# Hourly Choice Engine — BaZi Decision Intelligence

A minimal, premium SaaS dashboard designed to bring clarity and authentic BaZi intelligence to modern decision-making. Inspired by the aesthetics of Notion and Stripe, this platform transforms complex elemental data into actionable, reflective insights.

![Destiny Intelligence Status](https://img.shields.io/badge/Status-Premium_MVP-C8A75B?style=for-the-badge)
![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js_14-111827?style=for-the-badge)
![Calculation Accuracy](https://img.shields.io/badge/Calculation-Authentic_八字-e11d48?style=for-the-badge)

## ✨ Core Features

### True Four Pillars (四柱八字) Calculation
- **Year Pillar (年柱)**: Accurate calculation with 立春 (Li Chun) boundary adjustment
  - Year changes at the solar term, not January 1st
  - Correct stem/branch assignment for Jan/Feb births

- **Month Pillar (月柱)**: Solar term-based calculation using 五虎遁 (Five Tigers)
  - Based on 24 solar terms (二十四节气)
  - Authentic month stem formula: 甲己之年丙作首、乙庚之年戊为頭...

- **Day Pillar (日柱)**: Sexagenary Cycle (六十甲子) mathematics
  - Reference-based calculation from 1900 baseline
  - Accurate for all historical dates

- **Hour Pillar (时柱)**: 五鼠遁 (Five Rats) formula
  - Proper 2-hour period calculation (子时 = 23:00-01:00)
  - Hour stem derived from Day Master

### Hidden Elements (藏干)
Each branch contains hidden stems with intensity levels:
- **Primary (本气)**: Main hidden stem
- **Secondary (中气)**: Secondary influence
- **Tertiary (余气)**: Residual influence

### Da Yun (大运) Luck Pillars
Complete traditional calculation:
- Forward/backward determination by gender and year element type
- Starting age from birth to next/previous solar term
- Accurate sexagenary cycle sequencing
- Ten God (十神) analysis for each period

### Five Element Analysis
- Weighted scoring system accounting for all 8 character positions
- Seasonal adjustments (月令) for Day Master strength
- Favorable/unfavorable element determination
- Balance index calculation

### Strategic Insights
- Day Master strength analysis (Strong/Weak/Balanced)
- Dominant and weakest element playbooks
- Branch interaction detection (冲 Clash, 合 Combination)
- Solar term timing guidance
- Current luck pillar interpretation

### Design Philosophy
The platform adheres to a **"Notion × Stripe"** design framework:
-   **Minimalism**: Neutral light palette (`#F8FAFC`) with white cards and soft shadows
-   **Clarity**: Generous spacing and refined typography (Inter) for a calm reading experience
-   **Trust**: Muted gold (`#C8A75B`) accents for key data visualizations
-   **Immersion**: Dashboard-first layout with inline AI reflection assistant

## 🛠 Tech Stack

-   **Frontend**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (Custom Design System)
-   **Calendar**: `lunar-javascript` for authentic Solar-Lunar conversion
-   **Icons**: Lucide React
-   **State Management**: React Hooks

## 📊 Calculation Methodology

### Sexagenary Cycle (六十甲子)
```
60-year cycle = lcm(10 stems, 12 branches)
Year n: stem = (n - 4) % 10, branch = (n - 4) % 12
```

### Five Tigers遁 (五虎遁) - Month Stem
| Year Stem | Month Stem Sequence |
|-----------|-------------------|
| 甲, 己     | 丙, 丁... (Bing starts) |
| 乙, 庚     | 戊, 己... (Wu starts)   |
| 丙, 辛     | 庚, 辛... (Geng starts) |
| 丁, 壬     | 壬, 癸... (Ren starts)  |
| 戊, 癸     | 甲, 乙... (Jia starts)  |

### Seasonal Strength (月令)
The month branch determines seasonal strength—most important factor in Day Master analysis.

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/0x-wzw/Bazi_Daily_Decision_Tree.git
    cd Bazi_Daily_Decision_Tree
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡 Disclaimer

This tool is designed for **Reflection and Intelligence Support** only. It does not provide definitive predictions or directive advice. Users are encouraged to use these insights as mirrors for self-reference in their daily choice architecture.

---

*Powered by BaZi Decision Intelligence • Authentic 八字 Calculation • V2.0*
