"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const allStartups = [
    {
        name: "VedaLife Organics", location: "Bangalore, KA", sector: "Ayurveda", stage: "Early Traction",
        tags: ["Ayurveda", "Early Traction", "B2C"],
        tagColors: ["bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-slate-100 text-slate-600"],
        desc: "AI-driven supply chain platform connecting authentic medicinal herb farmers directly with pharmaceutical manufacturers, ensuring quality and traceability.",
        ask: "₹2.5 Cr", askNum: 250, revenue: "₹85 L", initial: "V", color: "bg-green-100 text-green-700", featured: true,
    },
    {
        name: "YogiTech Solutions", location: "Rishikesh, UK", sector: "Yoga & Naturopathy", stage: "Scaling",
        tags: ["Yoga & Naturopathy", "Scaling", "SaaS"],
        tagColors: ["bg-teal-100 text-teal-700", "bg-blue-100 text-blue-700", "bg-slate-100 text-slate-600"],
        desc: "Virtual reality yoga studio platform with real-time posture correction using computer vision and personalized session recommendations.",
        ask: "₹5 Cr", askNum: 500, revenue: "₹1.2 Cr", initial: "Y", color: "bg-blue-100 text-blue-700",
    },
    {
        name: "UnaniCure Labs", location: "Hyderabad, TS", sector: "Unani", stage: "Validation",
        tags: ["Unani", "Validation", "D2C"],
        tagColors: ["bg-purple-100 text-purple-700", "bg-indigo-100 text-indigo-700", "bg-slate-100 text-slate-600"],
        desc: "Modernizing traditional Unani formulations with nano-technology for better absorption and efficacy. Currently in clinical trials phase 2.",
        ask: "₹1.5 Cr", askNum: 150, revenue: "Pre-Rev", initial: "U", color: "bg-purple-100 text-purple-700",
    },
    {
        name: "MindSiddha", location: "Chennai, TN", sector: "Siddha", stage: "Early Traction",
        tags: ["Siddha", "Early Traction", "HealthTech"],
        tagColors: ["bg-orange-100 text-orange-700", "bg-amber-100 text-amber-700", "bg-slate-100 text-slate-600"],
        desc: "Integrating Siddha Varmam therapy with wearable sensors to treat chronic pain and stress disorders through data-driven precision.",
        ask: "₹80 L", askNum: 80, revenue: "₹30 L", initial: "M", color: "bg-orange-100 text-orange-700",
    },
    {
        name: "HomeoGlow", location: "Mumbai, MH", sector: "Homeopathy", stage: "Seed",
        tags: ["Homeopathy", "Seed", "SkinCare"],
        tagColors: ["bg-pink-100 text-pink-700", "bg-emerald-100 text-emerald-700", "bg-slate-100 text-slate-600"],
        desc: "Personalized homeopathic skincare regimens formulated using AI analysis of user skin types and lifestyle data.",
        ask: "₹75 L", askNum: 75, revenue: "₹15 L", initial: "H", color: "bg-pink-100 text-pink-700",
    },
    {
        name: "BioAyur Tech", location: "Pune, MH", sector: "Ayurveda", stage: "Scaling",
        tags: ["Ayurveda", "Scaling", "Biotech"],
        tagColors: ["bg-green-100 text-green-700", "bg-blue-100 text-blue-700", "bg-slate-100 text-slate-600"],
        desc: "Extraction and stabilization of active compounds from rare Ayurvedic herbs for export to global nutraceutical markets.",
        ask: "₹12 Cr", askNum: 1200, revenue: "₹4.5 Cr", initial: "B", color: "bg-teal-100 text-teal-700",
    },
];

const sectorOptions = ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"];
const stageOptions = ["Seed", "Validation", "Early Traction", "Scaling"];

export default function InvestorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set());
    const [selectedStages, setSelectedStages] = useState<Set<string>>(new Set());
    const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
    const [sortBy, setSortBy] = useState("recommended");

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

    const filtered = useMemo(() => {
        let result = [...allStartups];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q));
        }
        if (selectedSectors.size > 0) {
            result = result.filter((s) => selectedSectors.has(s.sector));
        }
        if (selectedStages.size > 0) {
            result = result.filter((s) => selectedStages.has(s.stage));
        }
        if (sortBy === "ask_asc") result.sort((a, b) => a.askNum - b.askNum);
        if (sortBy === "ask_desc") result.sort((a, b) => b.askNum - a.askNum);
        return result;
    }, [searchQuery, selectedSectors, selectedStages, sortBy]);

    const sectorCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allStartups.forEach((s) => { counts[s.sector] = (counts[s.sector] || 0) + 1; });
        return counts;
    }, []);

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
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-icons text-sm">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Login</Link>
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
                                <p className="text-sm text-slate-500">Found <span className="text-blue-600 font-bold">{filtered.length}</span> startups matching your criteria.</p>
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

                        {/* No Results */}
                        {filtered.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
                                <span className="material-icons text-slate-300 text-5xl mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No startups found</h3>
                                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search query.</p>
                                <button onClick={resetFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Clear Filters</button>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map((startup, index) => {
                                const origIdx = allStartups.indexOf(startup);
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
                                                            <span className="material-icons text-xs">location_on</span> {startup.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => {
                                                    const next = new Set(bookmarked);
                                                    if (next.has(origIdx)) next.delete(origIdx); else next.add(origIdx);
                                                    setBookmarked(next);
                                                }} className="transition-colors">
                                                    <span className={`material-icons text-lg ${bookmarked.has(origIdx) ? "text-blue-500" : "text-slate-300 hover:text-blue-500"}`}>
                                                        {bookmarked.has(origIdx) ? "bookmark" : "bookmark_border"}
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {startup.tags.map((tag, i) => (
                                                    <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${startup.tagColors[i]}`}>{tag}</span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed mb-4">{startup.desc}</p>
                                            <div className="flex gap-6 mb-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase">Ask</p>
                                                    <p className="text-sm font-bold text-slate-900">{startup.ask}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase">Revenue (TTM)</p>
                                                    <p className="text-sm font-bold text-slate-900">{startup.revenue}</p>
                                                </div>
                                            </div>
                                            <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${startup.featured
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                }`}>
                                                {startup.featured ? (
                                                    <><span className="material-icons text-sm align-middle mr-1">visibility</span> View Details</>
                                                ) : (
                                                    <><span className="material-icons text-sm align-middle mr-1">download</span> Request Pitch Deck</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
