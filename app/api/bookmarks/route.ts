import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ bookmarks: [] });
        }

        const userId = (session.user as { id?: string }).id!;
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
        });

        return NextResponse.json({ bookmarks });
    } catch (error) {
        console.error("Bookmarks fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id?: string }).id!;
        const { targetId, targetType } = await req.json();

        // Toggle: if exists, delete; if not, create
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_targetId_targetType: { userId, targetId, targetType },
            },
        });

        if (existing) {
            await prisma.bookmark.delete({ where: { id: existing.id } });
            return NextResponse.json({ bookmarked: false });
        } else {
            await prisma.bookmark.create({
                data: { userId, targetId, targetType },
            });
            return NextResponse.json({ bookmarked: true });
        }
    } catch (error) {
        console.error("Bookmark toggle error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
