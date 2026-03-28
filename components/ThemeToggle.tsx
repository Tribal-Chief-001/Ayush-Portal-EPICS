"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-xl bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 transition-colors group"
            title="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
                {theme === "dark" ? (
                    <span className="material-icons text-amber-400 text-xl block">light_mode</span>
                ) : (
                    <span className="material-icons text-indigo-400 text-xl block">dark_mode</span>
                )}
            </motion.div>
            
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${theme === 'dark' ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
        </button>
    );
}
