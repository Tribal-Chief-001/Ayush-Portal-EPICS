import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    const publicRoutes = ["/", "/login", "/register", "/schemes", "/api/auth", "/api/register", "/api/startups"];
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if (isPublic) {
        // If user is logged in and tries to access login, redirect to dashboard
        if (token && pathname === "/login") {
            const role = token.role as string;
            if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
            if (role === "INVESTOR") return NextResponse.redirect(new URL("/investors", request.url));
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protected routes — redirect to login if not authenticated
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;

    // Admin-only routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Dashboard routes — startups and admins allowed
    if (pathname.startsWith("/dashboard") && role === "INVESTOR") {
        return NextResponse.redirect(new URL("/investors", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/login",
    ],
};
