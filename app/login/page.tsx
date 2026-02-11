"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Role = "startup" | "investor" | "admin";

const roles: { value: Role; label: string; icon: string; desc: string; color: string }[] = [
    { value: "startup", label: "Startup Founder", icon: "rocket_launch", desc: "Register and manage your AYUSH startup", color: "bg-green-50 text-green-700 border-green-200" },
    { value: "investor", label: "Investor", icon: "account_balance", desc: "Discover and invest in AYUSH ventures", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "admin", label: "Administrator", icon: "admin_panel_settings", desc: "Review and manage applications", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

const demoAccounts: Record<Role, { email: string; password: string }> = {
    startup: { email: "vikram@vedalife.com", password: "demo1234" },
    investor: { email: "investor@globalvc.com", password: "demo1234" },
    admin: { email: "admin@ayush.gov.in", password: "admin1234" },
};

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [selectedRole, setSelectedRole] = useState<Role>("startup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDemoFill = (role: Role) => {
        setSelectedRole(role);
        setEmail(demoAccounts[role].email);
        setPassword(demoAccounts[role].password);
        setError("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) { setError("Email is required"); return; }
        if (!password) { setError("Password is required"); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const name = selectedRole === "startup" ? "Vikram Patel" : selectedRole === "investor" ? "Global Ventures" : "AYUSH Admin";

            // Update global auth state
            login({ email, role: selectedRole, name });

            // Show success toast
            showToast(`Welcome back, ${name}!`, "success");

            // Route based on role
            if (selectedRole === "admin") router.push("/admin");
            else if (selectedRole === "investor") router.push("/investors");
            else router.push("/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-background-light to-amber-50 font-display flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-5/12 bg-primary-dark flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-60 h-60 bg-primary rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-slate-900 font-bold text-lg">A</div>
                        <span className="font-bold text-xl text-white">AYUSH Portal</span>
                    </Link>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                        Empowering Traditional Medicine Innovation
                    </h2>
                    <p className="text-green-200 text-lg leading-relaxed">
                        Join over 500+ AYUSH startups building the future of Ayurveda, Yoga, Unani, Siddha, and Homeopathy.
                    </p>
                </div>
                <div className="relative z-10 space-y-4">
                    {[
                        { icon: "verified", text: "Government verified & secure" },
                        { icon: "speed", text: "Fast-track registration process" },
                        { icon: "groups", text: "Connect with 200+ investors" },
                    ].map((item) => (
                        <div key={item.text} className="flex items-center gap-3 text-green-200">
                            <span className="material-icons text-primary text-lg">{item.icon}</span>
                            <span className="text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">A</div>
                            <span className="font-bold text-lg text-slate-900">AYUSH Portal</span>
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
                    <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue.</p>

                    {/* Role Selector */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Login As</label>
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => handleDemoFill(role.value)}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${selectedRole === role.value
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <span className={`material-icons text-xl ${selectedRole === role.value ? "text-primary-dark" : "text-slate-400"}`}>{role.icon}</span>
                                    <p className={`text-xs font-medium mt-1 ${selectedRole === role.value ? "text-primary-dark" : "text-slate-500"}`}>{role.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">email</span>
                                <input
                                    type="email" value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                <input
                                    type={showPassword ? "text" : "password"} value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <span className="material-icons text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
                                <span className="material-icons text-sm">error</span> {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                                <span className="text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-primary-dark font-medium hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${loading
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white shadow-sm shadow-primary/30"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <><span className="material-icons text-lg">login</span> Sign In</>
                            )}
                        </button>
                    </form>

                    {/* Demo hint */}
                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                            <span className="material-icons text-xs">tips_and_updates</span>
                            <strong>Demo Mode:</strong> Click any role above to auto-fill credentials, then sign in.
                        </p>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don&apos;t have an account? <Link href="/register" className="text-primary-dark font-semibold hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
