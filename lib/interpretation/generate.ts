import { getBaziCore } from "../bazi/bazi_core";
import { generateDaYun } from "../cycles/dayun";
import { elementCards } from "./rules";
import { balanceIndex } from "./scoring";
import { InterpretationReport } from "./types";

interface GenerateMvpReportInput {
    birthUtc: string;
    gender: "male" | "female";
    tzOffsetMinutes: number;
    dayStartHourLocal: number;
}

export function generateMvpReport({
    birthUtc,
    gender,
    tzOffsetMinutes,
    dayStartHourLocal,
}: GenerateMvpReportInput): InterpretationReport {
    // Call existing core logic
    const bazi = getBaziCore(birthUtc, {
        tzOffsetMinutes,
        dayStartHourLocal,
        elementSeason: true,
    });

    const dayun = generateDaYun(birthUtc, gender, {
        tzOffsetMinutes,
        count: 8,
    });

    const bIndex = balanceIndex(bazi.elements.scores);
    const cards = elementCards(bazi.elements.scores);

    return {
        bazi,
        elements: {
            vector: bazi.elements.scores,
            balanceIndex: bIndex,
        },
        cards,
        dayun: dayun.map((d: any, i: number) => ({
            n: i + 1,
            luckPillarZh: d.pillar,
            ageRange: `${d.startAge} - ${d.endAge}`,
            approxUtcRange: `${d.startDate.split("T")[0]} to ${d.endDate.split("T")[0]}`,
        })),
        notes: [
            "This is an MVP report based on Five Element scores.",
            "Interpretations are generated based on dominant and weakest elements.",
            "DaYun timeline is calculated using the standard solar terms method.",
        ],
    };
}
