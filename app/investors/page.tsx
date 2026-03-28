"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

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
            `[1.2s] Scraping regulatory databases for ${startup.name}...`,
            `[2.5s] Analyzing social sentiment (Twitter, LinkedIn, News)...`,
            `[3.8s] Compiling market growth projections for ${startup.sector}...`,
            `[4.5s] Finalizing intelligence report...`
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
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900">AYUSH InvestConnect</span>
                            <span className="text-[10px] text-slate-400 uppercase">SIH 2024 Portal</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="flex items-center w-full bg-slate-50 rounded-lg border border-slate-200 px-3">
                            <span className="material-icons text-slate-400 text-lg">search</span>
                            <input
                                type="text" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search startups by name, sector, or technology..."
                                className="flex-1 text-sm py-2 px-2 bg-transparent focus:outline-none"
                                onKeyDown={(e) => e.key === "Enter" && fetchStartups()}
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(""); fetchStartups(); }} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {status === "authenticated" ? (
                            <Link href="/dashboard" className="px-4 py-1.5 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">Dashboard</Link>
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
                                <h2 className="font-bold text-lg text-slate-900">Filters</h2>
                                <button onClick={resetFilters} className="text-xs text-blue-600 font-medium hover:underline">Reset All</button>
                            </div>

                            {/* Sector */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
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
                                                <span className="text-sm text-slate-700 group-hover:text-slate-900">{sector}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{sectorCounts[sector] || 0}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Growth Stage */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
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
                                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{stage}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedSectors.size > 0 || selectedStages.size > 0) && (
                                <div className="pt-4 border-t border-slate-200">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Active Filters</p>
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
                                <h1 className="text-2xl font-bold text-slate-900">Discover Startups</h1>
                                <p className="text-sm text-slate-500">Found <span className="text-blue-600 font-bold">{startups.length}</span> startups matching your criteria.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Sort by:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
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
                            <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
                                <span className="material-icons text-slate-300 text-5xl mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No startups found</h3>
                                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search query.</p>
                                <button onClick={resetFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Clear Filters</button>
                            </div>
                        )}

                        {!isLoading && startups.length > 0 && (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {startups.map((startup, index) => {
                                    return (
                                        <div key={index} className={`bg-white rounded-xl border ${startup.featured ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-100"} overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${startup.color} flex items-center justify-center font-bold text-lg`}>
                                                            {startup.initial}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-sm text-slate-900">{startup.name}</h3>
                                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                <span className="material-icons text-[14px]">location_on</span> {startup.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => toggleBookmark(startup.id)} className="transition-colors">
                                                        <span className={`material-icons text-lg ${bookmarked.has(startup.id) ? "text-blue-500" : "text-slate-300 hover:text-blue-500"}`}>
                                                            {bookmarked.has(startup.id) ? "bookmark" : "bookmark_border"}
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {startup.tags.map((tag, i) => (
                                                        <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${startup.tagColors[i]}`}>{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">{startup.desc}</p>
                                                <div className="flex gap-6 mb-4">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase">Ask</p>
                                                        <p className="text-sm font-bold text-slate-900">{startup.ask || "Undisclosed"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase">Revenue</p>
                                                        <p className="text-sm font-bold text-slate-900">{startup.revenue || "Pre-Rev"}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => runOSINT(startup)} className="w-full mb-2 bg-slate-900 border border-slate-700 text-white cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center hover:bg-slate-800 shadow-lg shadow-slate-900/20 group">
                                                    <span className="material-icons text-base align-middle mr-1.5 text-blue-400 group-hover:text-amber-400 transition-colors">memory</span> OSINT AI Analysis
                                                </button>
                                                <a href={`mailto:${startup.founderEmail}?subject=Interest%20in%20${startup.name}%20from%20AYUSH%20Portal`} className={`w-full cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${startup.featured
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
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

            {/* OSINT AI Modal */}
            {osintModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
                        <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-white font-bold flex items-center gap-2">
                                <span className="material-icons text-blue-400">memory</span> 
                                OSINT Intelligence Report <span className="text-slate-500 font-normal">| {osintStartup?.name}</span>
                            </h2>
                            <button onClick={() => setOsintModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                            {osintLoading ? (
                                <div className="bg-black text-green-400 font-mono text-xs p-5 rounded-xl border border-slate-800 min-h-[300px] flex flex-col">
                                    {osintLogs.map((log, i) => (
                                        <div key={i} className="mb-2 tracking-tight opacity-90 animate-fade-in">{log}</div>
                                    ))}
                                    <div className="mt-2 flex items-center gap-2 text-blue-400">
                                        <span className="w-2 h-4 bg-blue-400 animate-pulse"></span> Processing target vectors...
                                    </div>
                                </div>
                            ) : osintResult ? (
                                <div className="space-y-6 animate-fade-in">
                                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">{osintResult.summary}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <span className="material-icons text-xl">trending_up</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projected Growth</p>
                                                <p className="text-lg font-bold text-slate-900">{osintResult.projectedGrowth}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                                <span className="material-icons text-xl">forum</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web Sentiment</p>
                                                <p className="text-lg font-bold text-slate-900">{osintResult.marketSentiment}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                                <span className="material-icons text-slate-400 text-sm">security</span> Risk Analysis
                                            </h3>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${osintResult.riskScore === 'Low' ? 'bg-green-100 text-green-700' : osintResult.riskScore === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {osintResult.riskScore} Risk
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Founder OSINT Check</p>
                                                <p className="text-sm text-slate-700">{osintResult.founderBackground}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Regulatory Intelligence</p>
                                                <p className="text-sm text-slate-700">{osintResult.regulatory}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                                            <span className="material-icons text-slate-400 text-sm">group_work</span> Top Competitors Found
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {osintResult.competitors?.map((comp: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg shadow-sm">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <span className="material-icons text-red-400 text-4xl mb-2">error_outline</span>
                                    <p className="text-slate-600 font-medium tracking-tight">OSINT connection failed.</p>
                                    <p className="text-sm text-slate-400 mt-1">Check logs for details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
