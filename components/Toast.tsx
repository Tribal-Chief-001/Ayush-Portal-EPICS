"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

let toastId = 0;

const icons: Record<ToastType, string> = {
    success: "check_circle",
    error: "error",
    info: "info",
};

const colors: Record<ToastType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto animate-slide-up flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-medium min-w-[280px] max-w-sm"
                        style={{ backgroundColor: colors[toast.type] === "bg-green-600" ? "#16a34a" : colors[toast.type] === "bg-red-600" ? "#dc2626" : "#2563eb" }}
                    >
                        <span className="material-icons text-lg">{icons[toast.type]}</span>
                        <span className="flex-1">{toast.message}</span>
                        <button
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
