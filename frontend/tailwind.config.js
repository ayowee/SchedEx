// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
    extend: {
        colors: {
            primary: "#4F46E5", // Notion Purple
            secondary: "#6366F1", // Lighter Purple
            background: "#F9FAFB", // Light Gray Background
            textDark: "#1E293B", // Dark Text
            textLight: "#64748B", // Light Text
            success: "#10B981", // Green
            danger: "#EF4444", // Red
        },
    },
};
export const plugins = [];