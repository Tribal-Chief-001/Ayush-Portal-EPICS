"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "assistant";
    text: string;
    time: string;
}

const aiResponses: Record<string, string> = {
    "ayush": "AYUSH stands for **Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy**. These are the five traditional medicine systems recognized by the Ministry of AYUSH, Government of India. Each system has unique principles and practices.",
    "certification": "For AYUSH certification, you'll need:\n\n1. **Product License** from State Licensing Authority\n2. **GMP Certificate** for manufacturing\n3. **Ayush Mark** (voluntary) from QCI\n4. **Clinical Trial Data** if applicable\n\nProcessing typically takes 4-6 weeks.",
    "funding": "Several funding options are available:\n\n- **National AYUSH Mission (NAM)** – Up to ₹50 Lakhs\n- **Startup India Seed Fund** – Up to ₹20 Lakhs\n- **BIRAC BIG Grant** – Up to ₹50 Lakhs\n- **State-specific AYUSH schemes**\n\nWould you like details on any of these?",
    "registration": "Your registration process has 4 steps:\n\n1. ✅ Basic Info – Founder details\n2. ✅ Business Details – Company info, AYUSH sector\n3. 📄 Documents – GST, Clinical Data, Certifications\n4. 📋 Review & Submit\n\nYou're currently at the document upload stage.",
    "export": "To export AYUSH products internationally:\n\n1. Obtain **Ayush Mark Certification**\n2. Comply with **WHO guidelines** for herbal medicines\n3. Register with **APEDA** for agricultural products\n4. Meet target country regulations (FDA for US, EMA for EU)\n\nThe AYUSH Export Promotion Council can guide you through the process.",
    "siddha": "Siddha medicine originated in Tamil Nadu and is one of the oldest systems of medicine. Key aspects:\n\n- Uses **metals, minerals, and herbs**\n- Based on **Pancha Bootham** (five elements) theory\n- Focus on prevention through lifestyle\n- Growing international interest in Siddha formulations",
    "help": "I can help you with:\n\n🔹 **Registration** – Step-by-step guidance\n🔹 **Certification** – AYUSH Mark, GMP, licenses\n🔹 **Funding** – Government grants and schemes\n🔹 **Export** – International market compliance\n🔹 **Documents** – Required paperwork\n\nJust type your question!",
};

const getAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    for (const [key, response] of Object.entries(aiResponses)) {
        if (lower.includes(key)) return response;
    }
    const defaults = [
        "That's a great question! Based on the AYUSH guidelines, I'd recommend reviewing the official documentation at the Ministry of AYUSH portal. Would you like me to help with something specific about your registration?",
        "I understand your concern. For AYUSH startups, the regulatory framework can be complex. Let me break it down for you — what specific area would you like to explore? I can help with registration, certification, funding, or export guidance.",
        "Thanks for reaching out! I specialize in AYUSH startup registration and compliance. Could you provide more details about what you're looking for? For instance, are you interested in funding schemes, certification requirements, or regulatory guidance?",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
};

const getNow = () => {
    const d = new Date();
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const schemes = [
    { icon: "monetization_on", title: "National AYUSH Mission", desc: "Financial assistance up to ₹50 Lakhs", color: "text-green-600", bg: "bg-green-50" },
    { icon: "science", title: "BIRAC BIG Grant", desc: "Biotechnology research funding", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: "school", title: "AYUSH Scholarship", desc: "Education & research support", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function SupportPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", text: "Hello! 👋 I'm the AYUSH Assistant. I can help you with registration, certification, funding schemes, and more. What would you like to know?", time: "Just now" },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const userMsg: Message = { role: "user", text: message.trim(), time: getNow() };
        setMessages((m) => [...m, userMsg]);
        const input = message.trim();
        setMessage("");
        setIsTyping(true);

        setTimeout(() => {
            const response = getAIResponse(input);
            setIsTyping(false);
            setMessages((m) => [...m, { role: "assistant", text: response, time: getNow() }]);
        }, 1000 + Math.random() * 1500);
    };

    return (
        <div className="flex h-screen bg-background-light font-display">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
                <div className="p-5 border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="material-icons text-primary-dark text-2xl">spa</span>
                        <span className="font-bold text-slate-900">AYUSH <span className="text-primary-dark">Portal</span></span>
                    </Link>
                </div>
                <nav className="flex-1 py-4 overflow-y-auto">
                    <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
                    <Link href="/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                        <span className="material-icons text-lg">dashboard</span> Dashboard
                    </Link>
                    <Link href="/dashboard/support" className="flex items-center gap-3 px-5 py-2.5 text-sm bg-primary/10 text-primary-dark font-medium border-r-2 border-primary">
                        <span className="material-icons text-lg">smart_toy</span> AI Support
                    </Link>
                    <Link href="/schemes" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                        <span className="material-icons text-lg">library_books</span> Schemes
                    </Link>

                    {/* Application Progress */}
                    <div className="mx-5 mt-6 p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Your Application</p>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">UNDER REVIEW</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-primary rounded-full w-3/4 transition-all duration-1000"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-right">75% Complete</p>
                    </div>

                    {/* Recommended Schemes */}
                    <div className="mx-5 mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Recommended Schemes</p>
                        <div className="space-y-2">
                            {schemes.map((s) => (
                                <div key={s.title} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                    <div className={`w-7 h-7 rounded-md ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                        <span className={`material-icons text-sm ${s.color}`}>{s.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">{s.title}</p>
                                        <p className="text-[10px] text-slate-400">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-icons text-primary-dark">smart_toy</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900">AYUSH Assistant</h2>
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-lg" title="Clear chat" onClick={() => setMessages([{ role: "assistant", text: "Chat cleared! How can I help you?", time: getNow() }])}>
                            <span className="material-icons text-slate-400 text-lg">delete_sweep</span>
                        </button>
                        <Link href="/dashboard" className="p-2 hover:bg-slate-50 rounded-lg">
                            <span className="material-icons text-slate-400 text-lg">close</span>
                        </Link>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] ${msg.role === "user" ? "order-1" : ""}`}>
                                {msg.role === "assistant" && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="material-icons text-primary-dark text-xs">smart_toy</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{msg.time}</span>
                                    </div>
                                )}
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === "user"
                                    ? "bg-primary text-slate-900 rounded-br-md"
                                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow-sm"
                                    }`}>
                                    {msg.text}
                                </div>
                                {msg.role === "user" && (
                                    <p className="text-[10px] text-slate-400 text-right mt-1">{msg.time}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Quick Suggestions */}
                <div className="px-6 pb-2 flex gap-2 flex-wrap">
                    {["What is AYUSH?", "Funding options", "How to get certified?", "Export guidance"].map((q) => (
                        <button key={q} onClick={() => { setMessage(q); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-primary/10 hover:border-primary/30 hover:text-primary-dark transition-all">
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="bg-white border-t border-slate-200 p-4">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                        <button className="p-2 hover:bg-slate-50 rounded-lg">
                            <span className="material-icons text-slate-400">attach_file</span>
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Ask me about AYUSH registration, funding, certification..."
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className={`p-2.5 rounded-xl transition-all ${message.trim() ? "bg-primary text-slate-900 hover:bg-primary-dark hover:text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}
                        >
                            <span className="material-icons">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
