/* eslint-disable @typescript-eslint/no-explicit-any */
type TailwindConfig = {
    content: string[];
    theme: { extend: Record<string, any> };
    plugins: any[];
};

const config: TailwindConfig = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2bee6c",
                "primary-dark": "#23bf56",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
                "surface-light": "#ffffff",
                "surface-dark": "#1a3322",
            },
            fontFamily: {
                display: ["Public Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
                full: "9999px",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out forwards",
            },
        },
    },
    plugins: [],
};

export default config;
