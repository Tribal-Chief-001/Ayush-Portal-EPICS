"use client";

import Link from "next/link";
import { useState, useRef, FormEvent } from "react";
import { useToast } from "@/components/Toast";

const steps = ["BASIC INFO", "BUSINESS DETAILS", "DOCUMENTS", "REVIEW"];

interface FormData {
    // Step 1: Basic Info
    founderName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    // Step 2: Business Details
    startupName: string;
    ayushSector: string;
    dippNumber: string;
    incorporationDate: string;
    description: string;
    website: string;
    teamSize: string;
    state: string;
    city: string;
    // Step 3: Documents
    gstFile: File | null;
    clinicalFile: File | null;
    certFile: File | null;
}

const initialForm: FormData = {
    founderName: "", email: "", phone: "", password: "", confirmPassword: "",
    startupName: "", ayushSector: "", dippNumber: "", incorporationDate: "", description: "", website: "", teamSize: "", state: "", city: "",
    gstFile: null, clinicalFile: null, certFile: null,
};

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState<FormData>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [dragOver, setDragOver] = useState<string | null>(null);

    const gstRef = useRef<HTMLInputElement>(null);
    const clinicalRef = useRef<HTMLInputElement>(null);
    const certRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const set = (field: keyof FormData, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
        if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    };

    const setFile = (field: "gstFile" | "clinicalFile" | "certFile", file: File | null) => {
        setForm((f) => ({ ...f, [field]: file }));
        if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    };

    const validateStep = (step: number): boolean => {
        const errs: Record<string, string> = {};
        if (step === 0) {
            if (!form.founderName.trim()) errs.founderName = "Name is required";
            if (!form.email.trim()) errs.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
            if (!form.phone.trim()) errs.phone = "Phone is required";
            else if (!/^\d{10}$/.test(form.phone.replace(/[^0-9]/g, ""))) errs.phone = "Enter a valid 10-digit phone";
            if (!form.password) errs.password = "Password is required";
            else if (form.password.length < 8) errs.password = "Min 8 characters";
            if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
        }
        if (step === 1) {
            if (!form.startupName.trim()) errs.startupName = "Startup name is required";
            if (!form.ayushSector) errs.ayushSector = "Select an AYUSH sector";
            if (!form.incorporationDate) errs.incorporationDate = "Incorporation date is required";
            if (!form.description.trim()) errs.description = "Description is required";
            if (!form.state) errs.state = "State is required";
        }
        if (step === 2) {
            if (!form.gstFile) errs.gstFile = "GST Certificate is required";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const next = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
        }
    };

    const back = () => setCurrentStep((s) => Math.max(0, s - 1));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!agreeTerms) { setErrors({ terms: "You must agree to the terms" }); return; }
        setSubmitted(true);
        showToast("Registration submitted successfully!", "success");
    };

    const handleDrop = (field: "gstFile" | "clinicalFile" | "certFile") => (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(null);
        if (e.dataTransfer.files[0]) setFile(field, e.dataTransfer.files[0]);
    };

    const inputClass = (field: string) =>
        `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors[field] ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-primary/40"}`;

    // ─── SUCCESS SCREEN ──────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-background-light font-display flex items-center justify-center">
                <div className="max-w-md text-center p-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <span className="material-icons text-primary-dark text-4xl">check_circle</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Registration Submitted!</h1>
                    <p className="text-slate-500 mb-2">Your application <strong className="text-primary-dark">#{`AY-2024-${Math.floor(1000 + Math.random() * 9000)}`}</strong> has been received.</p>
                    <p className="text-sm text-slate-400 mb-8">Our team will review your documents within 3-5 business days. You&apos;ll receive email notifications at <strong>{form.email}</strong>.</p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard" className="px-6 py-2.5 bg-primary rounded-lg text-sm font-semibold text-slate-900 hover:bg-primary-dark hover:text-white transition-all shadow-sm">
                            Go to Dashboard
                        </Link>
                        <Link href="/" className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light font-display">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">A</div>
                        <span className="font-bold text-lg text-slate-900">AYUSH Startup <span className="text-primary-dark">Portal</span></span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="hidden sm:inline">Smart India Hackathon 2024</span>
                        <Link href="/login" className="px-4 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">Login</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Registration Wizard</h1>
                    <p className="text-slate-500">Complete the steps below to register your AYUSH startup.</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    {steps.map((step, index) => (
                        <div key={step} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${index < currentStep
                                    ? "bg-primary border-primary text-white"
                                    : index === currentStep
                                        ? "border-primary text-primary-dark bg-white"
                                        : "border-slate-300 text-slate-400 bg-white"
                                    }`}>
                                    {index < currentStep ? (
                                        <span className="material-icons text-lg">check</span>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`text-xs mt-2 font-semibold hidden sm:block ${index <= currentStep ? "text-primary-dark" : "text-slate-400"}`}>{step}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 sm:w-32 h-0.5 mx-2 mb-5 sm:mb-0 ${index < currentStep ? "bg-primary" : "bg-slate-200"}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">

                    {/* ─── STEP 1: BASIC INFO ─── */}
                    {currentStep === 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-icons text-primary-dark">person</span>
                                <h2 className="text-xl font-bold text-slate-900">Founder Information</h2>
                            </div>
                            <p className="text-slate-500 text-sm mb-8">Tell us about yourself to get started.</p>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                                    <input type="text" value={form.founderName} onChange={(e) => set("founderName", e.target.value)} placeholder="e.g., Vikram Patel" className={inputClass("founderName")} />
                                    {errors.founderName && <p className="text-xs text-red-500 mt-1">{errors.founderName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vikram@startup.com" className={inputClass("email")} />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-sm text-slate-500">+91</span>
                                        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98765 43210" className={`${inputClass("phone")} rounded-l-none`} />
                                    </div>
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>
                                <div></div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Create Password *</label>
                                    <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" className={inputClass("password")} />
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password *</label>
                                    <input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter password" className={inputClass("confirmPassword")} />
                                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── STEP 2: BUSINESS DETAILS ─── */}
                    {currentStep === 1 && (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-icons text-primary-dark">business</span>
                                <h2 className="text-xl font-bold text-slate-900">Business Details</h2>
                            </div>
                            <p className="text-slate-500 text-sm mb-8">Provide information about your AYUSH startup.</p>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Startup Name *</label>
                                    <input type="text" value={form.startupName} onChange={(e) => set("startupName", e.target.value)} placeholder="e.g., GreenLife Ayurveda Pvt. Ltd." className={inputClass("startupName")} />
                                    {errors.startupName && <p className="text-xs text-red-500 mt-1">{errors.startupName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">AYUSH Sector *</label>
                                    <select value={form.ayushSector} onChange={(e) => set("ayushSector", e.target.value)} className={inputClass("ayushSector")}>
                                        <option value="">Select Sector</option>
                                        <option value="Ayurveda">Ayurveda</option>
                                        <option value="Yoga">Yoga & Naturopathy</option>
                                        <option value="Unani">Unani</option>
                                        <option value="Siddha">Siddha</option>
                                        <option value="Homeopathy">Homeopathy</option>
                                    </select>
                                    {errors.ayushSector && <p className="text-xs text-red-500 mt-1">{errors.ayushSector}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">DIPP / Recognition Number</label>
                                    <input type="text" value={form.dippNumber} onChange={(e) => set("dippNumber", e.target.value)} placeholder="DIPP12345" className={inputClass("dippNumber")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Incorporation *</label>
                                    <input type="date" value={form.incorporationDate} onChange={(e) => set("incorporationDate", e.target.value)} className={inputClass("incorporationDate")} />
                                    {errors.incorporationDate && <p className="text-xs text-red-500 mt-1">{errors.incorporationDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Size</label>
                                    <select value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} className={inputClass("teamSize")}>
                                        <option value="">Select</option>
                                        <option value="1-5">1 - 5</option>
                                        <option value="6-20">6 - 20</option>
                                        <option value="21-50">21 - 50</option>
                                        <option value="50+">50+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State *</label>
                                    <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass("state")}>
                                        <option value="">Select State</option>
                                        {["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Maharashtra", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                                    <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g., Mumbai" className={inputClass("city")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                                    <input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://yourstartup.com" className={inputClass("website")} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Startup Description *</label>
                                    <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Briefly describe your startup's mission and products..." className={inputClass("description")} />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── STEP 3: DOCUMENTS ─── */}
                    {currentStep === 2 && (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-icons text-primary-dark">cloud_upload</span>
                                <h2 className="text-xl font-bold text-slate-900">Upload Required Documents</h2>
                            </div>
                            <p className="text-slate-500 text-sm mb-8">Please provide the following documents to verify your startup&apos;s eligibility under AYUSH guidelines. All files are securely encrypted.</p>

                            {/* GST Certificate */}
                            <div className="border-b border-slate-100 pb-6 mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900">GST Certificate *</h3>
                                    <span className="material-icons text-slate-400 text-base cursor-help" title="Required for tax verification">help_outline</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">Required for tax verification purposes.</p>
                                {form.gstFile ? (
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                                        <span className="material-icons text-red-500">picture_as_pdf</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{form.gstFile.name}</p>
                                            <p className="text-xs text-green-600 flex items-center gap-1">
                                                <span className="material-icons text-xs">check_circle</span> Uploaded ({(form.gstFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        </div>
                                        <button onClick={() => setFile("gstFile", null)} className="text-slate-400 hover:text-red-500">
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver("gst"); }}
                                        onDragLeave={() => setDragOver(null)}
                                        onDrop={handleDrop("gstFile")}
                                        onClick={() => gstRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver === "gst" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50"}`}
                                    >
                                        <input ref={gstRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && setFile("gstFile", e.target.files[0])} />
                                        <span className="material-icons text-slate-400 text-3xl mb-2">upload_file</span>
                                        <p className="text-sm"><span className="text-primary-dark font-medium">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG (max. 5MB)</p>
                                    </div>
                                )}
                                {errors.gstFile && <p className="text-xs text-red-500 mt-2">{errors.gstFile}</p>}
                            </div>

                            {/* Clinical Trial Data */}
                            <div className="border-b border-slate-100 pb-6 mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900">Clinical Trial Data</h3>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium">OPTIONAL</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">If applicable for your product category.</p>
                                {form.clinicalFile ? (
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                                        <span className="material-icons text-blue-500">description</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{form.clinicalFile.name}</p>
                                            <p className="text-xs text-green-600 flex items-center gap-1">
                                                <span className="material-icons text-xs">check_circle</span> Uploaded ({(form.clinicalFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        </div>
                                        <button onClick={() => setFile("clinicalFile", null)} className="text-slate-400 hover:text-red-500">
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver("clinical"); }}
                                        onDragLeave={() => setDragOver(null)}
                                        onDrop={handleDrop("clinicalFile")}
                                        onClick={() => clinicalRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver === "clinical" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50"}`}
                                    >
                                        <input ref={clinicalRef} type="file" accept=".pdf,.docx,.xlsx" className="hidden" onChange={(e) => e.target.files?.[0] && setFile("clinicalFile", e.target.files[0])} />
                                        <span className="material-icons text-slate-400 text-3xl mb-2">upload</span>
                                        <p className="text-sm"><span className="text-primary-dark font-medium">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX (max. 10MB)</p>
                                    </div>
                                )}
                            </div>

                            {/* AYUSH Certification */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900">AYUSH Certification</h3>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium">OPTIONAL</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">Proof of adherence to AYUSH guidelines.</p>
                                {form.certFile ? (
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                                        <span className="material-icons text-green-500">verified</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{form.certFile.name}</p>
                                            <p className="text-xs text-green-600 flex items-center gap-1">
                                                <span className="material-icons text-xs">check_circle</span> Uploaded ({(form.certFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        </div>
                                        <button onClick={() => setFile("certFile", null)} className="text-slate-400 hover:text-red-500">
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver("cert"); }}
                                        onDragLeave={() => setDragOver(null)}
                                        onDrop={handleDrop("certFile")}
                                        onClick={() => certRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver === "cert" ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-primary/50"}`}
                                    >
                                        <input ref={certRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && setFile("certFile", e.target.files[0])} />
                                        <span className="material-icons text-slate-400 text-3xl mb-2">cloud_upload</span>
                                        <p className="text-sm"><span className="text-primary-dark font-medium">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG (max. 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─── STEP 4: REVIEW ─── */}
                    {currentStep === 3 && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-icons text-primary-dark">fact_check</span>
                                <h2 className="text-xl font-bold text-slate-900">Review & Submit</h2>
                            </div>
                            <p className="text-slate-500 text-sm mb-8">Please verify all information before submitting your application.</p>

                            {/* Founder Info Review */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Founder Information</h3>
                                    <button type="button" onClick={() => setCurrentStep(0)} className="text-xs text-primary-dark font-medium hover:underline">Edit</button>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 grid sm:grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900 ml-1">{form.founderName}</span></div>
                                    <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900 ml-1">{form.email}</span></div>
                                    <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-900 ml-1">+91 {form.phone}</span></div>
                                </div>
                            </div>

                            {/* Business Info Review */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Business Details</h3>
                                    <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-primary-dark font-medium hover:underline">Edit</button>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 grid sm:grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-slate-500">Startup:</span> <span className="font-medium text-slate-900 ml-1">{form.startupName}</span></div>
                                    <div><span className="text-slate-500">Sector:</span> <span className="font-medium text-slate-900 ml-1">{form.ayushSector}</span></div>
                                    <div><span className="text-slate-500">DIPP:</span> <span className="font-medium text-slate-900 ml-1">{form.dippNumber || "—"}</span></div>
                                    <div><span className="text-slate-500">Incorporated:</span> <span className="font-medium text-slate-900 ml-1">{form.incorporationDate}</span></div>
                                    <div><span className="text-slate-500">Location:</span> <span className="font-medium text-slate-900 ml-1">{form.city ? `${form.city}, ` : ""}{form.state}</span></div>
                                    <div><span className="text-slate-500">Team:</span> <span className="font-medium text-slate-900 ml-1">{form.teamSize || "—"}</span></div>
                                    <div className="sm:col-span-2"><span className="text-slate-500">Description:</span> <span className="font-medium text-slate-900 ml-1">{form.description}</span></div>
                                </div>
                            </div>

                            {/* Documents Review */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Documents</h3>
                                    <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-primary-dark font-medium hover:underline">Edit</button>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-green-500 text-base">check_circle</span>
                                        <span className="text-slate-700">GST Certificate: <strong>{form.gstFile?.name}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {form.clinicalFile ? (
                                            <>
                                                <span className="material-icons text-green-500 text-base">check_circle</span>
                                                <span className="text-slate-700">Clinical Trial Data: <strong>{form.clinicalFile.name}</strong></span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons text-slate-300 text-base">remove_circle_outline</span>
                                                <span className="text-slate-400">Clinical Trial Data: Not uploaded</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {form.certFile ? (
                                            <>
                                                <span className="material-icons text-green-500 text-base">check_circle</span>
                                                <span className="text-slate-700">AYUSH Certification: <strong>{form.certFile.name}</strong></span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons text-slate-300 text-base">remove_circle_outline</span>
                                                <span className="text-slate-400">AYUSH Certification: Not uploaded</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); if (errors.terms) setErrors({}); }} className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary" />
                                    <span className="text-sm text-slate-600">
                                        I certify that the information provided is accurate and I agree to the <a href="#" className="text-primary-dark font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-primary-dark font-medium hover:underline">Privacy Policy</a> of the AYUSH Startup Portal.
                                    </span>
                                </label>
                                {errors.terms && <p className="text-xs text-red-500 mt-2 ml-7">{errors.terms}</p>}
                            </div>

                            <button type="submit" className="w-full py-3 bg-primary rounded-lg text-sm font-bold text-slate-900 hover:bg-primary-dark hover:text-white transition-all shadow-sm shadow-primary/30 flex items-center justify-center gap-2">
                                <span className="material-icons text-lg">send</span> Submit Application
                            </button>
                        </form>
                    )}

                    {/* Navigation (non-review steps) */}
                    {currentStep < 3 && (
                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
                            <button
                                onClick={back}
                                disabled={currentStep === 0}
                                className={`inline-flex items-center px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium transition-colors ${currentStep === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                                <span className="material-icons text-sm mr-1">arrow_back</span> Back
                            </button>
                            <div className="text-xs text-slate-400 hidden sm:block">Step {currentStep + 1} of {steps.length}</div>
                            <button
                                onClick={next}
                                className="inline-flex items-center px-8 py-2.5 bg-primary rounded-lg text-sm font-semibold text-slate-900 hover:bg-primary-dark hover:text-white transition-all shadow-sm shadow-primary/30"
                            >
                                Save & Next <span className="material-icons text-sm ml-1">arrow_forward</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Help Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-icons text-blue-600 text-sm">info</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900">Need Help?</h4>
                            <p className="text-xs text-slate-500">Refer to the <a href="#" className="text-primary-dark font-medium hover:underline">Official AYUSH Guidelines</a> for document templates.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-icons text-amber-600 text-sm">shield</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900">Data Privacy</h4>
                            <p className="text-xs text-slate-500">Your documents are encrypted and only accessible by the verification committee.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 text-xs text-slate-400">
                    © 2024 AYUSH Startup Portal. All rights reserved.
                </div>
            </main>
        </div>
    );
}
