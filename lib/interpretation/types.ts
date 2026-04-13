import { ElementVector } from "../bazi/element_scoring";

export type Severity = "low" | "med" | "high";

export interface InterpretationCard {
  title: string;
  severity: Severity;
  why: string;
  whatToDo: string[];
  tags: string[];
}

export interface LuckPillar {
  n: number;
  luckPillarZh: string;
  ageRange: string;
  approxUtcRange: string;
}

export interface ElementRatios {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
}

export interface SolarTerms {
    current: string;
    next: string;
    nextDate: string;
}

export interface DayMasterInfo {
    stem: string;
    element: string;
    yinYang: string;
    pinyin: string;
}

export interface PillarDetail {
    zh: string;
    pinyin: string;
    heavenlyStemZh: string;
    heavenlyStemPinyin: string;
    earthlyBranchZh: string;
    earthlyBranchPinyin: string;
    element: string;
    hiddenStems: {
        zh: string;
        pinyin: string;
        elements: { element: string; intensity: string }[];
    };
}

export interface ElementsInfo {
    scores: ElementVector;
}

export interface InterpretationReport {
    bazi: {
        pillars: {
            year: PillarDetail;
            month: PillarDetail;
            day: PillarDetail;
            hour: PillarDetail;
        };
        dayMaster: DayMasterInfo;
        elements: ElementsInfo;
        tenGods: Record<string, string>;
        solarTerms: SolarTerms;
    };
    elements: {
        vector: ElementVector;
        balanceIndex: number;
        ratios?: ElementRatios;
    };
    mentalModels?: {
        primary: string[];
        frameworks: string[];
        biases: string[];
    };
    cards: InterpretationCard[];
    dayun: LuckPillar[];
    notes: string[];
}
