"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface Application {
    name: string;
    id: string;
    dbId: string;
    initial: string;
    color: string;
    sector: string;
    sectorColor: string;
    date: string;
    status: string;
    dbStatus: string;
    statusColor: string;
    details: { founder: string; email: string; state: string; desc: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documents: any[];
}

const statusDisplay: Record<string, string> = {
    PENDING: "Pending Review",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    CHANGES_REQUESTED: "Changes Requested",
    REJECTED: "Rejected",
};

type StatusFilter = "All" | "Pending Review" | "Approved" | "Changes Requested" | "Rejected";

export default function AdminPage() {
    const { status: sessionStatus } = useSession();
    const router = useRouter();

    const [applications, setApplications] = useState<Application[]>([]);
    const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, changes: 0, rejected: 0 });
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchApplications = () => {
        fetch("/api/applications")
            .then(res => res.json())
            .then(data => {
                if (data.applications) {
                    setApplications(data.applications);
                    setCounts(data.counts);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (sessionStatus === "authenticated") {
            fetchApplications();
        }
    }, [sessionStatus, router]);

    const updateStatus = async (dbId: string, newDbStatus: string, appId: string) => {
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newDbStatus, comment: `System update to ${statusDisplay[newDbStatus]}` })
            });

            if (!res.ok) throw new Error("Failed to update status");

            showToast(`Application ${appId} → ${statusDisplay[newDbStatus]}`, "success");
            setActionLog((prev) => [`${appId} → ${statusDisplay[newDbStatus]} at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 9)]);
            fetchApplications();
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const filtered = useMemo(() => {
        let result = [...applications];
        if (statusFilter !== "All") result = result.filter((a) => a.status === statusFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q));
        }
        return result;
    }, [applications, statusFilter, searchQuery]);

    if (isLoading || sessionStatus === "loading") {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light font-display">
            {/* Header */}
            <header className="bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 dark:text-slate-100 font-bold text-sm">A</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">AYUSH <span className="text-primary-dark">Admin</span></span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Review Dashboard</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300">Dashboard</Link>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-icons text-primary-dark text-sm">admin_panel_settings</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Applications", value: counts.all, icon: "description", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-50 dark:bg-[#0a0a0a]" },
                        { label: "Pending Review", value: counts.pending, icon: "pending", color: "text-yellow-600", bg: "bg-yellow-50" },
                        { label: "Approved", value: counts.approved, icon: "check_circle", color: "text-green-600", bg: "bg-green-50" },
                        { label: "Rejected", value: counts.rejected, icon: "cancel", color: "text-red-600", bg: "bg-red-50" },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} rounded-xl p-5 border border-slate-100`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`material-icons ${stat.color}`}>{stat.icon}</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-8">
                    {/* Main Panel */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-4 mb-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                {/* Search */}
                                <div className="flex items-center bg-slate-50 dark:bg-[#0a0a0a] rounded-lg border border-slate-200 dark:border-white/10 px-3 flex-1 max-w-sm">
                                    <span className="material-icons text-slate-500 dark:text-slate-400 text-lg">search</span>
                                    <input
                                        type="text" value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search applications..."
                                        className="flex-1 text-sm py-2 px-2 bg-transparent focus:outline-none"
                                    />
                                </div>
                                {/* Status Pills */}
                                <div className="flex gap-2 flex-wrap">
                                    {(["All", "Pending Review", "Approved", "Changes Requested", "Rejected"] as StatusFilter[]).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatusFilter(s)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${statusFilter === s
                                                ? "bg-primary text-slate-900 dark:text-slate-100"
                                                : "bg-slate-100 dark:bg-[#141414] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800"
                                                }`}
                                        >
                                            {s} {s === "All" ? `(${counts.all})` : s === "Pending Review" ? `(${counts.pending})` : s === "Approved" ? `(${counts.approved})` : ""}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Applications Table */}
                        <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-white/5">
                                        <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-5 py-3">Startup</th>
                                        <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-5 py-3 hidden md:table-cell">Sector</th>
                                        <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-5 py-3 hidden sm:table-cell">Date</th>
                                        <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-5 py-3">Status</th>
                                        <th className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-5 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">No applications match your criteria.</td></tr>
                                    )}
                                    {filtered.map((app) => (
                                        <>
                                            <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-lg ${app.color} flex items-center justify-center font-bold text-sm`}>{app.initial}</div>
                                                        <div>
                                                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{app.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{app.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${app.sectorColor}`}>{app.sector}</span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{app.date}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${app.statusColor}`}>{app.status}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {app.dbStatus === "PENDING" && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(app.dbId, "APPROVED", app.id); }} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Approve">
                                                                    <span className="material-icons text-sm">check</span>
                                                                </button>
                                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(app.dbId, "CHANGES_REQUESTED", app.id); }} className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors" title="Request Changes">
                                                                    <span className="material-icons text-sm">edit</span>
                                                                </button>
                                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(app.dbId, "REJECTED", app.id); }} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Reject">
                                                                    <span className="material-icons text-sm">close</span>
                                                                </button>
                                                            </>
                                                        )}
                                                        {app.dbStatus === "APPROVED" && (
                                                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                                <span className="material-icons text-xs">check_circle</span> Done
                                                            </span>
                                                        )}
                                                        {app.dbStatus === "REJECTED" && (
                                                            <button onClick={(e) => { e.stopPropagation(); updateStatus(app.dbId, "PENDING", app.id); }} className="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium">
                                                                Reopen
                                                            </button>
                                                        )}
                                                        {app.dbStatus === "CHANGES_REQUESTED" && (
                                                            <button onClick={(e) => { e.stopPropagation(); updateStatus(app.dbId, "PENDING", app.id); }} className="px-3 py-1 text-xs text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 font-medium">
                                                                Re-review
                                                            </button>
                                                        )}
                                                        <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === app.id ? null : app.id); }} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:bg-[#141414] transition-colors ml-1">
                                                            <span className="material-icons text-sm">{expandedId === app.id ? "expand_less" : "expand_more"}</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === app.id && (
                                                <tr key={`${app.id}-details`}>
                                                    <td colSpan={5} className="bg-slate-50 dark:bg-[#0a0a0a] px-5 py-4 border-b border-slate-200 dark:border-white/5">
                                                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Founder</p>
                                                                <p className="text-slate-700 dark:text-slate-300">{app.details?.founder}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{app.details?.email}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Location</p>
                                                                <p className="text-slate-700 dark:text-slate-300">{app.details?.state}</p>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Documents Uploaded</p>
                                                                {app.documents?.length > 0 ? (
                                                                    app.documents.map((doc, idx) => (
                                                                        <a key={idx} href={doc.filePath} download className="text-primary hover:underline flex items-center gap-1 text-xs">
                                                                            <span className="material-icons text-[14px]">file_download</span> {doc.fileName}
                                                                        </a>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">No documents</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Sidebar — Activity Log */}
                    <aside className="w-72 hidden xl:block">
                        <div className="sticky top-24 bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5 p-5">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <span className="material-icons text-primary-dark text-lg">history</span> Recent Actions
                            </h3>
                            {actionLog.length === 0 ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">No actions yet. Approve or reject an application to see activity here.</p>
                            ) : (
                                <div className="space-y-3">
                                    {actionLog.map((log, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{log}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
                                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase mb-3">Quick Stats</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Approval Rate</span>
                                        <span className="font-bold text-green-600">{counts.all > 0 ? Math.round((counts.approved / counts.all) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-[#141414] rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${counts.all > 0 ? (counts.approved / counts.all) * 100 : 0}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm mt-3">
                                        <span className="text-slate-500 dark:text-slate-400">Pending</span>
                                        <span className="font-bold text-yellow-600">{counts.pending}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
