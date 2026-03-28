import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerInvestorSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerInvestorSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    name: data.name,
                    role: "INVESTOR",
                },
            });

            const investorProfile = await tx.investorProfile.create({
                data: {
                    userId: user.id,
                    firmName: data.firmName,
                    investmentRange: data.investmentRange || null,
                    sectorsOfInterest: data.sectorsOfInterest || null,
                    bio: data.bio || null,
                },
            });

            return { user, investorProfile };
        });

        return NextResponse.json({
            success: true,
            userId: result.user.id,
            message: "Investor account created successfully!",
        }, { status: 201 });
    } catch (error) {
        console.error("Investor registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
