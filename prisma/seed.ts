import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await prisma.bookmark.deleteMany();
    await prisma.reviewAction.deleteMany();
    await prisma.document.deleteMany();
    await prisma.application.deleteMany();
    await prisma.investorProfile.deleteMany();
    await prisma.startupProfile.deleteMany();
    await prisma.user.deleteMany();

    const hash = (password: string) => bcrypt.hashSync(password, 12);

    // ─── ADMIN ──────────────────────────────────────
    const admin = await prisma.user.create({
        data: {
            email: "admin@ayush.gov.in",
            passwordHash: hash("admin1234"),
            name: "AYUSH Admin",
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user created");

    // ─── STARTUP USERS ──────────────────────────────
    const startup1 = await prisma.user.create({
        data: {
            email: "vikram@vedalife.com",
            passwordHash: hash("demo1234"),
            name: "Vikram Patel",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "VedaLife Organics",
                    ayushSector: "Ayurveda",
                    dippNumber: "DIPP12345",
                    incorporationDate: "2023-03-15",
                    description: "AI-driven supply chain platform connecting authentic medicinal herb farmers directly with pharmaceutical manufacturers, ensuring quality and traceability.",
                    website: "https://vedalife.com",
                    teamSize: "6-20",
                    state: "Karnataka",
                    city: "Bangalore",
                    phone: "9876543210",
                    fundingAsk: "250",
                    revenue: "₹85 L",
                    stage: "Early Traction",
                },
            },
        },
    });

    const startup2 = await prisma.user.create({
        data: {
            email: "priya@yogitech.in",
            passwordHash: hash("demo1234"),
            name: "Priya Sharma",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "YogiTech Solutions",
                    ayushSector: "Yoga",
                    dippNumber: "DIPP22345",
                    incorporationDate: "2022-08-10",
                    description: "Virtual reality yoga studio platform with real-time posture correction using computer vision and personalized session recommendations.",
                    website: "https://yogitech.in",
                    teamSize: "21-50",
                    state: "Uttarakhand",
                    city: "Rishikesh",
                    phone: "9876543211",
                    fundingAsk: "500",
                    revenue: "₹1.2 Cr",
                    stage: "Scaling",
                },
            },
        },
    });

    const startup3 = await prisma.user.create({
        data: {
            email: "faiz@unicure.in",
            passwordHash: hash("demo1234"),
            name: "Faiz Khan",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "UnaniCure Labs",
                    ayushSector: "Unani",
                    incorporationDate: "2024-01-20",
                    description: "Modernizing traditional Unani formulations with nano-technology for better absorption and efficacy. Currently in clinical trials phase 2.",
                    teamSize: "6-20",
                    state: "Telangana",
                    city: "Hyderabad",
                    phone: "9876543212",
                    fundingAsk: "150",
                    revenue: "Pre-Rev",
                    stage: "Validation",
                },
            },
        },
    });

    const startup4 = await prisma.user.create({
        data: {
            email: "arun@mindsiddha.com",
            passwordHash: hash("demo1234"),
            name: "Arun Kumar",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "MindSiddha",
                    ayushSector: "Siddha",
                    incorporationDate: "2023-06-05",
                    description: "Integrating Siddha Varmam therapy with wearable sensors to treat chronic pain and stress disorders through data-driven precision.",
                    teamSize: "1-5",
                    state: "Tamil Nadu",
                    city: "Chennai",
                    phone: "9876543213",
                    fundingAsk: "80",
                    revenue: "₹30 L",
                    stage: "Early Traction",
                },
            },
        },
    });

    const startup5 = await prisma.user.create({
        data: {
            email: "neha@homeoglow.com",
            passwordHash: hash("demo1234"),
            name: "Neha Gupta",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "HomeoGlow",
                    ayushSector: "Homeopathy",
                    incorporationDate: "2024-02-14",
                    description: "Personalized homeopathic skincare regimens formulated using AI analysis of user skin types and lifestyle data.",
                    teamSize: "1-5",
                    state: "Maharashtra",
                    city: "Mumbai",
                    phone: "9876543214",
                    fundingAsk: "75",
                    revenue: "₹15 L",
                    stage: "Seed",
                },
            },
        },
    });

    const startup6 = await prisma.user.create({
        data: {
            email: "rajesh@bioayur.in",
            passwordHash: hash("demo1234"),
            name: "Rajesh Mehta",
            role: "STARTUP",
            startupProfile: {
                create: {
                    startupName: "BioAyur Tech",
                    ayushSector: "Ayurveda",
                    dippNumber: "DIPP87654",
                    incorporationDate: "2021-11-01",
                    description: "Extraction and stabilization of active compounds from rare Ayurvedic herbs for export to global nutraceutical markets.",
                    website: "https://bioayur.in",
                    teamSize: "21-50",
                    state: "Maharashtra",
                    city: "Pune",
                    phone: "9876543215",
                    fundingAsk: "1200",
                    revenue: "₹4.5 Cr",
                    stage: "Scaling",
                },
            },
        },
    });

    console.log("✅ 6 startup users created");

    // ─── INVESTOR ───────────────────────────────────
    const investor = await prisma.user.create({
        data: {
            email: "investor@globalvc.com",
            passwordHash: hash("demo1234"),
            name: "Global Ventures",
            role: "INVESTOR",
            investorProfile: {
                create: {
                    firmName: "Global Ventures Capital",
                    investmentRange: "₹50L - ₹5Cr",
                    sectorsOfInterest: "Ayurveda,Yoga,Homeopathy",
                    bio: "We invest in innovative AYUSH startups at Series A and beyond.",
                },
            },
        },
    });
    console.log("✅ Investor user created");

    // ─── APPLICATIONS ───────────────────────────────
    const app1 = await prisma.application.create({
        data: {
            userId: startup1.id,
            applicationId: "AY-2024-001",
            status: "UNDER_REVIEW",
        },
    });

    const app2 = await prisma.application.create({
        data: {
            userId: startup2.id,
            applicationId: "AY-2024-002",
            status: "PENDING",
        },
    });

    const app3 = await prisma.application.create({
        data: {
            userId: startup3.id,
            applicationId: "AY-2024-003",
            status: "APPROVED",
        },
    });

    const app4 = await prisma.application.create({
        data: {
            userId: startup4.id,
            applicationId: "AY-2024-004",
            status: "CHANGES_REQUESTED",
        },
    });

    const app5 = await prisma.application.create({
        data: {
            userId: startup5.id,
            applicationId: "AY-2024-005",
            status: "PENDING",
        },
    });

    const app6 = await prisma.application.create({
        data: {
            userId: startup6.id,
            applicationId: "AY-2024-006",
            status: "REJECTED",
        },
    });

    console.log("✅ 6 applications created");

    // ─── REVIEW ACTIONS ─────────────────────────────
    await prisma.reviewAction.createMany({
        data: [
            { applicationId: app1.id, adminId: admin.id, action: "REOPENED", comment: "Documents verified, moving to expert review." },
            { applicationId: app3.id, adminId: admin.id, action: "APPROVED", comment: "All criteria met. Welcome to the AYUSH ecosystem!" },
            { applicationId: app4.id, adminId: admin.id, action: "CHANGES_REQUESTED", comment: "Please update your clinical trial documentation." },
            { applicationId: app6.id, adminId: admin.id, action: "REJECTED", comment: "Insufficient documentation provided. Please resubmit." },
        ],
    });
    console.log("✅ Review actions created");

    // ─── DOCUMENTS ──────────────────────────────────
    await prisma.document.createMany({
        data: [
            { applicationId: app1.id, type: "GST", fileName: "gst_certificate.pdf", filePath: "/uploads/gst_certificate.pdf", fileSize: 245000 },
            { applicationId: app1.id, type: "CERTIFICATION", fileName: "ayush_cert.pdf", filePath: "/uploads/ayush_cert.pdf", fileSize: 180000 },
            { applicationId: app3.id, type: "GST", fileName: "gst_unicure.pdf", filePath: "/uploads/gst_unicure.pdf", fileSize: 320000 },
            { applicationId: app3.id, type: "CLINICAL", fileName: "clinical_trial_phase2.pdf", filePath: "/uploads/clinical_trial.pdf", fileSize: 1500000 },
        ],
    });
    console.log("✅ Documents created");

    console.log("\n🎉 Seed complete! Demo accounts:");
    console.log("   Startup:  vikram@vedalife.com / demo1234");
    console.log("   Investor: investor@globalvc.com / demo1234");
    console.log("   Admin:    admin@ayush.gov.in / admin1234");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
