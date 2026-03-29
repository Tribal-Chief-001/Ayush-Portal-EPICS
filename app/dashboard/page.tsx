"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const navLinks = [
    { label: "Overview", icon: "dashboard", active: true },
    { label: "My Application", icon: "description", active: false },
    { label: "Messages", icon: "chat", active: false, badge: 3 },
    { label: "Documents", icon: "folder", active: false },
];

export default function DashboardPage() {
    const { status } = useSession();
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeNav, setActiveNav] = useState("Overview");
    const [animProgress, setAnimProgress] = useState(0);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            fetch("/api/dashboard")
                .then((res) => res.json())
                .then((json) => {
                    setData(json);
                    setIsLoading(false);
                    setTimeout(() => setAnimProgress(json.progress || 0), 300);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [status, router]);

    const dismissNotification = (id: number) => {
        if (!data) return;
        setData({
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            notifications: data.notifications.filter((n: any) => n.id !== id)
        });
    };

    if (isLoading || status === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (!data || !data.user) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">Error loading dashboard</div>;
    }

    const { user, startup, application, timeline, notifications, stats } = data;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] font-display">
            {/* Header */}
            <header className="bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="material-icons text-primary-dark text-2xl">spa</span>
                        <span className="font-bold text-lg text-slate-900 dark:text-slate-100">AYUSH <span className="text-primary-dark">Dashboard</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/dashboard/support" className="p-2 hover:bg-slate-50 dark:bg-[#0a0a0a] rounded-lg relative" title="AI Support">
                            <span className="material-icons text-slate-500 dark:text-slate-400">smart_toy</span>
                        </Link>
                        <button className="p-2 hover:bg-slate-50 dark:bg-[#0a0a0a] rounded-lg relative">
                            <span className="material-icons text-slate-500 dark:text-slate-400">notifications</span>
                            {notifications?.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-dark">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Founder</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Nav */}
                    <aside className="w-56 hidden lg:block">
                        <nav className="sticky top-24 space-y-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => setActiveNav(link.label)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeNav === link.label
                                        ? "bg-primary/10 text-primary-dark font-medium"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0a0a0a]"
                                        }`}
                                >
                                    <span className="material-icons text-lg">{link.icon}</span>
                                    {link.label}
                                    {link.badge && (
                                        <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{link.badge}</span>
                                    )}
                                </button>
                            ))}
                            <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-4">
                                <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0a0a0a]">
                                    <span className="material-icons text-lg">support_agent</span> AI Support
                                </Link>
                                <Link href="/schemes" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0a0a0a]">
                                    <span className="material-icons text-lg">library_books</span> Schemes
                                </Link>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-primary-dark to-green-700 rounded-2xl p-6 sm:p-8 mb-8 text-white">
                            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
                            <p className="text-green-200 text-sm mb-4">
                                {application ? "Your application is currently tracking through our system. Here's your progress." : "You haven't submitted your application yet. Please register your startup to continue."}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${animProgress}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold">{animProgress}%</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: "description", label: "Application", value: stats?.application || "N/A", color: "text-amber-600", bg: "bg-amber-50" },
                                { icon: "folder", label: "Documents", value: stats?.documents || "0", color: "text-blue-600", bg: "bg-blue-50" },
                                { icon: "schedule", label: "Est. Completion", value: stats?.estCompletion || "N/A", color: "text-green-600", bg: "bg-green-50" },
                                { icon: "verified", label: "Certification", value: stats?.certification || "N/A", color: "text-purple-600", bg: "bg-purple-50" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-4 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-shadow">
                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                                        <span className={`material-icons text-lg ${stat.color}`}>{stat.icon}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{stat.label}</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Timeline */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-6">
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                    <span className="material-icons text-primary-dark">timeline</span> Application Timeline
                                </h2>
                                {!application ? (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No application timeline to display.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {timeline?.map((step: any, i: number) => (
                                            <div key={step.label} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.status === "done"
                                                        ? "bg-primary border-primary text-white"
                                                        : step.status === "current"
                                                            ? "border-primary text-primary-dark bg-primary/10 animate-pulse"
                                                            : "border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111111]"
                                                        }`}>
                                                        {step.status === "done" ? (
                                                            <span className="material-icons text-sm">check</span>
                                                        ) : step.status === "current" ? (
                                                            <span className="material-icons text-sm">hourglass_top</span>
                                                        ) : (
                                                            <span className="text-xs font-bold">{i + 1}</span>
                                                        )}
                                                    </div>
                                                    {i < timeline.length - 1 && (
                                                        <div className={`w-0.5 h-8 mt-1 ${step.status === "done" ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"}`}></div>
                                                    )}
                                                </div>
                                                <div className="pt-1">
                                                    <p className={`text-sm font-semibold ${step.status === "pending" ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>{step.label}</p>
                                                    <p className={`text-xs ${step.status === "current" ? "text-primary-dark font-medium" : "text-slate-500 dark:text-slate-400"}`}>{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <span className="material-icons text-primary-dark">notifications</span> Notifications
                                    </h2>
                                    {notifications?.length > 0 && (
                                        <button onClick={() => setData({ ...data, notifications: [] })} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-500 dark:text-slate-400">Clear all</button>
                                    )}
                                </div>
                                {notifications?.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="material-icons text-slate-800 dark:text-slate-200 text-4xl">notifications_none</span>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">All caught up!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {notifications?.map((n: any) => (
                                            <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:bg-[#0a0a0a] transition-colors group">
                                                <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center flex-shrink-0`}>
                                                    <span className={`material-icons text-sm ${n.iconColor}`}>{n.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{n.title}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.desc}</p>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{n.time}</p>
                                                </div>
                                                <button onClick={() => dismissNotification(n.id)} className="opacity-0 group-hover:opacity-100 text-slate-700 dark:text-slate-300 hover:text-slate-500 dark:text-slate-400 transition-opacity">
                                                    <span className="material-icons text-sm">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 grid sm:grid-cols-3 gap-4">
                            {[
                                { icon: "upload_file", label: "Upload Documents", desc: "Add missing certifications", link: "/register", color: "text-blue-600", bg: "bg-blue-50" },
                                { icon: "smart_toy", label: "AI Support", desc: "Get help with your application", link: "/dashboard/support", color: "text-green-600", bg: "bg-green-50" },
                                { icon: "library_books", label: "Browse Schemes", desc: "Find funding opportunities", link: "/schemes", color: "text-purple-600", bg: "bg-purple-50" },
                            ].map((action) => (
                                <Link key={action.label} href={action.link} className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all hover:-translate-y-0.5 group">
                                    <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3`}>
                                        <span className={`material-icons ${action.color}`}>{action.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary-dark">{action.label}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
