/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./App.jsx",
        "./main.jsx",
    ],
    theme: {
        extend: {
            colors: {
                // Client Brand Palette
                brand: {
                    sand: '#EFE9DF',       // Primary Background
                    beige: '#E2DACF',      // Secondary Neutral (cards/sections)
                    sage: '#8FA99B',       // Primary Sage (icons/highlights)
                    deepSage: '#6F8F84',   // Deep Sage (headings/selected)
                    slate: '#2F4A5C',      // Authority Blue (accents)
                },
                // Primary Brand Colors (Original for compatibility)
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                // Accent Colors
                accent: {
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    amber: '#f59e0b',
                    pink: '#ec4899',
                },
            },
            fontFamily: {
                sans: ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
                display: ['"Outfit"', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                'brand-gradient': 'linear-gradient(135deg, #8FA99B 0%, #6F8F84 100%)',
            },
            boxShadow: {
                'glow': '0 0 32px rgba(143, 169, 155, 0.3)',
                'glow-lg': '0 0 48px rgba(143, 169, 155, 0.5)',
                'glass': '0 8px 32px 0 rgba(111, 143, 132, 0.2)',
                'neumorph': '12px 12px 24px rgba(0,0,0,0.05), -12px -12px 24px rgba(255,255,255,0.5)',
                'brand': '0 20px 40px -15px rgba(47, 74, 92, 0.15)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(143, 169, 155, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(143, 169, 155, 0.6)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

