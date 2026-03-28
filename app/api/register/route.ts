import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerStartupSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerStartupSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 12);

        // Generate application ID
        const appId = `AY-2024-${String(Math.floor(1000 + Math.random() * 9000))}`;

        // Create user + startup profile + application in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    name: data.founderName,
                    role: "STARTUP",
                },
            });

            const startupProfile = await tx.startupProfile.create({
                data: {
                    userId: user.id,
                    startupName: data.startupName,
                    ayushSector: data.ayushSector,
                    dippNumber: data.dippNumber || null,
                    incorporationDate: data.incorporationDate || null,
                    description: data.description,
                    website: data.website || null,
                    teamSize: data.teamSize || null,
                    state: data.state,
                    city: data.city || null,
                    phone: data.phone,
                },
            });

            const application = await tx.application.create({
                data: {
                    userId: user.id,
                    applicationId: appId,
                    status: "PENDING",
                },
            });

            return { user, startupProfile, application };
        });

        return NextResponse.json({
            success: true,
            applicationId: result.application.applicationId,
            userId: result.user.id,
            message: "Registration submitted successfully!",
        }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
