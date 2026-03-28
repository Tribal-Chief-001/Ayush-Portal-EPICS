import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        // Startups can only see their own applications
        if (session?.user && (session.user as { role?: string }).role === "STARTUP") {
            where.userId = (session.user as { id?: string }).id;
        }

        if (status && status !== "All") {
            const statusMap: Record<string, string> = {
                "Pending Review": "PENDING",
                "Approved": "APPROVED",
                "Changes Requested": "CHANGES_REQUESTED",
                "Rejected": "REJECTED",
                "Under Review": "UNDER_REVIEW",
            };
            where.status = statusMap[status] || status;
        }

        if (search) {
            where.OR = [
                { applicationId: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { user: { startupProfile: { startupName: { contains: search, mode: "insensitive" } } } },
                { user: { startupProfile: { ayushSector: { contains: search, mode: "insensitive" } } } },
            ];
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                user: {
                    include: {
                        startupProfile: true,
                    },
                },
                documents: true,
                reviewActions: {
                    orderBy: { timestamp: "desc" },
                    take: 5,
                },
            },
            orderBy: { submittedAt: "desc" },
        });

        // Transform to match frontend format
        const formatted = applications.map((app) => {
            const profile = app.user.startupProfile;
            const statusDisplay: Record<string, string> = {
                PENDING: "Pending Review",
                UNDER_REVIEW: "Under Review",
                APPROVED: "Approved",
                CHANGES_REQUESTED: "Changes Requested",
                REJECTED: "Rejected",
            };
            const statusColors: Record<string, string> = {
                PENDING: "bg-yellow-100 text-yellow-700",
                UNDER_REVIEW: "bg-blue-100 text-blue-700",
                APPROVED: "bg-green-100 text-green-700",
                CHANGES_REQUESTED: "bg-amber-100 text-amber-700",
                REJECTED: "bg-red-100 text-red-700",
            };
            const sectorColors: Record<string, string> = {
                Ayurveda: "bg-green-50 text-green-700",
                Yoga: "bg-teal-50 text-teal-700",
                Unani: "bg-purple-50 text-purple-700",
                Siddha: "bg-orange-50 text-orange-700",
                Homeopathy: "bg-pink-50 text-pink-700",
            };
            const avatarColors: Record<string, string> = {
                Ayurveda: "bg-green-100 text-green-700",
                Yoga: "bg-blue-100 text-blue-700",
                Unani: "bg-purple-100 text-purple-700",
                Siddha: "bg-orange-100 text-orange-700",
                Homeopathy: "bg-pink-100 text-pink-700",
            };

            return {
                name: profile?.startupName || app.user.name,
                id: app.applicationId,
                visibleId: app.applicationId,
                initial: (profile?.startupName || app.user.name).charAt(0).toUpperCase(),
                color: avatarColors[profile?.ayushSector || ""] || "bg-slate-100 dark:bg-[#141414] text-slate-700 dark:text-slate-300",
                sector: profile?.ayushSector || "N/A",
                sectorColor: sectorColors[profile?.ayushSector || ""] || "bg-slate-50 dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300",
                date: new Date(app.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                status: statusDisplay[app.status] || app.status,
                statusColor: statusColors[app.status] || "bg-slate-100 dark:bg-[#141414] text-slate-700 dark:text-slate-300",
                details: {
                    founder: app.user.name,
                    email: app.user.email,
                    state: profile?.state || "N/A",
                    desc: profile?.description || "No description provided",
                },
                documents: app.documents,
                reviewActions: app.reviewActions.map((ra) => ({
                    action: ra.action,
                    comment: ra.comment,
                    timestamp: ra.timestamp,
                })),
                dbId: app.id,
                dbStatus: app.status,
            };
        });

        // Counts
        const counts = {
            all: formatted.length,
            pending: formatted.filter((a) => a.dbStatus === "PENDING").length,
            approved: formatted.filter((a) => a.dbStatus === "APPROVED").length,
            changes: formatted.filter((a) => a.dbStatus === "CHANGES_REQUESTED").length,
            rejected: formatted.filter((a) => a.dbStatus === "REJECTED").length,
        };

        return NextResponse.json({ applications: formatted, counts });
    } catch (error) {
        console.error("Applications fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
