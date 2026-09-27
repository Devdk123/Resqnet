/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#071521',
        panel: '#0e1c2b',
        accent: '#20c3ff',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#60a5fa'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96,165,250,.4), 0 20px 40px rgba(32,195,255,.18)'
      }
    }
  },
  plugins: []
};
