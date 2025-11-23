import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                base: {
                    blue: '#0052FF', // Official Base blue
                    cyan: '#00f0ff', // User requested accent
                    dark: '#050505',
                    card: '#111111',
                    border: '#333333',
                },
                doodle: {
                    pink: '#FF9F9F',
                    purple: '#B084FF',
                    yellow: '#FFF385',
                    green: '#9EFFFA',
                    orange: '#FFB86C',
                },
            },
            backgroundImage: {
                'gradient-doodle': 'linear-gradient(135deg, #00f0ff 0%, #B084FF 100%)',
                'gradient-soft': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            },
            boxShadow: {
                'doodle': '4px 4px 0px 0px rgba(0, 240, 255, 1)',
                'doodle-sm': '2px 2px 0px 0px rgba(0, 240, 255, 1)',
                'doodle-pink': '4px 4px 0px 0px #FF9F9F',
                'doodle-purple': '4px 4px 0px 0px #B084FF',
                'doodle-white': '4px 4px 0px 0px rgba(255, 255, 255, 0.5)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'bounce-soft': 'bounce-soft 2s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
                    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
