/** @type {import('tailwindcss').Config} */
import tailwindcss from 'tailwindcss';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4F46E5",
                    dark: "#4338CA"
                },
                secondary: {
                    DEFAULT: "#6366F1",
                    dark: "#4F46E5"
                },
                background: {
                    DEFAULT: "#F9FAFB",
                    dark: "#111827"
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    dark: "#1F2937"
                },
                text: {
                    primary: {
                        DEFAULT: "#1E293B",
                        dark: "#F9FAFB"
                    },
                    secondary: {
                        DEFAULT: "#64748B",
                        dark: "#E5E7EB"
                    }
                },
                status: {
                    completed: '#16a34a',
                    scheduled: '#2563eb',
                    cancelled: '#dc2626',
                    ongoing: '#7c3aed',
                    rescheduled: '#f59e0b',
                    draft: '#64748b'
                },
            },
            fontFamily: {
                sans: ['"Open Sans"', 'sans-serif'],
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                'card-dark': '0 1px 3px rgba(255,255,255,0.12), 0 1px 2px rgba(255,255,255,0.24)'
            }
        },
    },
    plugins: [
        tailwindcss,
        typography,
        forms,
        daisyui
    ],
}