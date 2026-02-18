import { ElementVector } from "./element_scoring";

export interface BaziPillar {
    zh: string;
    heavenlyStemZh: string;
    earthlyBranchZh: string;
}

export interface BaziCoreResponse {
    pillars: {
        year: BaziPillar;
        month: BaziPillar;
        day: BaziPillar;
        hour: BaziPillar;
    };
    elements: {
        scores: ElementVector;
    };
}

export function getBaziCore(birthUtc: string, options: any): BaziCoreResponse {
    // Mock response for MVP
    return {
        pillars: {
            year: { zh: "甲子", heavenlyStemZh: "甲", earthlyBranchZh: "子" },
            month: { zh: "丙寅", heavenlyStemZh: "丙", earthlyBranchZh: "寅" },
            day: { zh: "戊辰", heavenlyStemZh: "戊", earthlyBranchZh: "辰" },
            hour: { zh: "庚午", heavenlyStemZh: "庚", earthlyBranchZh: "午" },
        },
        elements: {
            scores: {
                wood: 12.5,
                fire: 8.2,
                earth: 15.0,
                metal: 4.5,
                water: 6.8,
            },
        },
    };
}
