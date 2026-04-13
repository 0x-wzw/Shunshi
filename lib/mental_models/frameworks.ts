// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MENTAL MODELS FOR BAZI DECISION-MAKING                                  ║
// ║  Strategic frameworks derived from Chinese metaphysical principles         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { ElementVector } from "../bazi/element_scoring";

export interface MentalModel {
    name: string;
    description: string;
    application: string[];
    triggers: string[];
    antidotes: string[];
    origin: string;
}

export interface DecisionFramework {
    name: string;
    context: string;
    steps: string[];
    elementAlignment: string[];
    contraindications: string[];
}

export interface CognitiveBias {
    name: string;
    description: string;
    baziCorrelation: string;
    correctionStrategy: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE MENTAL MODELS FROM FIVE ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════

export const ELEMENTAL_MENTAL_MODELS: Record<string, MentalModel[]> = {
    wood: [
        {
            name: "Growth Mindset (生发)",
            description: "Like a tree extending toward light, focus on continuous expansion and learning. The natural state is growth, not stagnation.",
            application: [
                "When facing obstacles, ask: 'How can I grow around this?'",
                "Invest in skills that compound over time",
                "Build systems that scale naturally",
                "Seek feedback as sunlight—necessary for growth"
            ],
            triggers: ["Feeling stuck", "Career plateaus", "Learning opportunities"],
            antidotes: ["Rigid thinking", "Fixed mindset", "Short-term optimization"],
            origin: "木曰曲直 - Wood bends and straightens, adapting to conditions while growing upward"
        },
        {
            name: "Root Before Branch (本立道生)",
            description: "Strong Wood requires deep roots. Foundation must precede expansion. Invest in fundamentals before chasing opportunities.",
            application: [
                "Before scaling, ensure your core systems are solid",
                "Master fundamentals before advanced techniques",
                "Build network effects slowly and authentically",
                "Prioritize depth over breadth in expertise"
            ],
            triggers: ["Rapid expansion opportunities", "New market entry", "Skill acquisition"],
            antidotes: ["Premature scaling", "Shiny object syndrome", "Shallow expertise"],
            origin: "君子务本，本立而道生 - The noble person focuses on the root; when the root is established, the way grows"
        },
        {
            name: "Flexible Persistence (柔韧)",
            description: "Wood is both strong and flexible. Bend under pressure but return to form. Resilience through adaptability, not rigidity.",
            application: [
                "Maintain core values while adapting tactics",
                "Yield temporarily to stronger forces, then resume",
                "Reframe setbacks as feedback for course correction",
                "Build optionality into long-term commitments"
            ],
            triggers: ["Strong opposition", "Market shifts", "Personal setbacks"],
            antidotes: ["Brittle rigidity", "Complete surrender", "Inflexible deadlines"],
            origin: "岁寒，然后知松柏之后凋也 - Only when the year is cold do we see the pine and cypress are the last to wither"
        }
    ],
    fire: [
        {
            name: "Controlled Burn (明火执仗)",
            description: "Fire needs fuel and containment. Passion without discipline burns out. Channel intensity strategically rather than diffusely.",
            application: [
                "Batch high-energy tasks during peak hours",
                "Set boundaries to contain your enthusiasm",
                "Recognize burnout signals before they flame out",
                "Use intensity to ignite others, then sustain with structure"
            ],
            triggers: ["New project excitement", "Creative impulses", "Leadership opportunities"],
            antidotes: ["Burnout", "Scattered energy", "Unsustainable intensity"],
            origin: "火曰炎上 - Fire flames upward; it must be contained to provide warmth, not destruction"
        },
        {
            name: "Illumination Strategy (明察)",
            description: "Fire illuminates. Focus on shedding light—making decisions visible, clarifying ambiguous situations, bringing transparency.",
            application: [
                "When uncertain, gather more information (light)",
                "Illuminate blind spots for yourself and others",
                "Use visibility as a tool for accountability",
                "Communicate clearly—light banishes shadow"
            ],
            triggers: ["Uncertainty", "Complex decisions", "Team coordination"],
            antidotes: ["Analysis paralysis", "Shadow decision-making", "Ambiguous communication"],
            origin: "知者不惑 - The wise are not confused; clarity dissolves doubt as fire does darkness"
        },
        {
            name: "Transformational Catalyst (化育)",
            description: "Fire transforms. Apply intense periods of focused change rather than gradual drift. Catalytic conversion of potential to actual.",
            application: [
                "Use sprints for transformation, not marathons",
                "Apply heat (pressure) selectively for phase changes",
                "Create crucible experiences that forge character",
                "Remove impurities through intense refinement"
            ],
            triggers: ["Transformation needs", "Innovation requirements", "Personal development"],
            antidotes: ["Incremental complacency", "Comfort zones", "Avoidance of intensity"],
            origin: "火性炎上，其用温暖 - Fire's nature is to rise; its function is to warm and transform"
        }
    ],
    earth: [
        {
            name: "Container Principle (厚德载物)",
            description: "Earth receives and contains. Your capacity to hold space for others, ideas, and resources determines your value. Be the ground others build upon.",
            application: [
                "Create psychological safety for teams",
                "Build platforms that enable others",
                "Accumulate resources during abundance for lean times",
                "Be present without needing to do"
            ],
            triggers: ["Leadership roles", "Resource management", "Team building"],
            antidotes: ["Reactive anxiety", "Hoarding", "Inability to receive"],
            origin: "地势坤，君子以厚德载物 - Earth's nature is receptivity; the noble person has thick virtue to carry all things"
        },
        {
            name: "Seasonal Timing (因时制宜)",
            description: "Earth knows seasons. There's a time for planting, growing, harvesting, and resting. Align actions with natural cycles.",
            application: [
                "Identify your personal seasons in projects",
                "Don't harvest before fruit ripens",
                "Rest in winter to prepare for spring growth",
                "Match energy investment to seasonal returns"
            ],
            triggers: ["Strategic planning", "Product cycles", "Career timing"],
            antidotes: ["Perpetual urgency", "Out-of-season actions", "Impatience"],
            origin: "土旺四季 - Earth dominates the four seasons; it provides the context for all growth"
        },
        {
            name: "Nourishing Support (养)",
            description: "Earth nourishes. Support systems are invisible infrastructure. Invest in relationships, health, and environments that sustain.",
            application: [
                "Identify your 'soil'—what sustains you daily",
                "Build support before you need it",
                "Nourish others without expecting immediate returns",
                "Create environments that naturally support goals"
            ],
            triggers: ["Team building", "Self-care prioritization", "Environmental design"],
            antidotes: ["Isolation", "Burnout", "Unsustainable systems"],
            origin: "土生万物 - Earth gives birth to the ten thousand things through nourishment"
        }
    ],
    metal: [
        {
            name: "Precise Division (决断)",
            description: "Metal cuts and defines. Clarity emerges from deciding what is included and excluded. Sharp boundaries create clear containers.",
            application: [
                "Define what you DON'T do as clearly as what you do",
                "Separate decisions cleanly—no partial commitments",
                "Cut losses decisively; don't bleed slowly",
                "Use elimination to reveal essence"
            ],
            triggers: ["Strategic focus", "Priority setting", "Ending commitments"],
            antidotes: ["Scope creep", "Ambiguous commitments", "Death by a thousand cuts"],
            origin: "金曰从革 - Metal follows and transforms; it separates the essential from the trivial"
        },
        {
            name: "Structural Integrity (正位)",
            description: "Metal maintains form under pressure. Build systems that hold their shape. Integrity is the alignment of form and function.",
            application: [
                "Create frameworks that constrain to enable",
                "Ensure systems are internally consistent",
                "Design for stress conditions, not just ideal states",
                "Align incentives with stated values"
            ],
            triggers: ["System design", "Architecture decisions", "Values alignment"],
            antidotes: ["Structural weakness", "Inconsistency", "Fragile under stress"],
            origin: "金性刚正 - Metal's nature is upright and correct; it maintains form"
        },
        {
            name: "Refinement Process (精进)",
            description: "Metal is purified through fire. Excellence requires repeated refinement. Quality emerges from reduction, not addition.",
            application: [
                "Seek feedback cycles that refine rather than add",
                "Eliminate 90% to highlight the essential 10%",
                "Practice deliberately, not just repetitively",
                "Value the work of editing and polishing"
            ],
            triggers: ["Quality improvement", "Design finalization", "Skill mastery"],
            antidotes: ["Feature creep", "Good enough settling", "Accumulation without refinement"],
            origin: "百炼成钢 - Through a hundred refinements, iron becomes steel"
        }
    ],
    water: [
        {
            name: "Adaptive Flow (顺势而为)",
            description: "Water takes the shape of its container while maintaining essence. Adapt form to circumstances without losing fundamental nature.",
            application: [
                "Adjust tactics while maintaining core values",
                "Find paths of least resistance to objectives",
                "See obstacles as defining your path, not blocking it",
                "Maintain flexibility in methods while clear on goals"
            ],
            triggers: ["Changing circumstances", "New constraints", "Strategic pivots"],
            antidotes: ["Rigid attachment", "Resistance to reality", "Forcing outcomes"],
            origin: "上善若水 - Highest goodness is like water; it benefits all things without competing"
        },
        {
            name: "Penetrating Insight (润下)",
            description: "Water penetrates obstacles through persistence, not force. Deep understanding reveals what surface analysis misses.",
            application: [
                "Ask five whys to reach root causes",
                "Gather intelligence before acting",
                "Wear down resistance through consistent presence",
                "Look beneath the surface for hidden patterns"
            ],
            triggers: ["Problem solving", "Negotiation", "Understanding systems"],
            antidotes: ["Surface level analysis", "Premature action", "Brute force approaches"],
            origin: "水曰润下 - Water moistens and descends; it finds paths where others see only walls"
        },
        {
            name: "Depth Accumulation (渊默)",
            description: "Deep water is still and full. Depth creates capacity. Accumulate knowledge and relationships before deploying them.",
            application: [
                "Build silent reservoirs of capability",
                "Speak from depth, not breadth",
                "Cultivate quiet authority over loud presence",
                "Store resources in times of abundance"
            ],
            triggers: ["Expertise development", "Authority building", "Strategic patience"],
            antidotes: ["Shallow display", "Premature revelation", "Depleted reserves"],
            origin: "积水成渊 - Accumulated water becomes a deep pool; depth creates dragon habitat"
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// DECISION FRAMEWORKS
// ═══════════════════════════════════════════════════════════════════════════

export const DECISION_FRAMEWORKS: DecisionFramework[] = [
    {
        name: "Five Element Decision Matrix (五行决)",
        context: "When facing complex decisions with multiple stakeholders or uncertain outcomes",
        steps: [
            "Wood: What are the growth opportunities? What would I learn?",
            "Fire: Where is the passion/energy? What would illuminate?",
            "Earth: What is the timing? What foundation exists?",
            "Metal: What must be eliminated? What are the hard constraints?",
            "Water: Where is the flow? What am I resisting?",
            "Synthesis: Which element is most dominant in the situation? Align decision with that energy."
        ],
        elementAlignment: ["wood", "fire", "earth", "metal", "water"],
        contraindications: ["Simple binary decisions", "Time-critical emergencies"]
    },
    {
        name: "Seasonal Timing Framework (待时而动)",
        context: "When deciding WHEN to act rather than WHETHER to act",
        steps: [
            "Identify the current 'season' of your project/career/relationship",
            "Spring (寅卯): Time for planting new seeds—begin initiatives",
            "Summer (巳午): Time for growth—expand and nurture what was planted",
            "Autumn (申酉): Time for harvest—collect returns, conclude phases",
            "Winter (亥子): Time for storage—rest, plan, consolidate",
            "Align action with season; don't harvest in spring or plant in winter"
        ],
        elementAlignment: ["wood", "fire", "metal", "water"],
        contraindications: ["Forced deadlines", "Emergency responses"]
    },
    {
        name: "Ten God Interaction Model (十神应用)",
        context: "When analyzing relationships, partnerships, or collaborative decisions",
        steps: [
            "Identify your Day Master (self element)",
            "Who/what is producing you? (印 - Resources/Support) - Accept help",
            "Who/what are you producing? (食伤 - Expression/Output) - Give value",
            "Who/what are you overcoming? (财 - Wealth/Opportunities) - Pursue gains",
            "Who/what is overcoming you? (官杀 - Pressure/Authority) - Respect constraints",
            "Who/what is same as you? (比劫 - Peers/Competition) - Collaborate selectively"
        ],
        elementAlignment: ["earth"],
        contraindications: ["Solo decisions", "Non-relational choices"]
    },
    {
        name: "Branch Interaction Strategy (地支运筹)",
        context: "When interpersonal dynamics or hidden factors complicate decisions",
        steps: [
            "Check for Clashes (冲): Is there fundamental opposition? Consider timing separation",
            "Check for Combinations (合): Where are alliances? Leverage these",
            "Check for Harm (害): Hidden conflicts? Address before they erupt",
            "Check for Punishment (刑): Repetitive patterns? Break the cycle",
            "Check for Three Meetings (会): Natural groupings? Align with these",
            "Map the landscape of interactions before choosing your move"
        ],
        elementAlignment: ["metal", "water"],
        contraindications: ["Simple mechanical decisions", "No stakeholder context"]
    },
    {
        name: "Root and Branch Analysis (本末先后)",
        context: "When overwhelmed by details or symptoms; need to find leverage points",
        steps: [
            "Identify the 'branches'—visible symptoms, immediate concerns",
            "Trace each branch to its 'root'—underlying cause or source",
            "Classify: Is this a root issue or branch symptom?",
            "Prioritize: Address roots before branches",
            "Resource allocation: Invest most in root causes",
            "Monitor: Watch for new branches growing from old roots"
        ],
        elementAlignment: ["wood"],
        contraindications: ["Branch-level emergencies that need immediate action"]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// COGNITIVE BIASES FROM BAZI PERSPECTIVE
// ═══════════════════════════════════════════════════════════════════════════

export const ELEMENTAL_COGNITIVE_BIAS: CognitiveBias[] = [
    {
        name: "Excessive Wood Bias (木亢)",
        description: "Over-prioritizing growth and new beginnings at the expense of maintaining existing systems. Constant expansion without consolidation.",
        baziCorrelation: "Strong Wood with weak Earth—growth without foundation",
        correctionStrategy: [
            "Force a 'maintenance season' before new expansions",
            "Ask: 'What am I responsible for maintaining?'",
            "Practice gratitude for current state before seeking next",
            "Set finish lines, not just milestones"
        ]
    },
    {
        name: "Uncontrolled Fire Bias (火炎)",
        description: "Chasing passion and intensity, starting new projects with enthusiasm but lacking follow-through. Action without sustainability.",
        baziCorrelation: "Strong Fire with weak Water—passion without depth",
        correctionStrategy: [
            "Implement a 'cooling off' period before new commitments",
            "Ask: 'Can I sustain this for 10 years?'",
            "Finish one thing before starting the next",
            "Build rest into your schedule"
        ]
    },
    {
        name: "Excessive Earth Bias (土滞)",
        description: "Analysis paralysis and over-preparation. Waiting for perfect conditions, accumulating without deploying. Stability becomes stagnation.",
        baziCorrelation: "Strong Earth with weak Wood—inertia without growth",
        correctionStrategy: [
            "Set decision deadlines and honor them",
            "Ask: 'What am I waiting for permission to do?'",
            "Ship at 80% completion",
            "Practice imperfect action daily"
        ]
    },
    {
        name: "Excessive Metal Bias (金刚)",
        description: "Excessive cutting and elimination. Over-simplifying, harsh boundaries, perfectionism. Cutting away the necessary with the unnecessary.",
        baziCorrelation: "Strong Metal with weak Fire—precision without warmth",
        correctionStrategy: [
            "Before cutting, ask: 'What does this connect to?'",
            "Keep 10% buffer for 'inefficient' but valuable things",
            "Practice 'warm' metal—boundaries with compassion",
            "Allow mess in creative spaces"
        ]
    },
    {
        name: "Scattered Water Bias (水流)",
        description: "Adaptability becomes lack of commitment. Taking shape of everything, being nothing definitive. Intelligence without execution.",
        baziCorrelation: "Strong Water with weak Earth—flow without container",
        correctionStrategy: [
            "Make commitments you cannot break easily",
            "Ask: 'Who am I when I'm not adapting?'",
            "Stay in uncomfortable consistency",
            "Define success in concrete, not fluid terms"
        ]
    },
    {
        name: "Missing Element Blindness (缺)",
        description: "Being blind to the qualities of your weakest element. Assuming your strengths are universal, failing to see value in what you lack.",
        baziCorrelation: "Extremely low score in one element (<10%)",
        correctionStrategy: [
            "Seek partners who are strong where you are weak",
            "Study the value of your weakest element deliberately",
            "Audit decisions: 'Have I considered [missing element]?'",
            "Create environment that supplements weakness"
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERATIVE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getRelevantMentalModels(
    dayMasterElement: string,
    dominantElement: string,
    weakestElement: string
): MentalModel[] {
    const models: MentalModel[] = [];
    
    // Add Day Master models
    if (ELEMENTAL_MENTAL_MODELS[dayMasterElement]) {
        models.push(...ELEMENTAL_MENTAL_MODELS[dayMasterElement].slice(0, 2));
    }
    
    // Add dominant element models if different
    if (dominantElement !== dayMasterElement && ELEMENTAL_MENTAL_MODELS[dominantElement]) {
        models.push(ELEMENTAL_MENTAL_MODELS[dominantElement][0]);
    }
    
    // Add weakest element antidotes
    if (weakestElement !== dayMasterElement && ELEMENTAL_MENTAL_MODELS[weakestElement]) {
        const weakModels = ELEMENTAL_MENTAL_MODELS[weakestElement];
        models.push({
            ...weakModels[0],
            name: `Cultivating ${weakestElement.charAt(0).toUpperCase() + weakestElement.slice(1)}`,
            description: `Your weakest element (${weakestElement}) represents a blind spot. Study these models to compensate.`
        });
    }
    
    return models;
}

export function getRelevantDecisionFrameworks(
    elementProfile: ElementVector
): DecisionFramework[] {
    const total = Object.values(elementProfile).reduce((a, b) => a + b, 0);
    
    // Determine dominant element type
    const dominant = Object.entries(elementProfile)
        .sort(([,a], [,b]) => b - a)[0][0];
    
    // Recommend frameworks based on dominant energy
    if (dominant === "wood" || dominant === "fire") {
        return DECISION_FRAMEWORKS.filter(f => 
            f.name.includes("Growth") || 
            f.name.includes("Seasonal") ||
            f.name.includes("Root")
        );
    }
    
    if (dominant === "metal") {
        return DECISION_FRAMEWORKS.filter(f => 
            f.name.includes("Metal") ||
            f.name.includes("Branch")
        );
    }
    
    if (dominant === "water") {
        return DECISION_FRAMEWORKS.filter(f => 
            f.name.includes("Adaptive") ||
            f.name.includes("Ten God")
        );
    }
    
    // Default for earth or balanced
    return DECISION_FRAMEWORKS.slice(0, 3);
}

export function detectCognitiveBiases(
    elementProfile: ElementVector
): CognitiveBias[] {
    const biases: CognitiveBias[] = [];
    const total = Object.values(elementProfile).reduce((a, b) => a + b, 0);
    
    // Find dominant and weakest
    const sorted = Object.entries(elementProfile).sort(([,a], [,b]) => b - a);
    const dominant = sorted[0];
    const weakest = sorted[4];
    
    // Check for excessive dominant
    if (dominant[1] / total > 0.35) {
        const biasMap: Record<string, CognitiveBias> = {
            wood: ELEMENTAL_COGNITIVE_BIAS[0],
            fire: ELEMENTAL_COGNITIVE_BIAS[1],
            earth: ELEMENTAL_COGNITIVE_BIAS[2],
            metal: ELEMENTAL_COGNITIVE_BIAS[3],
            water: ELEMENTAL_COGNITIVE_BIAS[4],
        };
        if (biasMap[dominant[0]]) biases.push(biasMap[dominant[0]]);
    }
    
    // Check for missing element
    if (weakest[1] / total < 0.1) {
        biases.push(ELEMENTAL_COGNITIVE_BIAS[5]);
    }
    
    return biases;
}

export interface DailyStrategy {
    period: "spring" | "summer" | "autumn" | "winter" | "transition";
    element: string;
    strategy: string;
    actions: string[];
    avoid: string[];
}

export function getDailyStrategy(
    currentSolarTerm: string,
    dayPillarElement: string
): DailyStrategy {
    // Map solar terms to seasons
    const springTerms = ["立春", "雨水", "惊蛰", "春分", "清明", "谷雨"];
    const summerTerms = ["立夏", "小满", "芒种", "夏至", "小暑", "大暑"];
    const autumnTerms = ["立秋", "处暑", "白露", "秋分", "寒露", "霜降"];
    const winterTerms = ["立冬", "小雪", "大雪", "冬至", "小寒", "大寒"];
    
    let period: "spring" | "summer" | "autumn" | "winter" | "transition";
    let strategy: string;
    let actions: string[];
    let avoid: string[];
    
    if (springTerms.includes(currentSolarTerm)) {
        period = "spring";
        strategy = "Plant and Initiate";
        actions = ["Begin new projects", "Make new connections", "Plant seeds for future growth", "Set intentions"];
        avoid = ["Harvesting prematurely", "Heavy pruning", "Finalizing contracts"];
    } else if (summerTerms.includes(currentSolarTerm)) {
        period = "summer";
        strategy = "Expand and Express";
        actions = ["Show your work", "Engage socially", "Maximize visibility", "Take bold action"];
        avoid = ["Starting things you can't finish", "Hiding", "Consolidating"];
    } else if (autumnTerms.includes(currentSolarTerm)) {
        period = "autumn";
        strategy = "Harvest and Cut";
        actions = ["Collect returns", "End unsustainable commitments", "Focus on essentials", "Edit and refine"];
        avoid = ["Planting new seeds", "Expanding scope", "Maintaining dead weight"];
    } else if (winterTerms.includes(currentSolarTerm)) {
        period = "winter";
        strategy = "Store and Consolidate";
        actions = ["Plan for spring", "Rest and recover", "Maintain only what's essential", "Study and prepare"];
        avoid = ["Launching initiatives", "Demanding visibility", "Expanding obligations"];
    } else {
        period = "transition";
        strategy = "Adapt to emerging phase";
        actions = ["Be flexible", "Prepare for the next phase", "Watch for signs"];
        avoid = ["Committing to rigid plans"];
    }
    
    return {
        period,
        element: dayPillarElement,
        strategy,
        actions,
        avoid,
    };
}

export { ELEMENTAL_MENTAL_MODELS, DECISION_FRAMEWORKS, ELEMENTAL_COGNITIVE_BIAS };
