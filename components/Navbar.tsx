"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "";

    const dashboardLink = user?.role === "admin" ? "/admin" : user?.role === "investor" ? "/investors" : "/dashboard";

    return (
        <nav className="sticky top-0 z-50 w-full bg-surface-light/90 backdrop-blur-md border-b border-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <span className="material-icons text-primary-dark text-3xl">spa</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">AYUSH Portal</span>
                            <span className="text-xs text-slate-500 font-medium tracking-wide">Ministry of Ayush, Gov. of India</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-slate-700 hover:text-primary-dark transition-colors">Home</Link>
                        <Link href="/schemes" className="text-sm font-medium text-slate-700 hover:text-primary-dark transition-colors">Schemes</Link>
                        <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-primary-dark transition-colors">Startups</Link>
                        <Link href="/investors" className="text-sm font-medium text-slate-700 hover:text-primary-dark transition-colors">Investors</Link>
                    </div>

                    {/* Auth Area */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-dark">{initials}</span>
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <p className="text-sm font-medium text-slate-900 leading-tight">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                                    </div>
                                    <span className="material-icons text-slate-400 text-lg">{profileOpen ? "expand_less" : "expand_more"}</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                        <Link
                                            href={dashboardLink}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="material-icons text-lg text-slate-400">dashboard</span>
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/schemes"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="material-icons text-lg text-slate-400">library_books</span>
                                            Schemes
                                        </Link>
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <button
                                                onClick={() => { setProfileOpen(false); logout(); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <span className="material-icons text-lg">logout</span>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary-dark px-3 py-2">Login</Link>
                                <Link href="/register" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-slate-900 bg-primary hover:bg-primary-dark hover:text-white transition-all shadow-sm shadow-primary/30">
                                    Register Startup
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-700 focus:outline-none">
                            <span className="material-icons">{mobileMenuOpen ? "close" : "menu"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-primary-dark py-2">Home</Link>
                    <Link href="/schemes" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-primary-dark py-2">Schemes</Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-primary-dark py-2">Startups</Link>
                    <Link href="/investors" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-primary-dark py-2">Investors</Link>
                    <hr className="border-slate-100" />
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary-dark">{initials}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                                </div>
                            </div>
                            <Link href={dashboardLink} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Dashboard</Link>
                            <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="block w-full text-left text-sm font-medium text-red-600 py-2">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Login</Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-5 py-2.5 text-sm font-medium rounded-lg text-slate-900 bg-primary hover:bg-primary-dark hover:text-white transition-all">
                                Register Startup
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
