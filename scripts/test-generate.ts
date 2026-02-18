import { generateMvpReport } from "../lib/interpretation/generate";

try {
    const report = generateMvpReport({
        birthUtc: "1990-05-19T10:30:00.000Z",
        gender: "male",
        tzOffsetMinutes: 480,
        dayStartHourLocal: 23,
    });
    console.log("Report generated successfully!");
    console.log("Header:", report.bazi.pillars.year.zh);
} catch (e) {
    console.error("Crash during report generation:");
    console.error(e);
}
