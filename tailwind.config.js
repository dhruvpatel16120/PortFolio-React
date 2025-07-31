/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientY: {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        gradientXY: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'gradient-x': 'gradientX 2s ease infinite',
        'gradient-y': 'gradientY 2s ease infinite',
        'gradient-xy': 'gradientXY 2s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      backgroundSize: {
        '400': '400% 400%', // makes the gradient animate smoothly
      },
      colors: {
        // Text colors
        lightText: '#041125ff',
        darkText: '#ffffff',

        // Accent colors
        lightAccent: '#09154eff',  // gold for hover in light mode
        darkAccent: '#ffffffff',   // darker muted gold for dark mode

        // Light mode gradient colors
        lightBgFrom:  '#71dbd4ff',
        lightBgVia: '#4c82e6ff',
        lightBgTo: '#5c5cf3ff',

        // Dark mode: darker versions of same colors
        darkBgFrom:  '#2b6b6b',
        darkBgVia: '#3d5a80',
        darkBgTo: '#3f3f83',
      }
    },
  },
  plugins: [],
}
