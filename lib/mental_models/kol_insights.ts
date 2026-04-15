// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  KOL MENTAL MODELS & PRINCIPLES ARCHIVE                                    ║
// ║  Insights from ERC-8004 ecosystem thought leaders                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * This module extracts and catalogs mental models from KOLs in the
 * ERC-8004 / AI agent ecosystem. These are derived from their public
 * writings, talks, and social media content.
 * 
 * STANDALONE MODULE - Not linked to Bazi
 */

// ═══════════════════════════════════════════════════════════════════════════
// KOL META-INFORMATION
// ═══════════════════════════════════════════════════════════════════════════

export interface KOL {
    handle: string;
    name: string;
    focus: string;
    role: string;
    sources: {
        x?: string;
        linkedin?: string;
        blog?: string;
        podcast?: string[];
    };
    mentalModels: KOLMentalModel[];
    corePrinciples: Principle[];
    contentStyle: ContentStyle;
    recommendedFollow: boolean;
    lastUpdated: string;
}

export interface KOLMentalModel {
    name: string;
    description: string;
    source: string;
    application: string[];
    domainTag: string;
}

export interface Principle {
    statement: string;
    source: string;
    context: string;
}

export interface ContentStyle {
    primaryMedium: string;
    postFrequency: string;
    depthLevel: "tactical" | "strategic" | "philosophical";
    tone: string[];
    patterns: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// MARCO DE ROSSI (@MarcoMetaMask) - ERC-8004 Co-author
// ═══════════════════════════════════════════════════════════════════════════

export const MarcoDeRossi: KOL = {
    handle: "@MarcoMetaMask",
    name: "Marco De Rossi",
    focus: "Production AI, Survival Tech, Trustless Systems",
    role: "ERC-8004 Co-author",
    sources: {
        x: "https://x.com/marco_derossi",
        blog: "https://medium.com/survival-tech",
    },
    mentalModels: [
        {
            name: "Production Reality Check",
            description: "Demos work → Production hits → Systems fail. True validation happens in production, not presentations. The gap between 'works in demo' and 'works at scale' is where most AI projects die.",
            source: "X post on AI agent production failures",
            application: [
                "Test in production-like environments before launch",
                "Account for entropy: Monday works, Tuesday dead",
                "Monitor for PII leaks, hallucinations, wrong tool picks",
                "Design for deterministic failure modes, not just success"
            ],
            domainTag: "AI-Production"
        },
        {
            name: "Deterministic Responses", 
            description: "True zero-temperature mode → no hidden randomness. Batch-invariant kernels → identical outputs every time. This is a paradigm shift from probabilistic to deterministic AI.",
            source: "Twitter thread on batch-invariant kernels",
            application: [
                "Implement batch-invariant kernels for reproducibility",
                "Enable reliable code auditing",
                "Create stable performance benchmarks",
                "Deploy mission-critical systems with confidence"
            ],
            domainTag: "AI-Reliability"
        },
        {
            name: "Survival Tech Mindset",
            description: "Building technology that survives beyond demo day. Focus on longevity, resilience, and antifragility over feature richness and growth metrics.",
            source: "Survival Tech blog / Personal motivation",
            application: [
                "Prioritize sustainability over scale",
                "Build systems that degrade gracefully",
                "Design for long-term maintenance",
                "Value boring but reliable over exciting but fragile"
            ],
            domainTag: "System-Design"
        },
        {
            name: "Decentralized Discovery",
            description: "Agents can discover and trust each other without a central intermediary. This enables open-ended agent economies, not siloed corporate fiefdoms.",
            source: "ERC-8004 motivation / Press releases",
            application: [
                "Build open discovery mechanisms",
                "Avoid central gatekeepers",
                "Enable cross-organizational agent interaction",
                "Foster emergent agent economies"
            ],
            domainTag: "Web3-Philosophy"
        }
    ],
    corePrinciples: [
        {
            statement: "40% of agentic AI projects will be canceled by 2027 because they don't solve production reality",
            source: "Gartner citation / Twitter",
            context: "Focus beyond demos to real-world reliability"
        },
        {
            statement: "Picks wrong tool 30% of the time, hallucinates file paths, leaks PII into logs",
            source: "X post on production AI failures",
            context: "Current state of AI agent production issues"
        },
        {
            statement: "Trustless agents laying the foundation for open agent economies",
            source: "ERC-8004 announcement / Motivation",
            context: "Philosophy of decentralized trust"
        }
    ],
    contentStyle: {
        primaryMedium: "Twitter/X threads",
        postFrequency: "Weekly insights",
        depthLevel: "tactical",
        tone: ["observational", "realistic", "production-focused"],
        patterns: [
            "Calls out gap between demo and production",
            "Shares hard-won failures",
            "Emphasizes deterministic over probabilistic",
            "Links abstract theory to concrete production issues"
        ]
    },
    recommendedFollow: true,
    lastUpdated: "2026-04-14"
};

// ═══════════════════════════════════════════════════════════════════════════
// DAVIDE CRAPIS (@dcrapis) - ERC-8004 Co-author
// ═══════════════════════════════════════════════════════════════════════════

export const DavideCrapis: KOL = {
    handle: "@dcrapis",
    name: "Davide Crapis",
    focus: "Standards, Ethereum Strategy, Agent Economies",
    role: "ERC-8004 Co-author, Ethereum Research",
    sources: {
        x: "https://x.com/dcrapis",
        linkedin: "https://linkedin.com/in/davidecrapis",
    },
    mentalModels: [
        {
            name: "Standards Create Societies",
            description: "ERC-20 unified tokens → ERC-8004 will unify agents. Standards are the invisible infrastructure that enables trustless coordination at scale. Standards create societies — trustless agent societies.",
            source: "LinkedIn posts / ERC-8004 discourse",
            application: [
                "Think in terms of composable primitives",
                "Build for interoperability, not isolation",
                "Standards reduce friction for adoption",
                "Create protocols that others can build on"
            ],
            domainTag: "Protocol-Design"
        },
        {
            name: "Three Registries Architecture",
            description: "Three lightweight registries as the backbone for autonomous agent interaction: Identity (who), Reputation (how reliable), Validation (prove it). Together they form a trust layer.",
            source: "ERC-8004 specification / LinkedIn",
            application: [
                "Separate concerns: identity ≠ reputation ≠ validation",
                "Enable composable trust primitives",
                "Allow security proportional to value at risk",
                "Support multiple trust models simultaneously"
            ],
            domainTag: "Architecture"
        },
        {
            name: "Ethereum as Trust Layer",
            description: "Ethereum is in a unique position to be the operating system for AI agents. By moving AI out of centralized silos onto decentralized registries, we enable agents to discover and maintain trust.",
            source: "LinkedIn post on Ethereum's strategy",
            application: [
                "Use blockchain as neutral coordination substrate",
                "Enable cross-organizational computation",
                "Standardize agent interaction patterns",
                "Create portable, verifiable reputation"
            ],
            domainTag: "Strategic-Positioning"
        },
        {
            name: "Agent as Economic Actor",
            description: "Agents are not just tools but autonomous economic actors. They can transact, coordinate, and create value without constant human oversight. This requires economic primitives, not just technical ones.",
            source: "ERC-8004 ecosystem posts",
            application: [
                "Design for agent autonomy, not just automation",
                "Enable economic interactions between agents",
                "Create incentive-compatible protocols",
                "Think of agents as first-class economic entities"
            ],
            domainTag: "Agent-Economics"
        }
    ],
    corePrinciples: [
        {
            statement: "ERC-8004 is to agents what ERC-20 was to tokens: a unifying protocol",
            source: "Multiple posts / Ecosystem analysis",
            context: "Comparison of historical standards to current work"
        },
        {
            statement: "Standards create societies — trustless agent societies",
            source: "LinkedIn / Agent economy discourse",
            context: "The power of common protocols to enable emergent order"
        },
        {
            statement: "Agents need orchestration, payments, and trust",
            source: "ERC-8004 positioning / Agent stack analysis",
            context: "Three pillars of the agent economy"
        },
        {
            statement: "Security proportional to value at risk",
            source: "ERC-8004 specification / Design rationale",
            context: "Tiered trust: from ordering pizza to medical diagnosis"
        }
    ],
    contentStyle: {
        primaryMedium: "LinkedIn articles",
        postFrequency: "Weekly strategic pieces",
        depthLevel: "strategic",
        tone: ["systemic", "architectural", "visionary"],
        patterns: [
            "Frames technology in historical context",
            "Emphasizes standards and protocols",
            "Connects abstract primitives to concrete outcomes",
            "Uses analogies (ERC-20 → ERC-8004)"
        ]
    },
    recommendedFollow: true,
    lastUpdated: "2026-04-14"
};

// ═══════════════════════════════════════════════════════════════════════════
// ERC-8004 ORGANIZATION (@erc_8004)
// ═══════════════════════════════════════════════════════════════════════════

export const ERC8004Org: KOL = {
    handle: "@erc_8004",
    name: "ERC-8004 Official",
    focus: "Technical Specification, Standard Development",
    role: "Official ERC-8004 Organization Account",
    sources: {
        x: "https://x.com/erc_8004",
    },
    mentalModels: [
        {
            name: "Protocol-First Design",
            description: "Start with the protocol specification, not the implementation. Clear standards enable multiple competing implementations and prevent vendor lock-in.",
            source: "ERC-8004 specification approach",
            application: [
                "Document before building",
                "Separate interface from implementation",
                "Enable multiple client implementations",
                "Prioritize interoperability"
            ],
            domainTag: "Standardization"
        },
        {
            name: "Pluggable Trust Models",
            description: "Trust models are pluggable and tiered. From reputation systems (lightweight) to zkML/TEE proofs (heavyweight). Different values at risk require different trust assurances.",
            source: "ERC-8004 abstract / Architecture",
            application: [
                "Allow trust model flexibility",
                "Match security to value at risk",
                "Enable trust model evolution",
                "Support multiple verification mechanisms"
            ],
            domainTag: "Security-Design"
        },
        {
            name: "On-Chain Pointer, Off-Chain Content",
            description: "Use blockchain for pointers and commitments (hashes), IPFS/https for content. Balances permanence with scalability.",
            source: "ERC-8004 registry design",
            application: [
                "Store hashes on-chain, data off-chain",
                "Use URIs for flexible content addressing",
                "Emit events for indexing",
                "Enable subgraph queries"
            ],
            domainTag: "Data-Architecture"
        }
    ],
    corePrinciples: [
        {
            statement: "MCP and A2A handle communication; ERC-8004 handles discovery and trust",
            source: "ERC-8004 motivation",
            context: "Complementary to existing protocols, not replacing"
        },
        {
            statement: "Identity Registry + Reputation Registry + Validation Registry = Trust Layer",
            source: "ERC-8004 architecture",
            context: "Three-pillar trust architecture"
        }
    ],
    contentStyle: {
        primaryMedium: "Technical documentation",
        postFrequency: "Milestone announcements",
        depthLevel: "tactical",
        tone: ["technical", "specification-focused", "neutral"],
        patterns: [
            "Announces new standard versions",
            "Links to spec and code",
            "Technical progress updates",
            "Rarely philosophical, mostly practical"
        ]
    },
    recommendedFollow: true,
    lastUpdated: "2026-04-14"
};

// ═══════════════════════════════════════════════════════════════════════════
// MICHAEL KANTOR (@MichaelRKantor) - ERC-8004 Explainer
// ═══════════════════════════════════════════════════════════════════════════

export const MichaelKantor: KOL = {
    handle: "@MichaelRKantor",
    name: "Michael Kantor",
    focus: "ERC-8004 Education, Podcast Communication",
    role: "ERC-8004 Explainer, Communications",
    sources: {
        podcast: ["Unchained - 'Want to Hire an AI Agent? Check Their Reputation Via ERC-8004'"],
    },
    mentalModels: [
        {
            name: "Reputation as Hiring Signal",
            description: "Just as you check a human candidate's LinkedIn/references, ERC-8004 enables checking an AI agent's reputation—its track record, validation history, and feedback from past "employers" (clients).",
            source: "Unchained podcast episode",
            application: [
                "Think of agents as service providers with reputations",
                "Use on-chain history for agent selection",
                "Request validation before high-value work",
                "Aggregate reputation across multiple dimensions"
            ],
            domainTag: "Trust-Markets"
        },
        {
            name: "Agent Marketplace Mentality",
            description: "Think of the agent ecosystem as a marketplace where reputation acts as the hiring filter. Without reputation data, you can't make informed agent hiring decisions.",
            source: "Unchained podcast / Explainer content",
            application: [
                "Evaluate agents based on measurable track records",
                "Think in terms of agent service marketplace",
                "Use feedback as hiring proxy",
                "Create reputation-based agent discovery"
            ],
            domainTag: "Market-Design"
        }
    ],
    corePrinciples: [
        {
            statement: "Want to hire an AI agent? Check their reputation via ERC-8004",
            source: "Unchained podcast title / Core meme",
            context: "Simple framing: reputation as hiring mechanism"
        }
    ],
    contentStyle: {
        primaryMedium: "Podcast appearances",
        postFrequency: "Monthly features",
        depthLevel: "strategic",
        tone: ["accessible", "explainer", "bridge-builder"],
        patterns: [
            "Translates technical concepts to business language",
            "Uses analogies (hiring, references)",
            "Focuses on 'why' more than 'how'",
            "Makes complex standards approachable"
        ]
    },
    recommendedFollow: true,
    lastUpdated: "2026-04-14"
};

// ═══════════════════════════════════════════════════════════════════════════
// KOL REGISTRY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_KOLS: KOL[] = [
    MarcoDeRossi,
    DavideCrapis,
    ERC8004Org,
    MichaelKantor
];

