"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../context/ToastContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </SessionProvider>
    );
}
