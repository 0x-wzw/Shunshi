export function calculateDaYun(birthUtc: string, gender: string, options: { count: number }): { dayuns: any[]; explanation: string } {
    const startDay = new Date(birthUtc);
    const dayuns = [];
    const pillars = ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未"];

    for (let i = 0; i < (options.count || 8); i++) {
        const startDate = new Date(startDay);
        startDate.setFullYear(startDate.getFullYear() + i * 10);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 10);

        dayuns.push({
            pillar: pillars[i],
            startAge: i * 10,
            endAge: (i + 1) * 10,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
    }
    return { dayuns, explanation: "大运周期每十年变换一次，反映人生不同阶段的能量主题。" };
}

export function analyzeDaYun(pillar: string, _dayMasterElement: string, _yinYang: string) {
    const stem = pillar[0] || "";
    const branch = pillar[1] || "";
    const STEM_ELEMENTS: Record<string, string> = {
        甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth",
        己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water",
    };
    const BRANCH_ELEMENTS: Record<string, string> = {
        子: "water", 丑: "earth", 寅: "wood", 卯: "wood", 辰: "earth",
        巳: "fire", 午: "fire", 未: "earth", 申: "metal", 酉: "metal",
        戌: "earth", 亥: "water",
    };
    return {
        interpretation: `${pillar}运程带来新的挑战与机遇`,
        stemElement: STEM_ELEMENTS[stem] || "unknown",
        branchElement: BRANCH_ELEMENTS[branch] || "unknown",
        tenGod: "正官",
    };
}