export function getAllKOLs(): KOL[] {
    return ALL_KOLS;
}

export function getKOLByHandle(handle: string): KOL | undefined {
    return ALL_KOLS.find(k => k.handle.toLowerCase() === handle.toLowerCase());
}

export function getKOLByName(name: string): KOL | undefined {
    return ALL_KOLS.find(k => k.name.toLowerCase().includes(name.toLowerCase()));
}

export function getAllMentalModelsFromKOLs(): (KOLMentalModel & { sourceKOL: string })[] {
    return ALL_KOLS.flatMap(kol => 
        kol.mentalModels.map(mm => ({
            ...mm,
            sourceKOL: kol.name
        }))
    );
}

export function searchKOLInsights(query: string): Array<{kol: string; insight: string; source: string}> {
    const q = query.toLowerCase();
    const results: Array<{kol: string; insight: string; source: string}> = [];
    
    ALL_KOLS.forEach(kol => {
        // Search mental models
        kol.mentalModels.forEach(mm => {
            if (mm.name.toLowerCase().includes(q) || 
                mm.description.toLowerCase().includes(q)) {
                results.push({
                    kol: kol.name,
                    insight: mm.name,
                    source: mm.source
                });
            }
        });
        
        // Search principles
        kol.corePrinciples.forEach(p => {
            if (p.statement.toLowerCase().includes(q)) {
                results.push({
                    kol: kol.name,
                    insight: p.statement,
                    source: p.source
                });
            }
        });
    });
    
    return results;
}

export function getInsightsByDomain(domain: string): KOLMentalModel[] {
    return getAllMentalModelsFromKOLs().filter(
        mm => mm.domainTag.toLowerCase() === domain.toLowerCase()
    ) as KOLMentalModel[];
}

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION WITH MENTAL MODELS FRAMEWORK (Optional/Standalone)
// ═══════════════════════════════════════════════════════════════════════════

export interface ERCKOLInsight {
    kol: string;
    handle: string;
    insight: string;
    category: string;
    context: string;
    application: string[];
}

/**
 * Convert KOL insights to generic mental model format for integration
 */
export function convertKOLToMentalModels(): ERCKOLInsight[] {
    const insights: ERCKOLInsight[] = [];
    
    ALL_KOLS.forEach(kol => {
        kol.mentalModels.forEach(mm => {
            insights.push({
                kol: kol.name,
                handle: kol.handle,
                insight: mm.name,
                category: mm.domainTag,
                context: mm.description,
                application: mm.application
            });
        });
    });
    
    return insights;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export { MarcoDeRossi, DavideCrapis, ERC8004Org, MichaelKantor };
export default ALL_KOLS;
