import { z } from "zod";

export const registerStartupSchema = z.object({
    // Founder info
    founderName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // Business details
    startupName: z.string().min(1, "Startup name is required"),
    ayushSector: z.string().min(1, "Select an AYUSH sector"),
    dippNumber: z.string().optional(),
    incorporationDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    website: z.string().optional(),
    teamSize: z.string().optional(),
    state: z.string().min(1, "State is required"),
    city: z.string().optional(),
});

export const registerInvestorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firmName: z.string().min(1, "Firm name is required"),
    investmentRange: z.string().optional(),
    sectorsOfInterest: z.string().optional(),
    bio: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const updateApplicationSchema = z.object({
    status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "CHANGES_REQUESTED", "REJECTED"]),
    comment: z.string().optional(),
});
