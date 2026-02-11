"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const categories = ["All Resources", "Funding & Grants", "Research Papers", "Certifications", "Incubation", "Policy"];

const resources = [
    {
        type: "Funding", category: "Funding & Grants",
        typeColor: "bg-green-50 text-green-700 border-green-200",
        borderColor: "border-l-green-500",
        title: "National AYUSH Mission (NAM)",
        desc: "Financial assistance provided for infrastructure upgradation of AYUSH hospitals and dispensaries. Special focus on startups integrating technology with traditional medicine systems.",
        details: [
            { icon: "check_circle", text: "Eligibility: Reg. Startups, NGOs", color: "text-green-600" },
            { icon: "account_balance_wallet", text: "Grant: Up to ₹50 Lakhs", color: "text-slate-600" },
            { icon: "event", text: "Deadline: 15 Oct 2024", color: "text-red-600" },
        ],
        action: "Apply Now →", actionStyle: "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white",
        actionLink: "/register",
    },
    {
        type: "Research", category: "Research Papers",
        typeColor: "bg-purple-50 text-purple-700 border-purple-200",
        borderColor: "border-l-purple-500",
        title: "Efficacy of Ashwagandha in Stress Management",
        desc: "By Dr. A. Sharma, AIIA New Delhi. A double-blind, randomized, placebo-controlled study evaluating the safety and efficacy of high-concentration full-spectrum Ashwagandha root extract.",
        tags: ["Clinical Trial", "Neurology"],
        action: "Preview", actionStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
        action2: "PDF", action2Style: "bg-slate-900 text-white hover:bg-slate-800",
        starred: true,
    },
    {
        type: "Certification", category: "Certifications",
        typeColor: "bg-amber-50 text-amber-700 border-amber-200",
        borderColor: "border-l-amber-500",
        title: "Ayush Mark Certification Scheme",
        desc: "Voluntary certification scheme for AYUSH products to ensure quality control. Crucial for startups aiming for export markets.",
        details: [
            { icon: "business", text: "Agency: QCI India", color: "text-slate-600" },
            { icon: "schedule", text: "Process: 4-6 Weeks", color: "text-amber-600" },
        ],
        action: "View Requirements", actionStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    },
    {
        type: "Incubation", category: "Incubation",
        typeColor: "bg-blue-50 text-blue-700 border-blue-200",
        borderColor: "border-l-blue-500",
        title: "FITM - Ayush Incubation Centre",
        desc: "Forum of Indian Traditional Medicine (FITM) offers incubation support, mentorship, and seed funding for tech-enabled AYUSH ventures.",
        details: [
            { icon: "location_on", text: "Location: RIS, New Delhi", color: "text-slate-600" },
            { icon: "groups", text: "Cohorts: Summer 2024", color: "text-slate-600" },
        ],
        action: "Apply Now →", actionStyle: "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white",
        actionLink: "/register",
    },
    {
        type: "Research", category: "Research Papers",
        typeColor: "bg-purple-50 text-purple-700 border-purple-200",
        borderColor: "border-l-purple-500",
        title: "AI in Pulse Diagnosis (Nadi Pariksha)",
        desc: "By TechAyush Labs. Developing standardized algorithms for digital pulse diagnosis devices. A comparative study between traditional practitioners and AI models.",
        tags: ["Technology", "Diagnostic"],
        action: "Preview", actionStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
        action2: "PDF", action2Style: "bg-slate-900 text-white hover:bg-slate-800",
    },
    {
        type: "Export Policy", category: "Policy",
        typeColor: "bg-pink-50 text-pink-700 border-pink-200",
        borderColor: "border-l-pink-500",
        title: "Ayush Export Promotion Council",
        desc: "Guidelines and incentives for exporting AYUSH products to EU and US markets. Includes compliance checklists for international standards.",
        details: [
            { icon: "public", text: "Target: Global Markets", color: "text-slate-600" },
            { icon: "update", text: "Updated: Sep 2024", color: "text-slate-600" },
        ],
        action: "Download Guidelines", actionStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    },
    {
        type: "Funding", category: "Funding & Grants",
        typeColor: "bg-green-50 text-green-700 border-green-200",
        borderColor: "border-l-green-500",
        title: "Startup India Seed Fund Scheme",
        desc: "Provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry. AYUSH sector startups are eligible.",
        details: [
            { icon: "check_circle", text: "Eligibility: DIPP Recognized", color: "text-green-600" },
            { icon: "account_balance_wallet", text: "Grant: Up to ₹20 Lakhs", color: "text-slate-600" },
            { icon: "event", text: "Ongoing", color: "text-blue-600" },
        ],
        action: "Apply Now →", actionStyle: "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white",
        actionLink: "/register",
    },
    {
        type: "Certification", category: "Certifications",
        typeColor: "bg-amber-50 text-amber-700 border-amber-200",
        borderColor: "border-l-amber-500",
        title: "GMP Certification for AYUSH",
        desc: "Good Manufacturing Practice certification mandatory for all AYUSH drug manufacturers. Ensures quality, safety, and efficacy standards.",
        details: [
            { icon: "business", text: "Agency: State Drug Controller", color: "text-slate-600" },
            { icon: "schedule", text: "Process: 8-12 Weeks", color: "text-amber-600" },
        ],
        action: "View Requirements", actionStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    },
    {
        type: "Incubation", category: "Incubation",
        typeColor: "bg-blue-50 text-blue-700 border-blue-200",
        borderColor: "border-l-blue-500",
        title: "AIIA Innovation & Incubation Centre",
        desc: "All India Institute of Ayurveda offers lab space, clinical trial support, and mentorship for Ayurveda-focused startups in New Delhi.",
        details: [
            { icon: "location_on", text: "Location: AIIA, New Delhi", color: "text-slate-600" },
            { icon: "groups", text: "Rolling Admissions", color: "text-slate-600" },
        ],
        action: "Apply Now →", actionStyle: "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white",
        actionLink: "/register",
    },
];

