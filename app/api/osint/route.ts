import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured in environment variables." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { startupName, sector, description } = body;

        if (!startupName) {
            return NextResponse.json({ error: "Startup name is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an elite OSINT (Open Source Intelligence) Data Engineer and Intelligence Analyst specializing in deep-tech and startup viability analysis.
        
        Analyze the following startup concept based on standard metrics, market physics, regulatory frameworks, and general industry trends:
        Name: ${startupName}
        Sector: ${sector}
        Description: ${description || "An emerging startup."}
        
        Generate a comprehensive, mathematically-aligned intelligence report formatted EXACTLY as a JSON object, with NO markdown formatting, no backticks, and no extra text. 
        It MUST be valid JSON parsable by JSON.parse().
        
        Required JSON Structure:
        {
            "executiveSummary": "A highly professional, deep-tech 3-sentence executive summary of the startup's market positioning and disruption potential.",
            "metrics": {
                "projectedGrowth": 25.4, // Float number representing YoY growth %
                "marketSize": "String representation (e.g. $4.5B)",
                "growthTrend": [
                    {"month": "M1", "value": 12}, {"month": "M2", "value": 15}, {"month": "M3", "value": 14}, 
                    {"month": "M4", "value": 18}, {"month": "M5", "value": 22}, {"month": "M6", "value": 25.4}
                ], // Must be exactly 6 objects detailing a 6-month growth capability trend curve
                "sentiment": {
                    "score": 78, // Float 0-100 indicating overall web sentiment
                    "positive": 65, // %
                    "neutral": 20, // %
                    "negative": 15 // %
                }
            },
            "riskAnalysis": {
                "overall": "Low" | "Moderate" | "High" | "Critical",
                "radar": [
                    { "category": "Regulatory", "score": 85 }, // 0 to 100 severity score
                    { "category": "Market", "score": 40 },
                    { "category": "Execution", "score": 60 },
                    { "category": "Financial", "score": 30 },
                    { "category": "Technology", "score": 20 }
                ],
                "regulatoryNotes": "Detailed, professional paragraph on compliance hurdles directly related to their sector."
            },
            "founderIntelligence": {
                "background": "Professional breakdown of founder execution capability.",
                "credibilityScore": 92 // Integer 0-100
            },
            "competitors": [
                { "name": "Competitor 1", "threatLevel": "High", "marketShare": 35 },
                { "name": "Competitor 2", "threatLevel": "Medium", "marketShare": 15 },
                { "name": "Competitor 3", "threatLevel": "Low", "marketShare": 5 }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if the model accidentally includes them
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const parsedData = JSON.parse(cleanedText);

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("OSINT Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate OSINT report. Please check API key and try again." },
            { status: 500 }
        );
    }
}
