import { NextRequest, NextResponse } from "next/server";
import { 
    getAllMentalModels,
    getAllFrameworks,
    getAllBiases,
    searchMentalModels,
    getMentalModelByName,
    getFrameworkByName,
    getMentalModelsByElement,
    getRecommendedModelForDecision,
    getDailyStrategy,
    generateDailyPrompt,
} from "@/lib/mental_models";

/**
 * API Route for Mental Models
 * Provides endpoints for:
 * - Getting all mental models
 * - Searching mental models
 * - Getting models by element
 * - Getting decision frameworks
 * - Getting cognitive biases
 * - Getting daily prompts
 */

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "list";
    
    try {
        switch (action) {
            case "list":
                const type = searchParams.get("type") || "all";
                if (type === "models") {
                    return NextResponse.json({ 
                        data: getAllMentalModels(),
                        count: getAllMentalModels().length 
                    });
                } else if (type === "frameworks") {
                    return NextResponse.json({ 
                        data: getAllFrameworks(),
                        count: getAllFrameworks().length 
                    });
                } else if (type === "biases") {
                    return NextResponse.json({ 
                        data: getAllBiases(),
                        count: getAllBiases().length 
                    });
                } else {
                    return NextResponse.json({
                        mentalModels: getAllMentalModels(),
                        frameworks: getAllFrameworks(),
                        biases: getAllBiases(),
                    });
                }
                
            case "element":
                const element = searchParams.get("element");
                if (!element) {
                    return NextResponse.json({ error: "Element parameter required" }, { status: 400 });
                }
                return NextResponse.json({
                    models: getMentalModelsByElement(element),
                    element,
                });
                
            case "search":
                const query = searchParams.get("q");
                if (!query) {
                    return NextResponse.json({ error: "Query parameter 'q' required" }, { status: 400 });
                }
                return NextResponse.json({
                    results: searchMentalModels(query),
                    query,
                });
                
            case "model":
                const modelName = searchParams.get("name");
                if (!modelName) {
                    return NextResponse.json({ error: "Name parameter required" }, { status: 400 });
                }
                const model = getMentalModelByName(modelName);
                if (!model) {
                    return NextResponse.json({ error: "Mental model not found" }, { status: 404 });
                }
                return NextResponse.json({ data: model });
                
            case "framework":
                const frameworkName = searchParams.get("name");
                if (!frameworkName) {
                    return NextResponse.json({ error: "Name parameter required" }, { status: 400 });
                }
                const framework = getFrameworkByName(frameworkName);
                if (!framework) {
                    return NextResponse.json({ error: "Framework not found" }, { status: 404 });
                }
                return NextResponse.json({ data: framework });
                
            case "recommend":
                const decisionType = searchParams.get("type");
                if (!decisionType) {
                    return NextResponse.json({ error: "Type parameter required" }, { status: 400 });
                }
                return NextResponse.json({
                    recommendations: getRecommendedModelForDecision(decisionType),
                    decisionType,
                });
                
            case "daily":
                const dmElement = searchParams.get("dayMaster");
                if (!dmElement) {
                    return NextResponse.json({ error: "dayMaster parameter required" }, { status: 400 });
                }
                return NextResponse.json({
                    prompt: generateDailyPrompt(dmElement),
                });
                
            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Mental Models API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, dayMasterElement, elementProfile, decisionType } = body;
        
        switch (action) {
            case "daily":
                if (!dayMasterElement) {
                    return NextResponse.json({ error: "dayMasterElement required" }, { status: 400 });
                }
                return NextResponse.json({
                    prompt: generateDailyPrompt(dayMasterElement),
                });
                
            case "recommend":
                if (!decisionType) {
                    return NextResponse.json({ error: "decisionType required" }, { status: 400 });
                }
                return NextResponse.json({
                    recommendations: getRecommendedModelForDecision(decisionType),
                });
                
            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Mental Models API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
