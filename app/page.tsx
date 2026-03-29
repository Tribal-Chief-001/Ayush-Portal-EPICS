"use client";
import { motion } from "framer-motion";
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
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-emerald-400 font-medium text-sm mb-6 border border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] shadow-primary/10">
                                <span className="mr-2">🇮🇳</span> National AYUSH Startup Initiative
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                                Empowering the Future of{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">
                                    Traditional Medicine
                                </span>
                            </h1>
                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                                The official registration portal for AYUSH startups. Innovate, grow, and scale your Ayurveda, Yoga, Unani, Siddha, or Homeopathy venture with full government support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black hover:shadow-primary/25 transition-all transform hover:-translate-y-0.5">
                                    Register Your Startup
                                    <span className="material-icons ml-2 text-sm">arrow_forward</span>
                                </Link>
                                <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-xl hover:bg-[#1a1a1a] shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black transition-all">
                                    <span className="material-icons mr-2 text-emerald-400">play_circle</span>
                                    How it Works
                                </button>
                            </div>
                            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-emerald-500 text-lg">verified</span>
                                    <span>Govt. Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-emerald-500 text-lg">verified</span>
                                    <span>Secure Process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-emerald-500 text-lg">verified</span>
                                    <span>Direct Funding</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Image Composition */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="relative lg:h-[600px] w-full flex items-center justify-center"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 via-transparent to-emerald-500/10 rounded-full blur-3xl opacity-60"></div>
                            {/* Main Card */}
                            <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black border border-slate-200 dark:border-white/10 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                                <div
                                    className="h-48 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKGXTWsuX_3g-bL3dRsA0TmTBURdPld-_F-kLJ8r2c2CyJXHsS-VNMozqd51G6SppqZRF2d4zlTz_v1nOilwX-aMIB2kB8cX5km5CoygBvAjfFQASrGHUGCIhImTFS7z-RFLxA11aRKuD_Hb_ew1W7shxTzhk2izXAyazqMlEYSLGIDqpgUVnahIZmG5XGpiZdL9oMKJcWlo4NOCcgx7Xq79I5OwnU-DDx0ZMKD2hb50IDNuL5teAmkmEeXwtdYjKqXMGQ-yz-bNA')`,
                                    }}
                                >
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                        5,000+ Startups
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">A</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">AyurTech Innovations</h3>
                                            <p className="text-xs text-slate-500">Registered 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                                            <div className="h-full bg-gradient-to-r from-emerald-600 to-primary w-3/4 rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-500 dark:text-slate-400">Profile Completion</span>
                                            <span className="text-emerald-400">75%</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Status: <span className="text-emerald-500 font-medium">Active</span></div>
                                        <button className="text-xs bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-3 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors">View Details</button>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Elements */}
                            <motion.div 
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 bg-white dark:bg-[#111111] p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-slate-200 dark:border-white/10 flex items-center gap-3"
                            >
                                <span className="material-icons text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">spa</span>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Disbursed Today</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">₹ 2.4 Crores</p>
                                </div>
                            </motion.div>
                            <motion.div 
                                animate={{ y: [10, -10, 10] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute top-10 -right-4 bg-white dark:bg-[#111111] p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-slate-200 dark:border-white/10 flex items-center gap-3"
                            >
                                <span className="material-icons text-blue-500 bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">security</span>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Data Security</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">ISO Certified</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Live Stats Ticker */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-slate-50 dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5 relative z-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
                        <div>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 drop-shadow-lg">12,450+</div>
                            <div className="text-xs font-semibold text-emerald-500 mt-2 uppercase tracking-widest">Registered Startups</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 drop-shadow-lg">₹450 Cr</div>
                            <div className="text-xs font-semibold text-emerald-500 mt-2 uppercase tracking-widest">Funding Disbursed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 drop-shadow-lg">850+</div>
                            <div className="text-xs font-semibold text-emerald-500 mt-2 uppercase tracking-widest">Active Investors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 drop-shadow-lg">150+</div>
                            <div className="text-xs font-semibold text-emerald-500 mt-2 uppercase tracking-widest">Incubators</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Persona Cards */}
            <section className="py-24 bg-white dark:bg-[#111111] relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight">A Unified Ecosystem</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Bringing together all stakeholders of the AYUSH ecosystem under one globally-connected digital roof to foster innovation and geometric growth.</p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Startup Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl p-8 hover:shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black transition-all border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-icons text-9xl text-emerald-500">rocket_launch</span>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black group-hover:scale-110 transition-transform duration-300">
                                <span className="material-icons text-[#0a0a0a] text-2xl">science</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">For Startups</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed h-20">
                                Register your venture to access government grants, mentorship programs, and incubation support tailored strictly for AYUSH.
                            </p>
                            <Link href="/register" className="inline-flex items-center text-emerald-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                Start Registration <span className="material-icons text-sm ml-2">arrow_forward</span>
                            </Link>
                        </motion.div>

                        {/* Investor Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group relative bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl p-8 hover:shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black transition-all border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-icons text-9xl text-emerald-500">trending_up</span>
                            </div>
                            <div className="w-14 h-14 bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center mb-8 shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] dark:shadow-black group-hover:scale-110 transition-transform duration-300">
                                <span className="material-icons text-slate-700 dark:text-white text-2xl">paid</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">For Investors</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed h-20">
                                Discover vetted, high-potential startups in the traditional medicine sector. Leverage AI-powered OSINT telemetry to verify credibility.
                            </p>
                            <Link href="/investors" className="inline-flex items-center text-slate-900 dark:text-slate-100 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                Explore Intelligence <span className="material-icons text-sm ml-2">arrow_forward</span>
                            </Link>
                        </motion.div>

                        {/* Government Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group relative bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl p-8 hover:shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black transition-all border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-icons text-9xl text-emerald-500">account_balance</span>
                            </div>
                            <div className="w-14 h-14 bg-white dark:bg-[#111111] border border-emerald-500/20 rounded-xl flex items-center justify-center mb-8 shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black group-hover:scale-110 transition-transform duration-300">
                                <span className="material-icons text-emerald-500 text-2xl">gavel</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Government</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed h-20">
                                Monitor ecosystem growth kinetics, dynamically verify startups, and manage national policy implementation directly.
                            </p>
                            <Link href="/admin" className="inline-flex items-center text-slate-900 dark:text-slate-100 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                Official Login <span className="material-icons text-sm ml-2">arrow_forward</span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 bg-slate-50 dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full md:w-1/2"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black border border-slate-200 dark:border-white/10 object-cover h-[500px] w-full"
                                alt="Modern laboratory with plants and technology"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkmGqLvG8IPVlXwQ_L3nIn1aghSsGitaaKszwkxFxKoyxBqHGTLln4KWcjUiGaXz8LS8lga7cJAy-AU2bZgcgdEOLZV0UQLzpHFMhQZmbqS-gHSon3JFbXq6ZTKugI4XW5UxKZ8SuYa5kfxxAIR5WlxyS-ZXDHu3QxeTJHheeCnLEadMWKjZPJPWuLmvw01G_Rn1sKcV9b7klkF_zRCYEuN2-bq4Iimg2iZyE_eFFYRLRTSvNiWOmUvRLTXr4q9y7EBBNVMLfA3aU"
                            />
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full md:w-1/2"
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">Security & Transparency</div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">Zero Red Tape.<br />Maximum <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Velocity.</span></h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg leading-relaxed">
                                Our platform leverages next-generation verification protocols to ensure that every registration and funding round is secure, totally traceable, and transparent to the exact node.
                            </p>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-[#111111] border border-emerald-500/20 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-black">
                                            <span className="material-icons text-emerald-500">visibility</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Absolute Transparency</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">Observe your application trajectory in real-time through the terminal metrics. No black boxes.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-[#111111] border border-emerald-500/20 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-black">
                                            <span className="material-icons text-emerald-500">precision_manufacturing</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Automated Clearances</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">A specialized OSINT agent validates your compliance footprint within sector algorithms rapidly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-[#111111] border border-emerald-500/20 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-black">
                                            <span className="material-icons text-emerald-500">enhanced_encryption</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Enterprise Encryption</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">AES-256 database protection securing intellectual property and founder telemetry end-to-end.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 relative z-20 bg-white dark:bg-[#111111] border-t border-slate-200 dark:border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.95)] shadow-black border border-slate-200 dark:border-white/10"
                    >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#2bee6c 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Evolve Traditional Wisdom <br/>Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Deep Tech.</span></h2>
                            <p className="text-slate-700 dark:text-slate-300 mb-12 max-w-2xl mx-auto text-xl font-medium leading-relaxed">Connect to the national matrix of founders modernizing Ayurveda, Yoga, Unani, Siddha, and Homeopathy.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link href="/register" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#0a0a0a] bg-emerald-400 rounded-2xl hover:bg-emerald-300 hover:scale-105 shadow-[0_0_40px_rgba(52,211,153,0.3)] transition-all duration-300">
                                    Initialize Account
                                    <span className="material-icons ml-3 font-bold">arrow_forward</span>
                                </Link>
                                <Link href="/schemes" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-800 dark:text-slate-200 border-2 border-slate-700/50 rounded-2xl hover:bg-white/5 hover:border-slate-600 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                    View Policy Matrix
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </>
    );
}
