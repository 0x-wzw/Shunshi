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
