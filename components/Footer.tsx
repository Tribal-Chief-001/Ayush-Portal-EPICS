import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary-dark text-4xl">spa</span>
                            <span className="font-bold text-2xl text-slate-900">AYUSH Portal</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
                            An initiative by the Ministry of Ayush to promote startup culture in the traditional medicine sector of India.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="text-sm font-bold">in</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="text-sm font-bold">tw</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-slate-900 transition-colors">
                                <span className="text-sm font-bold">fb</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/schemes" className="hover:text-primary transition-colors">Schemes</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Media Kit</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex items-start gap-3">
                                <span className="material-icons text-base mt-0.5">location_on</span>
                                <span>AYUSH Bhawan, B Block, GPO Complex, INA, New Delhi</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-base">email</span>
                                <span>support@ayush.gov.in</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-icons text-base">call</span>
                                <span>1800-11-22-33</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 text-center md:text-left">
                        © 2024 Ministry of Ayush. All rights reserved. | <a href="#" className="underline hover:text-slate-800">Privacy Policy</a> | <a href="#" className="underline hover:text-slate-800">Terms of Use</a>
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Designed for</span>
                        <span className="font-bold text-slate-600">SIH 2024</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