type SortKey = "relevance" | "newest" | "deadline";

export default function SchemesPage() {
    const [activeCategory, setActiveCategory] = useState("All Resources");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortKey>("relevance");
    const [bookmarked, setBookmarked] = useState<Set<number>>(new Set([1]));

    const toggleBookmark = (index: number) => {
        setBookmarked((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index); else next.add(index);
            return next;
        });
    };

    const filtered = useMemo(() => {
        let result = [...resources];
        // Category filter
        if (activeCategory !== "All Resources") {
            result = result.filter((r) => r.category === activeCategory);
        }
        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((r) =>
                r.title.toLowerCase().includes(q) ||
                r.desc.toLowerCase().includes(q) ||
                r.type.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-background-light font-display">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">A</div>
                        <span className="font-bold text-lg text-slate-900">AYUSH<span className="font-normal">Hub</span></span>
                        <span className="text-[10px] text-slate-400 uppercase ml-1">Start-up Portal</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</Link>
                        <Link href="/schemes" className="text-sm font-semibold text-primary-dark border-b-2 border-primary pb-0.5">Schemes & Grants</Link>
                        <Link href="/investors" className="text-sm text-slate-600 hover:text-slate-900">Investors</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="px-4 py-1.5 bg-primary rounded-full text-sm font-semibold text-slate-900 hover:bg-primary-dark hover:text-white transition-all">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-b from-green-50 to-background-light py-16 text-center">
                <span className="px-3 py-1 bg-primary/20 text-primary-dark text-xs font-bold rounded-full uppercase tracking-wider">Smart India Hackathon 2024</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-4">
                    Empowering <span className="text-primary-dark">AYUSH</span> Innovations
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                    Access a central library of government schemes, research grants, and policy frameworks designed to accelerate your traditional medicine startup.
                </p>
                <div className="max-w-2xl mx-auto flex items-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden px-4">
                    <span className="material-icons text-slate-400">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for schemes (e.g., 'NAM', 'GMP', 'Export')..."
                        className="flex-1 text-sm py-3.5 px-3 focus:outline-none"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 mr-2">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    )}
                    <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">Search</button>
                </div>
                <div className="mt-3 text-xs text-slate-400 space-x-3">
                    <span>Trending:</span>
                    {["Startup India Grant", "Clinical Trials", "GMP Certification"].map((t) => (
                        <button key={t} onClick={() => setSearchQuery(t)} className="text-slate-500 hover:text-primary-dark transition-colors">{t}</button>
                    ))}
                </div>
            </section>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-primary text-slate-900 shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
                        <span className="text-slate-300">|</span>
                        <span>Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="newest">Newest</option>
                            <option value="deadline">Deadline</option>
                        </select>
                    </div>
                </div>

                {/* No Results */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <span className="material-icons text-slate-300 text-5xl mb-4">search_off</span>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No resources found</h3>
                        <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filter criteria.</p>
                        <button onClick={() => { setSearchQuery(""); setActiveCategory("All Resources"); }} className="px-4 py-2 bg-primary rounded-lg text-sm font-medium text-slate-900 hover:bg-primary-dark hover:text-white">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Resource Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filtered.map((resource, index) => {
                        const origIdx = resources.indexOf(resource);
                        return (
                            <div key={index} className={`bg-white rounded-xl border border-slate-100 border-l-4 ${resource.borderColor} overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${resource.typeColor}`}>{resource.type}</span>
                                        <button onClick={() => toggleBookmark(origIdx)} className="transition-colors">
                                            <span className={`material-icons text-lg ${bookmarked.has(origIdx) ? "text-amber-400" : "text-slate-300 hover:text-amber-400"}`}>
                                                {bookmarked.has(origIdx) ? "star" : "bookmark_border"}
                                            </span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{resource.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{resource.desc}</p>

                                    {resource.tags && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {resource.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {resource.details && (
                                        <div className="space-y-2 mb-4">
                                            {resource.details.map((detail, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs">
                                                    <span className={`material-icons text-sm ${detail.color}`}>{detail.icon}</span>
                                                    <span className="text-slate-600">{detail.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-auto">
                                        {resource.actionLink ? (
                                            <Link href={resource.actionLink} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all ${resource.actionStyle}`}>
                                                {resource.action}
                                            </Link>
                                        ) : (
                                            <button className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${resource.actionStyle}`}>
                                                {resource.action}
                                            </button>
                                        )}
                                        {resource.action2 && (
                                            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${resource.action2Style}`}>
                                                <span className="material-icons text-sm mr-1 align-middle">download</span> {resource.action2}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-primary/5 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div><div className="text-3xl font-bold text-slate-900">500+</div><div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Registered Startups</div></div>
                        <div><div className="text-3xl font-bold text-slate-900">₹200Cr</div><div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Grants Disbursed</div></div>
                        <div><div className="text-3xl font-bold text-slate-900">1.2k</div><div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Research Papers</div></div>
                        <div><div className="text-3xl font-bold text-slate-900">50+</div><div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Incubators</div></div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs">A</div>
                                <span className="font-bold text-slate-900">AYUSH<span className="font-normal">Hub</span></span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">A Government of India initiative to promote startups and innovation in the field of Ayurveda, Yoga, Unani, Siddha, and Homeopathy.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-xs text-slate-500">
                                <li><Link href="/schemes" className="hover:text-primary-dark">Schemes</Link></li>
                                <li><Link href="/register" className="hover:text-primary-dark">Startup Registration</Link></li>
                                <li><Link href="/investors" className="hover:text-primary-dark">Investors</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 mb-4">Resources</h4>
                            <ul className="space-y-2 text-xs text-slate-500">
                                <li><a href="#" className="hover:text-primary-dark">Ministry of AYUSH</a></li>
                                <li><a href="#" className="hover:text-primary-dark">Startup India</a></li>
                                <li><a href="#" className="hover:text-primary-dark">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 mb-4">Contact</h4>
                            <ul className="space-y-2 text-xs text-slate-500">
                                <li className="flex items-start gap-2"><span className="material-icons text-xs mt-0.5">email</span> support@ayush-startup.gov.in</li>
                                <li className="flex items-center gap-2"><span className="material-icons text-xs">call</span> +91-11-24651650</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
                        © 2024 Ministry of AYUSH. All rights reserved. | Smart India Hackathon Prototype
                    </div>
                </div>
            </footer>
        </div>
    );
}
