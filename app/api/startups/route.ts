import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const sectors = searchParams.get("sectors")?.split(",").filter(Boolean) || [];
        const stages = searchParams.get("stages")?.split(",").filter(Boolean) || [];
        const sortBy = searchParams.get("sort") || "recommended";

        // Get all approved startups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {
            status: "APPROVED",
        };

        const applications = await prisma.application.findMany({
            where,
            include: {
                user: {
                    include: {
                        startupProfile: true,
                    },
                },
            },
            orderBy: { submittedAt: "desc" },
        });

        let startups = applications
            .filter((app) => app.user.startupProfile)
            .map((app) => {
                const profile = app.user.startupProfile!;
                const sectorColors: Record<string, string> = {
                    Ayurveda: "bg-green-100 text-green-700",
                    Yoga: "bg-blue-100 text-blue-700",
                    "Yoga & Naturopathy": "bg-teal-100 text-teal-700",
                    Unani: "bg-purple-100 text-purple-700",
                    Siddha: "bg-orange-100 text-orange-700",
                    Homeopathy: "bg-pink-100 text-pink-700",
                };

                const stageColors: Record<string, string> = {
                    Seed: "bg-emerald-100 text-emerald-700",
                    Validation: "bg-indigo-100 text-indigo-700",
                    "Early Traction": "bg-amber-100 text-amber-700",
                    Scaling: "bg-blue-100 text-blue-700",
                };

                const stage = profile.stage || "Early Traction";
                const tags = [profile.ayushSector, stage];
                const tagColors = [
                    sectorColors[profile.ayushSector] || "bg-slate-100 dark:bg-[#141414] text-slate-500 dark:text-slate-400",
                    stageColors[stage] || "bg-slate-100 dark:bg-[#141414] text-slate-500 dark:text-slate-400",
                ];

                return {
                    id: profile.id,
                    name: profile.startupName,
                    location: `${profile.city || ""}, ${profile.state}`.replace(/^, /, ""),
                    sector: profile.ayushSector,
                    stage,
                    tags,
                    tagColors,
                    desc: profile.description,
                    ask: profile.fundingAsk || "Undisclosed",
                    askNum: parseInt(profile.fundingAsk || "0") || 0,
                    revenue: profile.revenue || "Pre-Revenue",
                    initial: profile.startupName.charAt(0).toUpperCase(),
                    color: sectorColors[profile.ayushSector] || "bg-slate-100 dark:bg-[#141414] text-slate-700 dark:text-slate-300",
                    featured: false,
                    founderName: app.user.name,
                    founderEmail: app.user.email,
                };
            });

        // Apply filters
        if (search) {
            const q = search.toLowerCase();
            startups = startups.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.desc.toLowerCase().includes(q) ||
                    s.sector.toLowerCase().includes(q)
            );
        }
        if (sectors.length > 0) {
            startups = startups.filter((s) => sectors.includes(s.sector));
        }
        if (stages.length > 0) {
            startups = startups.filter((s) => stages.includes(s.stage));
        }

        // Sort
        if (sortBy === "ask_asc") startups.sort((a, b) => a.askNum - b.askNum);
        if (sortBy === "ask_desc") startups.sort((a, b) => b.askNum - a.askNum);

        // Mark first one as featured
        if (startups.length > 0) startups[0].featured = true;

        // Inject high-profile showcase startups for the presentation
        const showcaseStartups = [
            {
                id: "showcase-tesla",
                name: "Tesla, Inc.",
                sector: "Yoga",
                desc: "Designing and manufacturing electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles. Now entering the high-tech wellness space.",
                location: "Austin, Texas",
                stage: "Scaling",
                tags: ["Yoga", "Scaling"],
                tagColors: ["bg-blue-100 text-blue-700", "bg-blue-100 text-blue-700"],
                ask: "Undisclosed",
                askNum: 0,
                revenue: "High",
                initial: "T",
                color: "bg-blue-100 text-blue-700",
                featured: false,
                founderName: "Elon Musk",
                founderEmail: "elon@tesla.com"
            },
            {
                id: "showcase-patanjali",
                name: "Patanjali Ayurved",
                sector: "Ayurveda",
                desc: "An Indian multinational conglomerate holding company. It manufactures cosmetics, ayurvedic medicine, and food products.",
                location: "Haridwar, Uttarakhand",
                stage: "Scaling",
                tags: ["Ayurveda", "Scaling"],
                tagColors: ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700"],
                ask: "Undisclosed",
                askNum: 0,
                revenue: "High",
                initial: "P",
                color: "bg-green-100 text-green-700",
                featured: false,
                founderName: "Acharya Balkrishna",
                founderEmail: "info@patanjaliayurved.net"
            },
            {
                id: "showcase-cultfit",
                name: "Cult.fit (Cure.fit)",
                sector: "Yoga",
                desc: "A health and fitness company offering digital and offline experiences across fitness, nutrition, and mental well-being.",
                location: "Bengaluru, Karnataka",
                stage: "Scaling",
                tags: ["Yoga", "Scaling"],
                tagColors: ["bg-blue-100 text-blue-700", "bg-blue-100 text-blue-700"],
                ask: "Undisclosed",
                askNum: 0,
                revenue: "High",
                initial: "C",
                color: "bg-blue-100 text-blue-700",
                featured: false,
                founderName: "Mukesh Bansal",
                founderEmail: "support@cult.fit"
            }
        ];

        return NextResponse.json({ startups: [...showcaseStartups, ...startups] });
    } catch (error) {
        console.error("Startups fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
