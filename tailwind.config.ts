import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                crtz: {
                    yellow: '#ffffff', // User requested white
                    black: '#0D223D',  // Deep Navy (Updated)
                    grey: '#1a2b4b',   // Slightly lighter shade of #0D223D
                    red: '#ff0000',
                }
            },
            fontFamily: {
                courier: ['var(--font-courier)'],
                orbitron: ['var(--font-orbitron)'],
            }
        },
    },
    plugins: [],
};
export default config;
