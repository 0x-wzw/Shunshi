import { getBaziCore } from "../bazi/bazi_core";
import { calculateDaYun, analyzeDaYun } from "../cycles/dayun";
import { elementCards, analyzeBranchInteractions, AnalyzedBazi } from "./rules";
import { balanceIndex } from "./scoring";
import { 
    getRelevantMentalModels, 
    getRelevantDecisionFrameworks, 
    detectCognitiveBiases,
    getDailyStrategy,
    MentalModel,
    DecisionFramework,
    CognitiveBias,
    ELEMENTAL_MENTAL_MODELS
} from "../mental_models/frameworks";
import { InterpretationReport, InterpretationCard, LuckPillar } from "./types";

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ENHANCED REPORT GENERATOR - Complete Bazi Interpretation                ║
// ║  Now includes Mental Models and Decision Frameworks                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface GenerateReportInput {
    birthUtc: string;
    gender: "male" | "female";
    tzOffsetMinutes: number;
    dayStartHourLocal: number;
}

/**
 * Generate a complete Bazi interpretation report with mental models
 */
export function generateMvpReport({
    birthUtc,
    gender,
    tzOffsetMinutes,
    dayStartHourLocal,
}: GenerateReportInput): InterpretationReport {
    // Calculate Bazi core
    const bazi = getBaziCore(birthUtc, {
        tzOffsetMinutes,
        dayStartHourLocal,
        elementSeason: true,
    });
    
    // Calculate Da Yun (Luck Pillars)
    const dayunResult = calculateDaYun(birthUtc, gender, {
        tzOffsetMinutes,
        count: 8,
    });
    
    // Calculate balance index
    const bIndex = balanceIndex(bazi.elements.scores);
    
    // Calculate element ratios
    const total = Object.values(bazi.elements.scores).reduce((a, b) => a + b, 0);
    const ratios = {
        wood: Math.round((bazi.elements.scores.wood / total) * 100),
        fire: Math.round((bazi.elements.scores.fire / total) * 100),
        earth: Math.round((bazi.elements.scores.earth / total) * 100),
        metal: Math.round((bazi.elements.scores.metal / total) * 100),
        water: Math.round((bazi.elements.scores.water / total) * 100),
    };
    
    // Determine dominant and weakest elements
    const sortedElements = Object.entries(bazi.elements.scores).sort(([,a], [,b]) => b - a);
    const dominantElement = sortedElements[0][0];
    const weakestElement = sortedElements[4][0];
    
    // Generate element cards
    const analyzedBazi: AnalyzedBazi = {
        pillars: {
            year: {
                zh: bazi.pillars.year.zh,
                pinyin: bazi.pillars.year.pinyin,
                element: bazi.pillars.year.element,
            },
            month: {
                zh: bazi.pillars.month.zh,
                pinyin: bazi.pillars.month.pinyin,
                element: bazi.pillars.month.element,
            },
            day: {
                zh: bazi.pillars.day.zh,
                pinyin: bazi.pillars.day.pinyin,
                element: bazi.pillars.day.element,
                hidden: bazi.pillars.day.hiddenStems.zh,
            },
            hour: {
                zh: bazi.pillars.hour.zh,
                pinyin: bazi.pillars.hour.pinyin,
                element: bazi.pillars.hour.element,
                hidden: bazi.pillars.hour.hiddenStems.zh,
            },
        },
        dayMaster: bazi.dayMaster,
        elements: bazi.elements.scores,
        tenGods: bazi.tenGods,
        solarTerms: {
            current: bazi.solarTerms.current,
            next: bazi.solarTerms.next,
        },
    };
    
    const cards: InterpretationCard[] = [];
    
    // ===========================================
    // MENTAL MODELS SECTION
    // ===========================================
    
    // Get relevant mental models for this chart
    const mentalModels = getRelevantMentalModels(
        bazi.dayMaster.element,
        dominantElement,
        weakestElement
    );
    
    // Add Mental Model cards
    mentalModels.forEach((model, index) => {
        cards.push({
            title: `🧠 Mental Model: ${model.name}`,
            severity: index === 0 ? "low" : "med",
            why: model.description,
            whatToDo: [
                ...model.application.slice(0, 2),
                `Origin: ${model.origin}`,
                `Watch for: ${model.antidotes.join(", ")}`
            ],
            tags: [...model.triggers.slice(0, 2), "Mental Model", "Cognitive Tool"],
        });
    });
    
    // Get decision frameworks
    const decisionFrameworks = getRelevantDecisionFrameworks(bazi.elements.scores);
    
    // Add primary Decision Framework card
    if (decisionFrameworks.length > 0) {
        const primaryFramework = decisionFrameworks[0];
        cards.push({
            title: `🎯 Decision Framework: ${primaryFramework.name.split("(")[0].trim()}`,
            severity: "med",
            why: primaryFramework.context,
            whatToDo: [
                "Use this framework when: " + primaryFramework.steps[0],
                ...primaryFramework.steps.slice(1, 3),
                "Best for: " + primaryFramework.elementAlignment.join(", ") + " energies"
            ],
            tags: ["Decision Framework", "Strategy", ...primaryFramework.elementAlignment.slice(0, 2)],
        });
    }
    
    // Detect potential cognitive biases
    const cognitiveBiases = detectCognitiveBiases(bazi.elements.scores);
    
    cognitiveBiases.forEach((bias) => {
        cards.push({
            title: `⚠️ Watch: ${bias.name}`,
            severity: "high",
            why: bias.description,
            whatToDo: bias.correctionStrategy.slice(0, 3),
            tags: ["Bias Watch", "Cognitive Correction"],
        });
    });
    
    // ===========================================
    // DAILY STRATEGY CARD
    // ===========================================
    
    const dailyStrategy = getDailyStrategy(bazi.solarTerms.current, bazi.pillars.day.element);
    
    cards.push({
        title: `📅 Daily Strategy: ${dailyStrategy.strategy}`,
        severity: "low",
        why: `Current period: ${dailyStrategy.period}. Your Day Master (${bazi.dayMaster.element}) interacts with today's energy.`,
        whatToDo: [
            ...dailyStrategy.actions.slice(0, 2),
            `Best aligned actions: ${dailyStrategy.actions.join(", ")}`,
            `Avoid: ${dailyStrategy.avoid.join(", ")}`
        ],
        tags: ["Daily", "Timing", "Strategy"],
    });
    
    // ===========================================
    // ORIGINAL ELEMENT CARDS
    // ===========================================
    
    const elementInterpretations = elementCards(bazi.elements.scores, analyzedBazi);
    cards.push(...elementInterpretations);
    
    // ===========================================
    // BRANCH INTERACTIONS
    // ===========================================
    
    const branches = [
        bazi.pillars.year.earthlyBranchZh,
        bazi.pillars.month.earthlyBranchZh,
        bazi.pillars.day.earthlyBranchZh,
        bazi.pillars.hour.earthlyBranchZh,
    ];
    const interactions = analyzeBranchInteractions(branches);
    
    if (interactions.length > 0) {
        const clash = interactions.find(i => i.type === "clash");
        const combine = interactions.find(i => i.type === "combine");
        
        if (clash) {
            cards.push({
                title: "🔥 Branch Clash: Transform Pressure",
                severity: "high",
                why: `${clash.branches.join(" and ")} clash suggests internal tension or external resistance. This is not bad—it's energetic potential.`,
                whatToDo: [
                    "Use tension as fuel for breakthrough",
                    "Transform conflict into creative energy",
                    "Seek the third way beyond the opposition",
                    `Mental model: Apply "Controlled Burn"—channel intensity purposefully`
                ],
                tags: ["Clash", "Transformation", "Pressure"],
            });
        }
        
        if (combine) {
            cards.push({
                title: "🤝 Branch Harmony: Strategic Alliance",
                severity: "low",
                why: combine.interpretation,
                whatToDo: [
                    "Look for partnership opportunities today",
                    "Combine complementary skills with others",
                    "Merge opposing ideas into synthesis",
                    "Mental model: 'Container Principle'—hold space for others"
                ],
                tags: ["Harmony", "Partnership", "Flow"],
            });
        }
    }
    
    // ===========================================
    // DA YUN SUMMARY
    // ===========================================
    
    const currentAge = Math.floor((new Date().getTime() - new Date(birthUtc).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const currentDaYun = dayunResult.dayuns.find(d => currentAge >= d.startAge && currentAge < d.endAge);
    
    if (currentDaYun) {
        const daYunAnalysis = analyzeDaYun(
            currentDaYun.pillar,
            bazi.dayMaster.element,
            bazi.dayMaster.yinYang
        );
        
        cards.push({
            title: `🌊 Current Life Chapter: ${currentDaYun.pillar}`,
            severity: "med",
            why: `Age ${currentAge}: ${daYunAnalysis.interpretation} Your Life Chapter ${currentDaYun.startAge}-${currentDaYun.endAge} emphasizes ${daYunAnalysis.stemElement} and ${daYunAnalysis.branchElement}.`,
            whatToDo: [
                `Ten God: ${daYunAnalysis.tenGod} indicates the quality of this period`,
                `Develop: ${daYunAnalysis.stemElement}-related skills and approaches`,
                `Avoid: Over-investing in conflicting elements`,
                "Mental model: 'Adaptive Flow'—bend with this chapter's energy"
            ],
            tags: ["DaYun", "Life Chapter", daYunAnalysis.tenGod],
        });
    }
    
    // ===========================================
    // KEY MENTAL MODEL QUICK REFERENCE
    // ===========================================
    
    const dayMasterModels = ELEMENTAL_MENTAL_MODELS[bazi.dayMaster.element];
    if (dayMasterModels) {
        cards.push({
            title: `💡 Your Core Mental Model: ${dayMasterModels[0].name}`,
            severity: "low",
            why: `As a ${bazi.dayMaster.element} Day Master, your natural thinking style aligns with ${dayMasterModels[0].name}. This is your superpower.`,
            whatToDo: [
                dayMasterModels[0].application[0],
                dayMasterModels[0].application[1],
                `Watch for bias: ${dayMasterModels[0].antidotes[0]}`,
                `Trigger awareness: ${dayMasterModels[0].triggers[0]}`
            ],
            tags: ["Core Pattern", "Superpower", "Identity"],
        });
    }
    
    return {
        bazi: {
            pillars: bazi.pillars,
            dayMaster: bazi.dayMaster,
            elements: bazi.elements,
            tenGods: bazi.tenGods,
            solarTerms: bazi.solarTerms,
        },
        elements: {
            vector: bazi.elements.scores,
            balanceIndex: bIndex,
            ratios,
        },
        mentalModels: {
            primary: mentalModels.map(m => m.name),
            frameworks: decisionFrameworks.map(f => f.name),
            biases: cognitiveBiases.map(b => b.name),
        },
        cards,
        dayun: dayunResult.dayuns.map((d: any, i: number) => ({
            n: i + 1,
            luckPillarZh: d.pillar,
            ageRange: `${d.startAge} - ${d.endAge}`,
            approxUtcRange: `${d.startDate.split("T")[0]} to ${d.endDate.split("T")[0]}`,
        })),
        notes: [
            `八字四柱精密计算：年柱(${bazi.pillars.year.zh}) 月柱(${bazi.pillars.month.zh}) 日柱(${bazi.pillars.day.zh}) 时柱(${bazi.pillars.hour.zh})`,
            `日主：${bazi.dayMaster.stem} (${bazi.dayMaster.pinyin}) - ${bazi.dayMaster.element} ${bazi.dayMaster.yinYang}`,
            `主导元素：${dominantElement} ${ratios[dominantElement as keyof typeof ratios]}% | 短板元素：${weakestElement} ${ratios[weakestElement as keyof typeof ratios]}%`,
            `当前节气：${bazi.solarTerms.current}，下一节气：${bazi.solarTerms.next} (${bazi.solarTerms.nextDate})`,
            dayunResult.explanation,
            `Mental Models: ${mentalModels.map(m => m.name).join(", ")}`,
        ],
    };
}

export { calculateDaYun };
