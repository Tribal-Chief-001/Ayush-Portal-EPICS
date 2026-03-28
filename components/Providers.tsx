"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "../context/ToastContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
