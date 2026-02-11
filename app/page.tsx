import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Navbar />
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                <div className="absolute inset-0 hero-pattern z-0"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-dark mb-6 ring-1 ring-inset ring-primary/20">
                                <span className="mr-2">🎉</span> Smart India Hackathon 2024
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                                Empowering the Future of{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
                                    Traditional Medicine
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                The official registration portal for AYUSH startups. Innovate, grow, and scale your Ayurveda, Yoga, Unani, Siddha, or Homeopathy venture with full government support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-900 bg-primary rounded-xl hover:bg-primary-dark hover:text-white shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5">
                                    Register Your Startup
                                    <span className="material-icons ml-2 text-sm">arrow_forward</span>
                                </Link>
                                <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                    <span className="material-icons mr-2 text-primary-dark">play_circle</span>
                                    How it Works
                                </button>
                            </div>
                            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-green-600 text-lg">verified</span>
                                    <span>Govt. Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-green-600 text-lg">verified</span>
                                    <span>Secure Process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-green-600 text-lg">verified</span>
                                    <span>Direct Funding</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Composition */}
                        <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-full blur-3xl opacity-60"></div>
                            {/* Main Card */}
                            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div
                                    className="h-48 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKGXTWsuX_3g-bL3dRsA0TmTBURdPld-_F-kLJ8r2c2CyJXHsS-VNMozqd51G6SppqZRF2d4zlTz_v1nOilwX-aMIB2kB8cX5km5CoygBvAjfFQASrGHUGCIhImTFS7z-RFLxA11aRKuD_Hb_ew1W7shxTzhk2izXAyazqMlEYSLGIDqpgUVnahIZmG5XGpiZdL9oMKJcWlo4NOCcgx7Xq79I5OwnU-DDx0ZMKD2hb50IDNuL5teAmkmEeXwtdYjKqXMGQ-yz-bNA')`,
                                    }}
                                >
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-dark shadow-sm">
                                        5,000+ Startups
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold">A</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">AyurTech Innovations</h3>
                                            <p className="text-xs text-slate-500">Registered 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-3/4 rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-500">Profile Completion</span>
                                            <span className="text-primary-dark">75%</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="text-xs text-slate-400">Status: <span className="text-green-600 font-medium">Active</span></div>
                                        <button className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-md font-semibold">View Details</button>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Elements */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                                <span className="material-icons text-green-600 bg-green-100 p-2 rounded-lg">spa</span>
                                <div>
                                    <p className="text-xs text-slate-500">Disbursed Today</p>
                                    <p className="text-sm font-bold text-slate-900">₹ 2.4 Crores</p>
                                </div>
                            </div>
                            <div className="absolute top-10 -right-4 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "4s" }}>
                                <span className="material-icons text-blue-600 bg-blue-100 p-2 rounded-lg">security</span>
                                <div>
                                    <p className="text-xs text-slate-500">Data Security</p>
                                    <p className="text-sm font-bold text-slate-900">ISO Certified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Stats Ticker */}
            <div className="bg-primary/5 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
                        <div>
                            <div className="text-3xl font-bold text-slate-900">12,450+</div>
                            <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Registered Startups</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900">₹450 Cr</div>
                            <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Funding Disbursed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900">850+</div>
                            <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Investors</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900">150+</div>
                            <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Incubators</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persona Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">A Unified Ecosystem</h2>
                        <p className="text-slate-600">Bringing together all stakeholders of the AYUSH ecosystem under one digital roof to foster innovation and growth.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Startup Card */}
                        <div className="group relative bg-background-light rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all border border-transparent hover:border-primary/30">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons text-8xl text-primary">rocket_launch</span>
                            </div>
                            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                <span className="material-icons text-slate-900 text-2xl">science</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">For Startups</h3>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Register your venture to access government grants, mentorship programs, and incubation support tailored for AYUSH.
                            </p>
                            <Link href="/register" className="inline-flex items-center text-primary-dark font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Start Registration <span className="material-icons text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Investor Card */}
                        <div className="group relative bg-background-light rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all border border-transparent hover:border-primary/30">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons text-8xl text-primary">trending_up</span>
                            </div>
                            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-icons text-white text-2xl">paid</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">For Investors</h3>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Discover vetted, high-potential startups in the traditional medicine sector. Connect directly with founders.
                            </p>
                            <Link href="/investors" className="inline-flex items-center text-slate-900 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Explore Opportunities <span className="material-icons text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Government Card */}
                        <div className="group relative bg-background-light rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/10 transition-all border border-transparent hover:border-primary/30">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons text-8xl text-primary">account_balance</span>
                            </div>
                            <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-icons text-slate-700 text-2xl">gavel</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Government</h3>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Monitor ecosystem growth, verify startups, and manage policy implementation through a centralized dashboard.
                            </p>
                            <Link href="/admin" className="inline-flex items-center text-slate-900 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Official Login <span className="material-icons text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 bg-background-light relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="w-full md:w-1/2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 object-cover h-[500px] w-full"
                                alt="Modern laboratory with plants and technology"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkmGqLvG8IPVlXwQ_L3nIn1aghSsGitaaKszwkxFxKoyxBqHGTLln4KWcjUiGaXz8LS8lga7cJAy-AU2bZgcgdEOLZV0UQLzpHFMhQZmbqS-gHSon3JFbXq6ZTKugI4XW5UxKZ8SuYa5kfxxAIR5WlxyS-ZXDHu3QxeTJHheeCnLEadMWKjZPJPWuLmvw01G_Rn1sKcV9b7klkF_zRCYEuN2-bq4Iimg2iZyE_eFFYRLRTSvNiWOmUvRLTXr4q9y7EBBNVMLfA3aU"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-xs font-bold uppercase tracking-wider mb-4">Why Register?</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Build Trust through <br />Transparency</h2>
                            <p className="text-slate-600 mb-10">
                                Our platform is designed to eliminate red tape. We leverage blockchain technology to ensure that every registration and funding round is secure, traceable, and transparent.
                            </p>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <span className="material-icons text-primary-dark">visibility</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">100% Transparency</h4>
                                        <p className="text-slate-500 text-sm mt-1">Track your application status in real-time. No hidden processes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <span className="material-icons text-primary-dark">fact_check</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">Simplified Process</h4>
                                        <p className="text-slate-500 text-sm mt-1">Single-window clearance system for all regulatory approvals.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <span className="material-icons text-primary-dark">shield</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">Secure Data</h4>
                                        <p className="text-slate-500 text-sm mt-1">Military-grade encryption for all your intellectual property and data.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-surface-dark rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#2bee6c 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform the world with Ancient Wisdom?</h2>
                            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">Join thousands of other founders who are modernizing Ayurveda, Yoga, Unani, Siddha, and Homeopathy.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-primary rounded-xl hover:bg-white hover:scale-105 transition-all duration-300">
                                    Create Free Account
                                </Link>
                                <Link href="/schemes" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-slate-600 rounded-xl hover:bg-white/10 transition-all">
                                    View Eligibility
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
