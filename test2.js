const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    console.log("Starting test 2...");
    const genAI = new GoogleGenerativeAI("AIzaSyCiCPiaCDVlscHMVFw2SJuB6BxgAROHH_w");
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const startupName = "Tesla";
    const sector = "Automotive";
    const description = "Electric vehicles and clean energy.";

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
                "projectedGrowth": 25.4,
                "marketSize": "String representation (e.g. $4.5B)",
                "growthTrend": [
                    {"month": "M1", "value": 12}, {"month": "M2", "value": 15}, {"month": "M3", "value": 14}, 
                    {"month": "M4", "value": 18}, {"month": "M5", "value": 22}, {"month": "M6", "value": 25.4}
                ],
                "sentiment": {
                    "score": 78,
                    "positive": 65,
                    "neutral": 20,
                    "negative": 15
                }
            },
            "riskAnalysis": {
                "overall": "Low",
                "radar": [
                    { "category": "Regulatory", "score": 85 },
                    { "category": "Market", "score": 40 },
                    { "category": "Execution", "score": 60 },
                    { "category": "Financial", "score": 30 },
                    { "category": "Technology", "score": 20 }
                ],
                "regulatoryNotes": "Detailed, professional paragraph on compliance hurdles directly related to their sector."
            },
            "founderIntelligence": {
                "background": "Professional breakdown of founder execution capability.",
                "credibilityScore": 92
            },
            "competitors": [
                { "name": "Competitor 1", "threatLevel": "High", "marketShare": 35 },
                { "name": "Competitor 2", "threatLevel": "Medium", "marketShare": 15 },
                { "name": "Competitor 3", "threatLevel": "Low", "marketShare": 5 }
            ]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("RAW OUTPUT:");
        console.log(text);
        
        // Let's try parsing it to see if it breaks
        const parsed = JSON.parse(text);
        console.log("SUCCESSFULLY PARSED JSON!");
        console.log(Object.keys(parsed));
    } catch (err) {
        console.error("FAILED:", err);
    }
}

test();
