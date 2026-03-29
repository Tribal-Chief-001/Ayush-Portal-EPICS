"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import { Activity, ShieldAlert, Target, TrendingUp, Users, Cpu, FileWarning, Globe, PieChart as PieIcon, LineChart } from "lucide-react";

interface Startup {
    id: string;
    name: string;
    location: string;
    sector: string;
    stage: string;
    tags: string[];
    tagColors: string[];
    desc: string;
    ask: string;
    askNum: number;
    revenue: string;
    initial: string;
    color: string;
    featured: boolean;
    founderName: string;
    founderEmail: string;
}

const sectorOptions = ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"];
const stageOptions = ["Seed", "Validation", "Early Traction", "Scaling"];

export default function InvestorsPage() {
    const { status } = useSession();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set());
    const [selectedStages, setSelectedStages] = useState<Set<string>>(new Set());
    
    // We store bookmark IDs (startup IDs)
    const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState("recommended");

    // OSINT State
    const [osintModalOpen, setOsintModalOpen] = useState(false);
    const [osintStartup, setOsintStartup] = useState<Startup | null>(null);
    const [osintLoading, setOsintLoading] = useState(false);
    const [osintLogs, setOsintLogs] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [osintResult, setOsintResult] = useState<any>(null);

    const fetchStartups = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (selectedSectors.size > 0) params.append("sectors", Array.from(selectedSectors).join(","));
            if (selectedStages.size > 0) params.append("stages", Array.from(selectedStages).join(","));
            if (sortBy) params.append("sort", sortBy);

            const res = await fetch(`/api/startups?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setStartups(data.startups || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedSectors, selectedStages, sortBy]);

    const fetchBookmarks = async () => {
        if (status !== "authenticated") return;
        try {
            const res = await fetch("/api/bookmarks");
            if (res.ok) {
                const data = await res.json();
                // Assuming data.bookmarks is array of targetIds
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ids = new Set<string>(data.bookmarks?.map((b: any) => b.targetId) || []);
                setBookmarked(ids);
            }
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error);
        }
    };

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    useEffect(() => {
        fetchBookmarks();
    }, [status]);

    const toggleBookmark = async (id: string) => {
        if (status !== "authenticated") return alert("Please login to bookmark startups.");
        
        const isBookmarked = bookmarked.has(id);
        
        // Optimistic update
        const next = new Set(bookmarked);
        if (isBookmarked) next.delete(id);
        else next.add(id);
        setBookmarked(next);

        try {
            const res = await fetch("/api/bookmarks", {
                method: isBookmarked ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: id, targetType: "STARTUP" })
            });
            if (!res.ok) throw new Error("Failed to toggle bookmark");
        } catch (error) {
            console.error(error);
            // Revert on error
            setBookmarked(bookmarked);
        }
    };

    const runOSINT = async (startup: Startup) => {
        setOsintStartup(startup);
        setOsintModalOpen(true);
        setOsintResult(null);
        setOsintLoading(true);
        setOsintLogs(["[0.0s] Booting OSINT Agent..."]);

        // Simulated terminal logs
        const logs = [
            `> INITIALIZING NEURAL SCRAPER [V0.4.2]...`,
            `> TARGET LOCK INITIATED: ${startup.name.toUpperCase()}`,
            `> EXTRACTING GLOBAL KINETICS FOR ${startup.sector.toUpperCase()} VECTOR...`,
            `> [23.4%] INGESTING REGULATORY HEURISTICS...`,
            `> [55.1%] EXECUTING COMPETITIVE THREAT ANALYSIS MATRIX...`,
            `> [89.3%] COMPUTING PREDICTIVE SENTIMENT DELTAS...`,
            `> SYNTHESIZING INTELLIGENCE PAYLOAD...`
        ];

        // Execute simulated terminal delay asynchronously while making the real API call
        const logPromise = async () => {
            for (let i = 0; i < logs.length; i++) {
                await new Promise(r => setTimeout(r, 1200));
                setOsintLogs(prev => [...prev, logs[i]]);
            }
        };

        const apiPromise = async () => {
            try {
                const res = await fetch("/api/osint", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startupName: startup.name, sector: startup.sector, description: startup.desc })
                });

                if (res.ok) {
                    const data = await res.json();
                    return data;
                } else {
                    return { error: "Failed to generate OSINT report. Check GEMINI_API_KEY." };
                }
            } catch (error) {
                return { error: "Network error occurred." };
            }
        };

        const [, data] = await Promise.all([logPromise(), apiPromise()]);
        
        if (data.error) {
            setOsintLogs(prev => [...prev, `[ERROR] ${data.error}`]);
            setOsintLoading(false);
        } else {
            setOsintResult(data);
            setOsintLoading(false);
        }
    };

    const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
        const next = new Set(set);
        if (next.has(value)) next.delete(value); else next.add(value);
        setter(next);
    };

    const resetFilters = () => {
        setSelectedSectors(new Set());
        setSelectedStages(new Set());
        setSearchQuery("");
    };

    const sectorCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        startups.forEach((s) => { counts[s.sector] = (counts[s.sector] || 0) + 1; });
        return counts;
    }, [startups]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] font-display">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-xs ring-1 ring-primary/30">IP</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">AYUSH InvestConnect</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Investor Portal</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="flex items-center w-full bg-slate-50 dark:bg-[#0a0a0a] rounded-lg border border-slate-200 dark:border-white/10 px-3">
                            <span className="material-icons text-slate-500 dark:text-slate-400 text-lg">search</span>
                            <input
                                type="text" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search startups by name, sector, or technology..."
                                className="flex-1 text-sm py-2 px-2 bg-transparent focus:outline-none"
                                onKeyDown={(e) => e.key === "Enter" && fetchStartups()}
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(""); fetchStartups(); }} className="text-slate-500 dark:text-slate-400 hover:text-slate-500 dark:text-slate-400">
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {status === "authenticated" ? (
                            <>
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mr-2 transition-colors">Sign Out</button>
                                <Link href="/dashboard" className="px-4 py-1.5 border border-blue-200 dark:border-white/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">Dashboard</Link>
                            </>
                        ) : (
                            <Link href="/login" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Filters</h2>
                                <button onClick={resetFilters} className="text-xs text-blue-600 font-medium hover:underline">Reset All</button>
                            </div>

                            {/* Sector */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-icons text-xs">spa</span> Sector
                                </h3>
                                <div className="space-y-2.5">
                                    {sectorOptions.map((sector) => (
                                        <label key={sector} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSectors.has(sector)}
                                                    onChange={() => toggleSet(selectedSectors, sector, setSelectedSectors)}
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:text-slate-100">{sector}</span>
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{sectorCounts[sector] || 0}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Growth Stage */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-icons text-xs">trending_up</span> Growth Stage
                                </h3>
                                <div className="space-y-2.5">
                                    {stageOptions.map((stage) => (
                                        <label key={stage} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedStages.has(stage)}
                                                onChange={() => toggleSet(selectedStages, stage, setSelectedStages)}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:text-slate-100">{stage}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedSectors.size > 0 || selectedStages.size > 0) && (
                                <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Active Filters</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...Array.from(selectedSectors), ...Array.from(selectedStages)].map((f) => (
                                            <span key={f} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                {f}
                                                <button onClick={() => {
                                                    if (selectedSectors.has(f)) toggleSet(selectedSectors, f, setSelectedSectors);
                                                    else toggleSet(selectedStages, f, setSelectedStages);
                                                }} className="hover:text-blue-900">
                                                    <span className="material-icons text-xs">close</span>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Discover Startups</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Found <span className="text-blue-600 font-bold">{startups.length}</span> startups matching your criteria.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>Sort by:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                    <option value="recommended">Recommended</option>
                                    <option value="ask_asc">Ask: Low → High</option>
                                    <option value="ask_desc">Ask: High → Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-20">
                                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && startups.length === 0 && (
                            <div className="text-center py-16 bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-white/5">
                                <span className="material-icons text-slate-700 dark:text-slate-300 text-5xl mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No startups found</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Try adjusting your filters or search query.</p>
                                <button onClick={resetFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Clear Filters</button>
                            </div>
                        )}

                        {!isLoading && startups.length > 0 && (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {startups.map((startup, index) => {
                                    return (
                                        <div key={index} className={`bg-white dark:bg-[#111] rounded-xl border ${startup.featured ? "border-blue-200 dark:border-blue-500/30 ring-1 ring-blue-100 dark:ring-blue-500/20" : "border-slate-200 dark:border-slate-800"} overflow-hidden hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] dark:shadow-black transition-all duration-200 hover:-translate-y-0.5`}>
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${startup.color} flex items-center justify-center font-bold text-lg`}>
                                                            {startup.initial}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{startup.name}</h3>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <span className="material-icons text-[14px]">location_on</span> {startup.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => toggleBookmark(startup.id)} className="transition-colors">
                                                        <span className={`material-icons text-lg ${bookmarked.has(startup.id) ? "text-blue-500" : "text-slate-700 dark:text-slate-300 hover:text-blue-500"}`}>
                                                            {bookmarked.has(startup.id) ? "bookmark" : "bookmark_border"}
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {startup.tags.map((tag, i) => (
                                                        <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${startup.tagColors[i]}`}>{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">{startup.desc}</p>
                                                <div className="flex gap-6 mb-4">
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Ask</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{startup.ask || "Undisclosed"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Revenue</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{startup.revenue || "Pre-Rev"}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => runOSINT(startup)} className="w-full mb-2 bg-slate-900 border border-slate-700 text-white cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black shadow-slate-900/20 group">
                                                    <span className="material-icons text-base align-middle mr-1.5 text-blue-400 group-hover:text-amber-400 transition-colors">memory</span> OSINT AI Analysis
                                                </button>
                                                <a href={`mailto:${startup.founderEmail}?subject=Interest%20in%20${startup.name}%20from%20AYUSH%20Portal`} className={`w-full cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${startup.featured
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-[#0a0a0a]"
                                                    }`}>
                                                    {startup.featured ? (
                                                        <><span className="material-icons text-base align-middle mr-1.5">mail</span> Contact Founder</>
                                                    ) : (
                                                        <><span className="material-icons text-base align-middle mr-1.5">file_present</span> Request Pitch Deck</>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* OSINT COMMAND CENTER */}
            {osintModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-white/5 font-sans">
                        <div className="bg-slate-100 dark:bg-[#111] p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Cpu className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                                <h2 className="text-slate-900 dark:text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                    OSINT Intelligence Suite <span className="text-slate-500 dark:text-slate-400">|</span> <span className="text-emerald-400">{osintStartup?.name}</span>
                                </h2>
                            </div>
                            <button onClick={() => setOsintModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        
                        <div className="p-0 overflow-y-auto flex-1 !scrollbar-thin !scrollbar-thumb-slate-800 !scrollbar-track-transparent">
                            {osintLoading ? (
                                <div className="p-8">
                                    <div className="bg-white dark:bg-black text-emerald-500 font-mono text-xs sm:text-sm p-6 rounded-xl border border-emerald-900/30 min-h-[400px] flex flex-col shadow-[0_0_30px_rgba(16,185,129,0.05)_inset]">
                                        <div className="flex items-center gap-2 mb-6 border-b border-emerald-900/50 pb-4">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="tracking-widest uppercase opacity-70">Live Uplink Established</span>
                                        </div>
                                        {osintLogs.map((log, i) => (
                                            <div key={i} className="mb-3 tracking-tight opacity-90 animate-fade-in">{log}</div>
                                        ))}
                                        <div className="mt-auto flex items-center gap-2 text-emerald-400/70 pt-4 border-t border-emerald-900/30">
                                            <span className="w-2 h-4 bg-emerald-400 animate-pulse"></span>
                                            <span>Awaiting payload resolution...</span>
                                        </div>
                                    </div>
                                </div>
                            ) : osintResult ? (
                                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-slate-50 dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 animate-fade-in">
                                    {/* Exec Summary */}
                                    <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 sm:p-8 relative overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
                                        <h3 className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Globe className="w-4 h-4"/> Executive Summary</h3>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base font-light">{osintResult.executiveSummary}</p>
                                    </div>
                                    
                                    {/* Massive Metrics Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        
                                        {/* Growth Trend Area Chart */}
                                        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black">
                                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                                <h3 className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><LineChart className="w-4 h-4 text-sky-400"/> Growth Kinetics</h3>
                                                <span className="text-emerald-400 font-mono text-xl font-bold">+{osintResult.metrics?.projectedGrowth}% YoY</span>
                                            </div>
                                            <div className="h-56 w-full mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={osintResult.metrics?.growthTrend || []}>
                                                        <defs>
                                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="month" stroke={isDark ? "#334155" : "#94a3b8"} fontSize={10} tickLine={false} axisLine={false}/>
                                                        <RechartsTooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px', color: isDark ? '#f8fafc' : '#1e293b', fontSize: '12px'}} itemStyle={{color: '#38bdf8'}} />
                                                        <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Sentiment Pie */}
                                        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black">
                                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                                                <h3 className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><PieIcon className="w-4 h-4 text-purple-400"/> Web Sentiment</h3>
                                                <span className="text-slate-900 dark:text-white font-mono text-xl font-bold">{osintResult.metrics?.sentiment?.score}/100</span>
                                            </div>
                                            <div className="flex-1 min-h-[200px] relative w-full flex items-center justify-center -mt-2">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: "Positive", value: osintResult.metrics?.sentiment?.positive || 0, color: "#10b981" },
                                                                { name: "Neutral", value: osintResult.metrics?.sentiment?.neutral || 0, color: "#64748b" },
                                                                { name: "Negative", value: osintResult.metrics?.sentiment?.negative || 0, color: "#ef4444" }
                                                            ]}
                                                            cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none"
                                                        >
                                                            {
                                                                [
                                                                    { color: "#10b981" },
                                                                    { color: "#64748b" },
                                                                    { color: "#ef4444" }
                                                                ].map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))
                                                            }
                                                        </Pie>
                                                        <RechartsTooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px', color: isDark ? '#f8fafc' : '#1e293b', fontSize: '12px'}} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-center mt-2 border-t border-slate-800 pt-4">
                                                <div><p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Pos</p><p className="text-emerald-400 font-mono text-sm">{osintResult.metrics?.sentiment?.positive}%</p></div>
                                                <div className="border-l border-r border-slate-200 dark:border-slate-800"><p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Neu</p><p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{osintResult.metrics?.sentiment?.neutral}%</p></div>
                                                <div><p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Neg</p><p className="text-rose-400 font-mono text-sm">{osintResult.metrics?.sentiment?.negative}%</p></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Risk & Competitors Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        
                                        {/* Radar Risk Matrix */}
                                        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black flex flex-col">
                                            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-4">
                                                <h3 className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-400"/> Risk Matrix</h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black ${['Critical', 'High'].includes(osintResult.riskAnalysis?.overall) ? 'border border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-rose-900/20' : osintResult.riskAnalysis?.overall === 'Moderate' ? 'border border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-amber-900/20' : 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-emerald-900/20'}`}>
                                                    {osintResult.riskAnalysis?.overall} Threat
                                                </span>
                                            </div>
                                            <div className="h-64 w-full mt-4 -ml-4 flex-1">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={osintResult.riskAnalysis?.radar || []}>
                                                        <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} strokeDasharray="3 3"/>
                                                        <PolarAngleAxis dataKey="category" tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 500}} />
                                                        <Radar name="Severity" dataKey="score" stroke="#f43f5e" strokeWidth={2} fill="#f43f5e" fillOpacity={0.2} />
                                                        <RechartsTooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`, borderRadius: '8px', color: isDark ? '#f8fafc' : '#1e293b', fontSize: '12px'}} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-800/80 pt-5 mt-4 bg-rose-950/10 p-4 rounded-lg">
                                                <span className="text-rose-400 font-bold flex items-center gap-1 mb-2"><FileWarning className="w-3 h-3"/> REGULATORY FLAG:</span> 
                                                <p className="font-light italic">{osintResult.riskAnalysis?.regulatoryNotes}</p>
                                            </div>
                                        </div>

                                        {/* Competitors & Founder Info */}
                                        <div className="space-y-6">
                                            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
                                                <h3 className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-slate-800 pb-4"><Target className="w-4 h-4 text-amber-400"/> Competitor Mapping</h3>
                                                <div className="space-y-3">
                                                    {osintResult.competitors?.map((comp: any, i: number) => (
                                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-[#141414] border border-slate-800/80 hover:border-slate-700 transition-colors">
                                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 sm:mb-0">{comp.name}</span>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider">{comp.marketShare}% Share</span>
                                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider ${comp.threatLevel === 'High' ? 'text-rose-400 bg-rose-400/10 border border-rose-400/20' : comp.threatLevel === 'Medium' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'}`}>
                                                                    {comp.threatLevel}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black relative overflow-hidden">
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0"></div>
                                                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                                                    <h3 className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-blue-400"/> Founder Intelligence</h3>
                                                    <span className="text-blue-400 font-mono text-lg font-bold shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black shadow-blue-900/20">{osintResult.founderIntelligence?.credibilityScore}/100 </span>
                                                </div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">{osintResult.founderIntelligence?.background}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 ring-1 ring-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                                        <FileWarning className="w-8 h-8 text-rose-500 animate-pulse" />
                                    </div>
                                    <p className="text-rose-400 font-mono text-sm uppercase tracking-widest mb-2 font-bold">OSINT Telemetry Failed</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">Unable to resolve connection with intelligence database. Verify uplink protocols and API authorization.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
