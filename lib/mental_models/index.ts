// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MENTAL MODELS MODULE INDEX                                                ║
// ║  Export all mental model functionality from a single entry point             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Core frameworks
export {
    ELEMENTAL_MENTAL_MODELS,
    DECISION_FRAMEWORKS,
    ELEMENTAL_COGNITIVE_BIAS,
    getRelevantMentalModels,
    getRelevantDecisionFrameworks,
    detectCognitiveBiases,
    getDailyStrategy,
} from "./frameworks";

// Utilities
export {
    getElementColor,
    getElementIcon,
    getMentalModelsByElement,
    getFrameworksByElement,
    getBiasesByElement,
    getMentalModelByName,
    getFrameworkByName,
    getBiasByName,
    formatMentalModel,
    formatDecisionFramework,
    searchMentalModels,
    getRecommendedModelForDecision,
    generateDailyPrompt,
    getAllMentalModels,
    getAllFrameworks,
    getAllBiases,
    getMentalModelCounts,
    validateMentalModel,
} from "./utils";

// Types (re-export for convenience)
export type {
    MentalModel,
    DecisionFramework,
    CognitiveBias,
} from "./frameworks";

// ═══════════════════════════════════════════════════════════════════════════
// STANDALONE KOL INSIGHTS MODULE
// Not linked to Bazi - separate mental models from ERC-8004 ecosystem
// ═══════════════════════════════════════════════════════════════════════════

export {
    MarcoDeRossi,
    DavideCrapis,
    ERC8004Org,
    MichaelKantor,
    ALL_KOLS,
    getAllKOLs,
    getKOLByHandle,
    getKOLByName,
    getAllMentalModelsFromKOLs,
    searchKOLInsights,
    getInsightsByDomain,
    convertKOLToMentalModels,
} from "./kol_insights";

export type {
    KOL,
    KOLMentalModel,
    Principle,
    ContentStyle,
    ERCKOLInsight,
} from "./kol_insights";
