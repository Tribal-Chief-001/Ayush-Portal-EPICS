"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
    name: string;
    email: string;
    role: "startup" | "investor" | "admin";
    loggedInAt: number;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: User["role"], name: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Restore session on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("ayush_user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            // ignore
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: User["role"], name: string) => {
        const newUser: User = { email, role, name, loggedInAt: Date.now() };
        setUser(newUser);
        localStorage.setItem("ayush_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ayush_user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
