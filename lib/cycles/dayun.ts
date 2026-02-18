export function generateDaYun(birthUtc: string, gender: string, options: any) {
    const startDay = new Date(birthUtc);
    const dayuns = [];
    const pillars = ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未"];

    for (let i = 0; i < 8; i++) {
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
    return dayuns;
}
