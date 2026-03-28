import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateApplicationSchema } from "@/lib/validations";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const application = await prisma.application.findUnique({
            where: { applicationId: params.id },
            include: {
                user: { include: { startupProfile: true } },
                documents: true,
                reviewActions: {
                    orderBy: { timestamp: "desc" },
                    include: { admin: { select: { name: true } } },
                },
            },
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error("Application fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = updateApplicationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const { status, comment } = parsed.data;

        // Find application
        const application = await prisma.application.findUnique({
            where: { applicationId: params.id },
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Map status to ReviewActionType
        const actionMap: Record<string, "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "REOPENED"> = {
            APPROVED: "APPROVED",
            REJECTED: "REJECTED",
            CHANGES_REQUESTED: "CHANGES_REQUESTED",
            PENDING: "REOPENED",
        };

        // Update application and create review action
        const updated = await prisma.$transaction(async (tx) => {
            const updatedApp = await tx.application.update({
                where: { applicationId: params.id },
                data: { status: status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED" },
            });

            await tx.reviewAction.create({
                data: {
                    applicationId: application.id,
                    adminId: (session.user as { id?: string }).id!,
                    action: actionMap[status] || "APPROVED",
                    comment: comment || null,
                },
            });

            return updatedApp;
        });

        const statusDisplay: Record<string, string> = {
            PENDING: "Pending Review",
            APPROVED: "Approved",
            CHANGES_REQUESTED: "Changes Requested",
            REJECTED: "Rejected",
        };

        return NextResponse.json({
            success: true,
            applicationId: params.id,
            newStatus: statusDisplay[status] || status,
        });
    } catch (error) {
        console.error("Application update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
