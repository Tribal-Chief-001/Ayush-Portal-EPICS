"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
    { label: "Overview", icon: "dashboard", active: true },
    { label: "My Application", icon: "description", active: false },
    { label: "Messages", icon: "chat", active: false, badge: 3 },
    { label: "Documents", icon: "folder", active: false },
];

const timelineSteps = [
    { label: "Registration Submitted", date: "Oct 15, 2024", status: "done" },
    { label: "Documents Verified", date: "Oct 18, 2024", status: "done" },
    { label: "Expert Review", date: "In Progress", status: "current" },
    { label: "Final Approval", date: "Pending", status: "pending" },
];

interface Notification {
    id: number;
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    desc: string;
    time: string;
}

const initialNotifications: Notification[] = [
    { id: 1, icon: "check_circle", iconColor: "text-green-600", iconBg: "bg-green-100", title: "Document Verified", desc: "GST Certificate has been verified.", time: "2 hours ago" },
    { id: 2, icon: "info", iconColor: "text-blue-600", iconBg: "bg-blue-100", title: "Application Update", desc: "Your application moved to Expert Review stage.", time: "1 day ago" },
    { id: 3, icon: "warning", iconColor: "text-amber-600", iconBg: "bg-amber-100", title: "Action Required", desc: "Please upload updated product certification.", time: "3 days ago" },
];

export default function DashboardPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [progress, setProgress] = useState(0);
    const [activeNav, setActiveNav] = useState("Overview");

    // Animate progress bar on mount
    useEffect(() => {
        const timer = setTimeout(() => setProgress(65), 300);
        return () => clearTimeout(timer);
    }, []);

    const dismissNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-background-light font-display">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="material-icons text-primary-dark text-2xl">spa</span>
                        <span className="font-bold text-lg text-slate-900">AYUSH <span className="text-primary-dark">Dashboard</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/support" className="p-2 hover:bg-slate-50 rounded-lg relative" title="AI Support">
                            <span className="material-icons text-slate-400">smart_toy</span>
                        </Link>
                        <button className="p-2 hover:bg-slate-50 rounded-lg relative">
                            <span className="material-icons text-slate-400">notifications</span>
                            {notifications.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-dark">VP</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-slate-900">Vikram Patel</p>
                                <p className="text-[10px] text-slate-400">Founder</p>
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
                                        : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <span className="material-icons text-lg">{link.icon}</span>
                                    {link.label}
                                    {link.badge && (
                                        <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{link.badge}</span>
                                    )}
                                </button>
                            ))}
                            <div className="pt-4 border-t border-slate-200 mt-4">
                                <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                                    <span className="material-icons text-lg">support_agent</span> AI Support
                                </Link>
                                <Link href="/schemes" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                                    <span className="material-icons text-lg">library_books</span> Schemes
                                </Link>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-primary-dark to-green-700 rounded-2xl p-6 sm:p-8 mb-8 text-white">
                            <h1 className="text-2xl font-bold mb-2">Welcome back, Vikram! 👋</h1>
                            <p className="text-green-200 text-sm mb-4">Your application is currently under expert review. Here&apos;s your progress.</p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold">{progress}%</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: "description", label: "Application", value: "Under Review", color: "text-amber-600", bg: "bg-amber-50" },
                                { icon: "folder", label: "Documents", value: "3/4 Uploaded", color: "text-blue-600", bg: "bg-blue-50" },
                                { icon: "schedule", label: "Est. Completion", value: "Oct 28", color: "text-green-600", bg: "bg-green-50" },
                                { icon: "verified", label: "Certification", value: "Pending", color: "text-purple-600", bg: "bg-purple-50" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                                        <span className={`material-icons text-lg ${stat.color}`}>{stat.icon}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{stat.label}</p>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Timeline */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
                                <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="material-icons text-primary-dark">timeline</span> Application Timeline
                                </h2>
                                <div className="space-y-6">
                                    {timelineSteps.map((step, i) => (
                                        <div key={step.label} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.status === "done"
                                                    ? "bg-primary border-primary text-white"
                                                    : step.status === "current"
                                                        ? "border-primary text-primary-dark bg-primary/10 animate-pulse"
                                                        : "border-slate-200 text-slate-300 bg-white"
                                                    }`}>
                                                    {step.status === "done" ? (
                                                        <span className="material-icons text-sm">check</span>
                                                    ) : step.status === "current" ? (
                                                        <span className="material-icons text-sm">hourglass_top</span>
                                                    ) : (
                                                        <span className="text-xs font-bold">{i + 1}</span>
                                                    )}
                                                </div>
                                                {i < timelineSteps.length - 1 && (
                                                    <div className={`w-0.5 h-8 mt-1 ${step.status === "done" ? "bg-primary" : "bg-slate-200"}`}></div>
                                                )}
                                            </div>
                                            <div className="pt-1">
                                                <p className={`text-sm font-semibold ${step.status === "pending" ? "text-slate-400" : "text-slate-900"}`}>{step.label}</p>
                                                <p className={`text-xs ${step.status === "current" ? "text-primary-dark font-medium" : "text-slate-400"}`}>{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white rounded-xl border border-slate-100 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="material-icons text-primary-dark">notifications</span> Notifications
                                    </h2>
                                    {notifications.length > 0 && (
                                        <button onClick={() => setNotifications([])} className="text-xs text-slate-400 hover:text-slate-600">Clear all</button>
                                    )}
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="material-icons text-slate-200 text-4xl">notifications_none</span>
                                        <p className="text-sm text-slate-400 mt-2">All caught up!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.map((n) => (
                                            <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center flex-shrink-0`}>
                                                    <span className={`material-icons text-sm ${n.iconColor}`}>{n.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                                                    <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                                                </div>
                                                <button onClick={() => dismissNotification(n.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-opacity">
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
                                <Link key={action.label} href={action.link} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                                    <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3`}>
                                        <span className={`material-icons ${action.color}`}>{action.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-primary-dark">{action.label}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
