import { NextRequest, NextResponse } from "next/server";
import { generateMvpReport } from "@/lib/interpretation/generate";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { birthIsoUtc, gender, tzOffsetMinutes, dayStartHourLocal } = body;

        if (!birthIsoUtc || !gender) {
            return NextResponse.json({ error: "Missing birthIsoUtc or gender" }, { status: 400 });
        }

        const report = generateMvpReport({
            birthUtc: birthIsoUtc,
            gender,
            tzOffsetMinutes: tzOffsetMinutes ?? 480,
            dayStartHourLocal: dayStartHourLocal ?? 23,
        });

        return NextResponse.json(report);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
