/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                midl: {
                    gold: "#F7931A",
                    dark: "#0F0F0F",
                    card: "#1A1A1A",
                },
            },
        },
    },
    plugins: [],
};
