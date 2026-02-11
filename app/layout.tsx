import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
    title: "AYUSH Portal - Startup Registration Portal",
    description: "The official registration portal for AYUSH startups. Innovate, grow, and scale your Ayurveda, Yoga, Unani, Siddha, or Homeopathy venture with full government support.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-background-light text-slate-800 font-display min-h-screen flex flex-col">
                <Providers>
                    <div className="page-enter">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
