import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id?: string }).id!;
        
        // 1. Fetch Investor Context
        const investorProfile = await prisma.investorProfile.findUnique({
            where: { userId }
        });

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId }
        });

        // 2. Fetch Potential Startups (Approved ones)
        const approvedApps = await prisma.application.findMany({
            where: { status: "APPROVED" },
            include: {
                user: {
                    include: { startupProfile: true }
                }
            }
        });

        const allStartups = approvedApps
            .filter(app => app.user.startupProfile)
            .map(app => ({
                id: app.user.startupProfile!.id,
                name: app.user.startupProfile!.startupName,
                sector: app.user.startupProfile!.ayushSector,
                stage: app.user.startupProfile!.stage,
                desc: app.user.startupProfile!.description,
            }));

        // Add showcase startups
        const showcaseStartups = [
            { id: "showcase-tesla", name: "Tesla, Inc.", sector: "Yoga", stage: "Scaling", desc: "Electric vehicles and high-tech wellness." },
            { id: "showcase-patanjali", name: "Patanjali Ayurved", sector: "Ayurveda", stage: "Scaling", desc: "Multinational Ayurveda conglomerate." },
            { id: "showcase-cultfit", name: "Cult.fit", sector: "Yoga", stage: "Scaling", desc: "Digital and offline fitness and well-being." },
        ];

        const candidatePool = [...showcaseStartups, ...allStartups];
        
        // Filter out already bookmarked ones
        const bookmarkedIds = new Set(bookmarks.map(b => b.targetId));
        const filteredCandidates = candidatePool.filter(s => !bookmarkedIds.has(s.id));

        if (filteredCandidates.length === 0) {
            return NextResponse.json({ recommendations: [] });
        }

        // 3. AI Analysis via Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `
        You are an AI Recommendation Engine for the Ministry of AYUSH Startup Portal.
        Your goal is to suggest relevant startups to an investor.
        
        Investor Profile:
        - Interests: ${investorProfile?.sectorsOfInterest || "General AYUSH Interest"}
        - Bio: ${investorProfile?.bio || "N/A"}
        - Previously Bookmarked Startups (Target IDs): ${Array.from(bookmarkedIds).join(", ") || "None"}
        
        Candidate Startups:
        ${JSON.stringify(filteredCandidates.slice(0, 20))}
        
        Select the top 3 startups from the candidate pool that best match the investor's interests and behavior.
        For each selection, provide a brief "AI Reason" (1 sentence) explaining why it was chosen.
        
        Respond ONLY with a JSON array of objects:
        [
          { "id": "startup-id", "reason": "Reasoning here..." },
          ...
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const recData = JSON.parse(cleanedText);

        // Map back to full startup objects
        const recommendations = recData.map((rec: any) => {
            const startup = candidatePool.find(s => s.id === rec.id);
            return { ...startup, aiReason: rec.reason };
        }).filter(Boolean);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error("Recommendations API error:", error);
        return NextResponse.json({ recommendations: [] });
    }
}
