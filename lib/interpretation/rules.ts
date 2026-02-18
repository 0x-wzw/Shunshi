import { ElementVector } from "../bazi/element_scoring";
import { InterpretationCard, Severity } from "./types";
import { normalize, topN, bottomN } from "./scoring";

export function dominantPlaybook(el: string): { why: string; whatToDo: string[]; tags: string[] } {
    const playbooks: Record<string, any> = {
        wood: {
            why: "Strong Wood indicates high growth energy but potential for stubbornness.",
            whatToDo: ["Practice flexibility", "Engage in creative arts", "Use metal colors (white) to balance"],
            tags: ["Growth", "Vision", "Rigidity"],
        },
        fire: {
            why: "Strong Fire brings passion and intensity, but may lead to burnout.",
            whatToDo: ["Calm the mind through meditation", "Hydrate frequently", "Use water colors (black/blue)"],
            tags: ["Passion", "Expression", "Impulsivity"],
        },
        earth: {
            why: "Strong Earth suggests stability and reliability, but can lead to stagnation.",
            whatToDo: ["Movement and exercise", "Travel or try new things", "Use wood colors (green)"],
            tags: ["Trust", "Stability", "Inertia"],
        },
        metal: {
            why: "Strong Metal denotes precision and discipline, but may cause coldness.",
            whatToDo: ["Cultivate warm relationships", "Avoid over-criticism", "Use fire colors (red/purple)"],
            tags: ["Justice", "Ordnance", "Severity"],
        },
        water: {
            why: "Strong Water shows deep wisdom and adaptability, but potential for fear.",
            whatToDo: ["Focus on grounding routines", "Share ideas early", "Use earth colors (brown/yellow)"],
            tags: ["Wisdom", "Flow", "Insecurity"],
        },
    };
    return playbooks[el] || { why: "Unknown dominant", whatToDo: [], tags: [] };
}

export function weakestPlaybook(el: string): { why: string; whatToDo: string[]; tags: string[] } {
    const playbooks: Record<string, any> = {
        wood: {
            why: "Weak Wood may limit your ability to start new projects or grow.",
            whatToDo: ["Surround yourself with plants", "Set small, incremental goals", "Write in a journal"],
            tags: ["Start-up", "Vitality", "Kindness"],
        },
        fire: {
            why: "Weak Fire can result in low enthusiasm or visibility.",
            whatToDo: ["Engage in public activities", "Wear bright colors", "Spend time in sunlight"],
            tags: ["Joy", "Awareness", "Brightness"],
        },
        earth: {
            why: "Weak Earth might cause a lack of focus or grounding.",
            whatToDo: ["Stick to a schedule", "Cook and eat healthy meals", "Practice mindfulness"],
            tags: ["Focus", "Belief", "Health"],
        },
        metal: {
            why: "Weak Metal may lead to a lack of boundaries or structure.",
            whatToDo: ["Set clear rules for yourself", "Organize your physical space", "Exercise decision making"],
            tags: ["Boundary", "Efficiency", "Logic"],
        },
        water: {
            why: "Weak Water could mean difficulty adapting or communicating.",
            whatToDo: ["Listen more than talking", "Swimming or taking baths", "Connect with your intuition"],
            tags: ["Agility", "Intelligence", "Empathy"],
        },
    };
    return playbooks[el] || { why: "Unknown weakest", whatToDo: [], tags: [] };
}

export function elementCards(v: ElementVector): InterpretationCard[] {
    const normalized = normalize(v);
    const dominant = topN(normalized, 1)[0];
    const weakest = bottomN(normalized, 1)[0];
    const cards: InterpretationCard[] = [];

    // Dominant Card
    const domInfo = dominantPlaybook(dominant);
    cards.push({
        title: `Dominant Element: ${dominant.toUpperCase()}`,
        severity: "med",
        ...domInfo,
    });

    // Weakest Card
    const weakInfo = weakestPlaybook(weakest);
    cards.push({
        title: `Weakest Element: ${weakest.toUpperCase()}`,
        severity: "med",
        ...weakInfo,
    });

    // Imbalance Card
    const values = Object.values(normalized);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const ratio = min > 0 ? max / min : 10;

    if (ratio >= 1.8) {
        cards.push({
            title: "Significant Imbalance",
            severity: "high",
            why: `The ratio between your strongest and weakest element (${ratio.toFixed(1)}) exceeds the balance threshold.`,
            whatToDo: [
                "Focus heavily on the weakest element's playbook",
                "Minimize activities related to the dominant element",
                "Consult with a professional if feeling persistent stress",
            ],
            tags: ["Harmony", "Optimization", "Alert"],
        });
    }

    return cards;
}
