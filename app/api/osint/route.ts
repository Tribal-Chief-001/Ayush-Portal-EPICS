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
        You are an elite OSINT (Open Source Intelligence) AI Agent specializing in startup analysis, particularly in the AYUSH (Ayurveda, Yoga and Naturopathy, Unani, Siddha, and Homeopathy) sector in India.
        
        Analyze the following startup concept based on standard startup metrics, public knowledge patterns, and general industry trends for this specific field:
        Name: ${startupName}
        Sector: ${sector}
        Description: ${description || "An emerging startup in the AYUSH domain."}
        
        Generate a comprehensive intelligence report formatted EXACTLY as a JSON object, with no markdown formatting, no backticks, and no extra text. 
        It MUST be valid JSON parsable by JSON.parse().
        
        Required JSON Structure:
        {
            "projectedGrowth": "+XX.X% YoY",
            "marketSentiment": "XX% Positive",
            "riskScore": "Low" | "Moderate" | "High",
            "founderBackground": "Brief 1-2 sentence background check summary",
            "regulatory": "Brief 1-2 sentence compliance/regulatory status prediction (e.g. GMP certification requirements)",
            "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
            "summary": "A 2-3 sentence executive summary of the startup's viability in the current AYUSH market."
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
