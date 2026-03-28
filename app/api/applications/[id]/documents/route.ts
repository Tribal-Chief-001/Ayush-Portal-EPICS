import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as "GST" | "CLINICAL" | "CERTIFICATION" | "OTHER";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const application = await prisma.application.findUnique({
            where: { applicationId: params.id },
            include: { user: true }
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;
        if (application.userId !== user.id && user.role !== "ADMIN") {
             return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads");
        
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const document = await prisma.document.create({
            data: {
                applicationId: application.id,
                type: type || "OTHER",
                fileName: file.name,
                filePath: `/uploads/${fileName}`,
                fileSize: file.size,
            }
        });

        return NextResponse.json({ success: true, document });
    } catch (error) {
        console.error("Document upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
