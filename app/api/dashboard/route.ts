import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id?: string }).id!;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                startupProfile: true,
                applications: {
                    include: {
                        documents: true,
                        reviewActions: {
                            orderBy: { timestamp: "desc" },
                            take: 10,
                        },
                    },
                    orderBy: { submittedAt: "desc" },
                    take: 1,
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const latestApp = user.applications[0];

        // Build timeline from actual data
        const timeline = [];
        if (latestApp) {
            timeline.push({
                label: "Registration Submitted",
                date: new Date(latestApp.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                status: "done",
            });

            const hasDocuments = latestApp.documents.length > 0;
            if (hasDocuments) {
                timeline.push({
                    label: "Documents Uploaded",
                    date: new Date(latestApp.documents[0].uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    status: "done",
                });
            } else {
                timeline.push({ label: "Documents Upload", date: "Pending", status: "pending" });
            }

            const statusSteps: Record<string, { label: string; reviewStatus: string; finalStatus: string }> = {
                PENDING: { label: "Under Review", reviewStatus: "pending", finalStatus: "pending" },
                UNDER_REVIEW: { label: "Expert Review", reviewStatus: "current", finalStatus: "pending" },
                APPROVED: { label: "Expert Review", reviewStatus: "done", finalStatus: "done" },
                CHANGES_REQUESTED: { label: "Changes Requested", reviewStatus: "current", finalStatus: "pending" },
                REJECTED: { label: "Application Rejected", reviewStatus: "done", finalStatus: "done" },
            };

            const step = statusSteps[latestApp.status];
            timeline.push({ label: step.label, date: latestApp.status === "UNDER_REVIEW" ? "In Progress" : latestApp.status === "PENDING" ? "Pending" : "Completed", status: step.reviewStatus });
            timeline.push({ label: latestApp.status === "APPROVED" ? "Approved ✓" : "Final Approval", date: latestApp.status === "APPROVED" ? "Approved" : "Pending", status: step.finalStatus });

            // Calculate progress
            const progressMap: Record<string, number> = {
                PENDING: 35,
                UNDER_REVIEW: 65,
                APPROVED: 100,
                CHANGES_REQUESTED: 50,
                REJECTED: 100,
            };

            const statusDisplay: Record<string, string> = {
                PENDING: "Pending Review",
                UNDER_REVIEW: "Under Review",
                APPROVED: "Approved",
                CHANGES_REQUESTED: "Changes Requested",
                REJECTED: "Rejected",
            };

            // Build notifications from review actions
            const notifications = latestApp.reviewActions.map((ra, i) => {
                const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
                    APPROVED: { icon: "check_circle", color: "text-green-600", bg: "bg-green-100" },
                    REJECTED: { icon: "cancel", color: "text-red-600", bg: "bg-red-100" },
                    CHANGES_REQUESTED: { icon: "warning", color: "text-amber-600", bg: "bg-amber-100" },
                    REOPENED: { icon: "refresh", color: "text-blue-600", bg: "bg-blue-100" },
                };
                const icons = iconMap[ra.action] || iconMap.APPROVED;
                const timeDiff = Date.now() - new Date(ra.timestamp).getTime();
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const timeStr = hours < 1 ? "Just now" : hours < 24 ? `${hours} hours ago` : `${Math.floor(hours / 24)} days ago`;

                return {
                    id: i + 1,
                    icon: icons.icon,
                    iconColor: icons.color,
                    iconBg: icons.bg,
                    title: `Application ${ra.action.replace("_", " ").toLowerCase()}`,
                    desc: ra.comment || `Your application status was updated.`,
                    time: timeStr,
                };
            });

            // Always add a default notification if none exist
            if (notifications.length === 0) {
                notifications.push({
                    id: 1,
                    icon: "info",
                    iconColor: "text-blue-600",
                    iconBg: "bg-blue-100",
                    title: "Application Submitted",
                    desc: "Your application has been received and is pending review.",
                    time: "Recently",
                });
            }

            return NextResponse.json({
                user: { name: user.name, email: user.email, role: user.role },
                startup: user.startupProfile,
                application: {
                    id: latestApp.applicationId,
                    status: statusDisplay[latestApp.status],
                    dbStatus: latestApp.status,
                    documentsCount: latestApp.documents.length,
                    submittedAt: latestApp.submittedAt,
                },
                progress: progressMap[latestApp.status] || 35,
                timeline,
                notifications,
                stats: {
                    application: statusDisplay[latestApp.status],
                    documents: `${latestApp.documents.length}/4 Uploaded`,
                    estCompletion: latestApp.status === "APPROVED" ? "Complete" : "5-7 days",
                    certification: latestApp.status === "APPROVED" ? "Granted" : "Pending",
                },
            });
        }

        // No application yet
        return NextResponse.json({
            user: { name: user.name, email: user.email, role: user.role },
            startup: user.startupProfile,
            application: null,
            progress: 0,
            timeline: [],
            notifications: [],
            stats: {
                application: "Not Submitted",
                documents: "0/4 Uploaded",
                estCompletion: "N/A",
                certification: "N/A",
            },
        });
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
