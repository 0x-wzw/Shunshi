import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

/**
 * POST /api/shunshi
 * Run the full four-stage Shunshi decision flow.
 *
 * Body: {
 *   birthYear: number,        // Gregorian year
 *   birthMonth: number,       // 1-12
 *   birthDay: number,         // 1-31
 *   birthHour?: number,       // 0-23, default 12
 *   gender?: "male" | "female",
 *   question?: string         // The decision question
 * }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            birthYear,
            birthMonth,
            birthDay,
            birthHour = 12,
            gender = "male",
            question = "",
        } = body;

        if (!birthYear || !birthMonth || !birthDay) {
            return NextResponse.json(
                { success: false, error: "birthYear, birthMonth, and birthDay are required" },
                { status: 400 }
            );
        }

        const engineDir = path.join(process.cwd(), "engine");

        // Escape the question for shell safety
        const safeQuestion = question.replace(/"/g, '\\"');

        const cmd = [
            "python3",
            "-m", "celestial_computations",
            "shunshi",
            String(birthYear),
            String(birthMonth),
            String(birthDay),
            String(birthHour),
            gender,
            `"${safeQuestion}"`,
        ].join(" ");

        const stdout = execSync(cmd, {
            cwd: engineDir,
            timeout: 10000,
            encoding: "utf-8",
            env: { ...process.env, PYTHONPATH: engineDir },
        });

        const result = JSON.parse(stdout);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("Shunshi API error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/shunshi/hexagram
 * Generate a coin-toss hexagram reading (no birth info needed).
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action") || "hexagram";

        if (action !== "hexagram") {
            return NextResponse.json(
                { success: false, error: "Use action=hexagram for coin-toss reading" },
                { status: 400 }
            );
        }

        const engineDir = path.join(process.cwd(), "engine");

        // Generate hexagram via Python
        const pythonCode = `
import json
from celestial_computations.shunshi import toss_hexagram
reading = toss_hexagram()
orig = reading['original']
chg = reading.get('changed')
result = {
    '本卦': orig.to_dict(),
    '变卦': chg.to_dict() if chg else None,
    '变爻': reading['changing_positions'],
    '爻象': reading['lines'],
    '变爻数量': reading['moving_line_count'],
}
print(json.dumps(result, ensure_ascii=False))
        `.trim();

        const stdout = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\\''")}'`, {
            cwd: engineDir,
            timeout: 10000,
            encoding: "utf-8",
            env: { ...process.env, PYTHONPATH: engineDir },
        });

        const result = JSON.parse(stdout);
        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("Shunshi hexagram error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
