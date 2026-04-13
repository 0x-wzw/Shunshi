// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MENTAL MODEL UTILITIES                                                  ║
// ║  Helper functions for working with mental models in components           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { 
    ELEMENTAL_MENTAL_MODELS, 
    DECISION_FRAMEWORKS, 
    ELEMENTAL_COGNITIVE_BIAS,
    MentalModel,
    DecisionFramework,
    CognitiveBias 
} from "./frameworks";

/**
 * Get element color for styling
 */
export function getElementColor(element: string): string {
    const colors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
        wood: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", glow: "shadow-emerald-200" },
        fire: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", glow: "shadow-rose-200" },
        earth: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", glow: "shadow-amber-200" },
        metal: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", glow: "shadow-slate-200" },
        water: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", glow: "shadow-blue-200" },
    };
    return colors[element.toLowerCase()] || colors.earth;
}

/**
 * Get element icon
 */
export function getElementIcon(element: string): string {
    const icons: Record<string, string> = {
        wood: "🌿",
        fire: "🔥",
        earth: "⛰️",
        metal: "⚔️",
        water: "💧",
    };
    return icons[element.toLowerCase()] || "◆";
}

/**
 * Get mental models by element
 */
export function getMentalModelsByElement(element: string): MentalModel[] {
    return ELEMENTAL_MENTAL_MODELS[element.toLowerCase()] || [];
}

/**
 * Get decision frameworks that align with specified elements
 */
export function getFrameworksByElement(element: string): DecisionFramework[] {
    return DECISION_FRAMEWORKS.filter(f => 
        f.elementAlignment.includes(element.toLowerCase())
    );
}

/**
 * Get cognitive biases associated with element imbalances
 */
export function getBiasesByElement(element: string): CognitiveBias[] {
    return ELEMENTAL_COGNITIVE_BIAS.filter(b => 
        b.name.toLowerCase().includes(element.toLowerCase())
    );
}

/**
 * Get mental model by name
 */
export function getMentalModelByName(name: string): MentalModel | null {
    for (const element in ELEMENTAL_MENTAL_MODELS) {
        const found = ELEMENTAL_MENTAL_MODELS[element].find(m => 
            m.name.toLowerCase().includes(name.toLowerCase())
        );
        if (found) return found;
    }
    return null;
}

/**
 * Get decision framework by name
 */
export function getFrameworkByName(name: string): DecisionFramework | null {
    return DECISION_FRAMEWORKS.find(f => 
        f.name.toLowerCase().includes(name.toLowerCase())
    ) || null;
}

/**
 * Get cognitive bias by name
 */
export function getBiasByName(name: string): CognitiveBias | null {
    return ELEMENTAL_COGNITIVE_BIAS.find(b => 
        b.name.toLowerCase().includes(name.toLowerCase())
    ) || null;
}

/**
 * Format mental model for display
 */
export function formatMentalModel(model: MentalModel) {
    return {
        ...model,
        shortDescription: model.description.split(".")[0],
        keyInsight: model.application[0],
        warning: model.antidotes[0],
    };
}

/**
 * Format decision framework for display
 */
export function formatDecisionFramework(framework: DecisionFramework) {
    return {
        ...framework,
        stepCount: framework.steps.length,
        summary: framework.context.slice(0, 100) + "...",
    };
}

/**
 * Search mental models
 */
export function searchMentalModels(query: string): MentalModel[] {
    const results: MentalModel[] = [];
    const q = query.toLowerCase();
    
    for (const element in ELEMENTAL_MENTAL_MODELS) {
        const models = ELEMENTAL_MENTAL_MODELS[element].filter(m => 
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.triggers.some(t => t.toLowerCase().includes(q))
        );
        results.push(...models);
    }
    
    return results;
}

/**
 * Get recommended model based on decision type
 */
export function getRecommendedModelForDecision(decisionType: string): MentalModel[] {
    const mappings: Record<string, string[]> = {
        growth: ["Growth Mindset (生发)", "Root Before Branch (本立道生)"],
        crisis: ["Flexible Persistence (柔韧)", "Precise Division (决断)"],
        strategy: ["Seasonal Timing (因时制宜)", "Adaptive Flow (顺势而为)"],
        creativity: ["Controlled Burn (明火执仗)", "Transformational Catalyst (化育)"],
        leadership: ["Container Principle (厚德载物)", "Structural Integrity (正位)"],
        learning: ["Penetrating Insight (润下)", "Refinement Process (精进)"],
        relationships: ["Nourishing Support (养)", "Ten God Interaction"],
    };
    
    const modelNames = mappings[decisionType] || [];
    return modelNames
        .map(name => getMentalModelByName(name))
        .filter(Boolean) as MentalModel[];
}

/**
 * Generate daily mental model prompt
 */
export function generateDailyPrompt(dayMasterElement: string): string {
    const models = ELEMENTAL_MENTAL_MODELS[dayMasterElement.toLowerCase()];
    if (!models || models.length === 0) return "Reflect on your natural approach today.";
    
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomApp = randomModel.application[Math.floor(Math.random() * randomModel.application.length)];
    
    return `Today's Mental Model: ${randomModel.name}\n\n${randomModel.description.split(".")[0]}.\n\nAction: ${randomApp}`;
}

/**
 * Get all frameworks as array
 */
export function getAllMentalModels(): MentalModel[] {
    return Object.values(ELEMENTAL_MENTAL_MODELS).flat();
}

/**
 * Get all decision frameworks
 */
export function getAllFrameworks(): DecisionFramework[] {
    return [...DECISION_FRAMEWORKS];
}

/**
 * Get all cognitive biases
 */
export function getAllBiases(): CognitiveBias[] {
    return [...ELEMENTAL_COGNITIVE_BIAS];
}

/**
 * Get mental model category counts
 */
export function getMentalModelCounts(): Record<string, number> {
    return {
        wood: ELEMENTAL_MENTAL_MODELS.wood.length,
        fire: ELEMENTAL_MENTAL_MODELS.fire.length,
        earth: ELEMENTAL_MENTAL_MODELS.earth.length,
        metal: ELEMENTAL_MENTAL_MODELS.metal.length,
        water: ELEMENTAL_MENTAL_MODELS.water.length,
    };
}

/**
 * Validate mental model structure
 */
export function validateMentalModel(model: Partial<MentalModel>): boolean {
    return !!(
        model.name &&
        model.description &&
        model.application && model.application.length > 0 &&
        model.triggers && model.triggers.length > 0 &&
        model.antidotes && model.antidotes.length > 0 &&
        model.origin
    );
}
