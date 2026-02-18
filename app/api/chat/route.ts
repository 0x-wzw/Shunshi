import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message, context } = await req.json();

        // In a real implementation, we would call an LLM (e.g., OpenAI, Gemini) here.
        // The system prompt would look like this:
        /*
        System Prompt:
        You are the "Hourly Choice Reflection Assistant". Your role is to help users understand their BaZi report (provided in context) and reflect on their daily choices.
        
        GUIDELINES:
        1. NEVER direct a decision (e.g., don't say "You should buy this stock").
        2. ALWAYS reflect or mirror (e.g., "Based on your strong Fire element today, you might find expressing yourself is easier, how does that align with your meeting?").
        3. Use the BaZi pillars and element balance provided in the context.
        4. Maintain a calm, analytical, and supportive tone.
        5. If a user asks for a definitive decision, gently remind them that you are a reflection tool for guidance and self-reference only.
        */

        // MOCK RESPONSE for MVP
        let responseText = "";

        const clarificationMatch = message.match(/clarification on the "(.*)" insight/i);
        if (clarificationMatch) {
            const insightTitle = clarificationMatch[1];
            const card = context?.cards?.find((c: any) => c.title.toLowerCase() === insightTitle.toLowerCase());

            if (card) {
                responseText = `You're asking for more depth on the "${card.title}" insight. This aspect of your BaZi report highlights "${card.why}". From a reflection standpoint, consider how this specifically manifests when you face challenges. For example, your recommended action "${card.whatToDo[0]}" is a way to ground this energy. How does that feel as a practical step for you right now?`;
            } else {
                responseText = `I see you're interested in that specific insight. While I delve into the details, remember that these interpretations are mirrors of your elemental balance. How does the core energy of that observation resonate with your current situation?`;
            }
        } else if (message.toLowerCase().includes("invest") || message.toLowerCase().includes("buy")) {
            responseText = "Looking at your current luck pillar and the elemental balance for this hour, there is a strong presence of 'Wealth' elements. However, rather than directing YOUR investment choices, consider how your current state of confidence might be influencing your risk appetite. How does this period of 'Direct Wealth' energy reflect in your current financial planning?";
        } else if (message.toLowerCase().includes("work") || message.toLowerCase().includes("career")) {
            responseText = "Your BaZi pillars suggest a high concentration of 'Officer' energy today, which often relates to structure and authority. Instead of telling you what career move to make, I invite you to reflect on whether you feel more inclined towards leadership or execution right now. How does the 'Metal' energy in your Hour pillar mirror your current workflow?";
        } else {
            responseText = "That's an interesting question. Based on your elemental profile (Balance Index: " + (context?.elements?.balanceIndex * 100).toFixed(0) + "%), the current energies are highlighting your " + Object.keys(context?.elements?.vector || {})[0] + " element. This often correlates with certain predispositions in behavior. How do you see these qualities showing up in your life today?";
        }

        return NextResponse.json({ message: responseText });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
