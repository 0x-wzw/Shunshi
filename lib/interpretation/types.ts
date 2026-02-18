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

export interface InterpretationReport {
  bazi: any; // Using any for core response for flexibility
  elements: {
    vector: ElementVector;
    balanceIndex: number;
  };
  cards: InterpretationCard[];
  dayun: LuckPillar[];
  notes: string[];
}
