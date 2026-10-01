/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pastel Beige, Green & Cream Brand Palette
        cream:  { DEFAULT: '#FAF8F5', 50: '#FFFFFF', 100: '#FAF8F5', 200: '#F4F0E8', 300: '#ECE5D8' },
        beige:  { DEFAULT: '#E3DAC9', 50: '#FBF9F5', 100: '#F5F0E8', 200: '#EAE3D6', 300: '#D7CABE', 400: '#C4B5A2', 500: '#AFA08D' },
        sage:   { DEFAULT: '#8FA888', 50: '#F4F8F3', 100: '#EAF2E8', 200: '#D2E3CF', 300: '#B5CEB1', 400: '#8FA888', 500: '#688661', 600: '#536E4D', 700: '#3D5438' },
        forest: { DEFAULT: '#2D4233', 100: '#4A6B53', 200: '#3D5944', 300: '#2D4233', 400: '#1E2B20', 500: '#141E16' },
        // Legacy aliases mapped smoothly
        mist:   { DEFAULT: '#E3DAC9', 100: '#F5F0E8', 200: '#EAE3D6', 300: '#D7CABE' },
        blue:   { DEFAULT: '#5A7A56', 400: '#8FA888', 500: '#688661', 600: '#536E4D', 700: '#3D5438' },
        navy:   { DEFAULT: '#1E2B20', 400: '#3D5944', 500: '#2D4233', 600: '#1E2B20', 700: '#141E16' },
        // Keep semantic accents
        rose:   { 50: '#FDF4F2', 100: '#FBE8E5', 200: '#F6CECA', 400: '#E58A80', 500: '#C85A4E', 600: '#B24539' },
        amber:  { 50: '#FDF9EC', 100: '#F9F1D4', 400: '#E5C05B', 500: '#C99D32', 600: '#A97E20' },
        emerald:{ 50: '#F2F8F1', 100: '#E2F0E0', 400: '#8FA888', 500: '#688661', 600: '#4E6D48' },
        slate:  {
          50: '#FAF8F5', 100: '#F4F0E8', 200: '#EAE3D6', 300: '#D7CABE',
          400: '#AFA08D', 500: '#8C9B8E', 600: '#5E7363', 700: '#3D5438',
          800: '#2D4233', 900: '#1E2B20', 950: '#141E16',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(45, 66, 51, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(45, 66, 51, 0.12)',
        'glass-xl': '0 24px 64px 0 rgba(45, 66, 51, 0.16)',
        '3d': '0 20px 50px -12px rgba(45, 66, 51, 0.15), 0 4px 16px -4px rgba(45, 66, 51, 0.08)',
        '3d-sm': '0 8px 24px -4px rgba(45, 66, 51, 0.12), 0 2px 8px -2px rgba(45, 66, 51, 0.06)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.7)',
        'card': '0 2px 8px rgba(45, 66, 51, 0.05), 0 1px 2px rgba(45, 66, 51, 0.03)',
        'card-hover': '0 12px 28px rgba(45, 66, 51, 0.10), 0 2px 6px rgba(45, 66, 51, 0.05)',
        'btn': '0 4px 14px 0 rgba(83, 110, 77, 0.35)',
        'btn-navy': '0 4px 14px 0 rgba(30, 43, 32, 0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #2D4233 0%, #3B5441 50%, #536E4D 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,253,249,0.95) 0%, rgba(244,240,232,0.85) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
        'navy-gradient': 'linear-gradient(135deg, #1E2B20 0%, #2D4233 50%, #3B5441 100%)',
        'blue-gradient': 'linear-gradient(135deg, #4A6B53 0%, #688661 50%, #8FA888 100%)',
        'surface-gradient': 'linear-gradient(160deg, #FAF8F5 0%, #EAE3D6 100%)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        pulse3d: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 14px rgba(63,114,175,0.3)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 8px 28px rgba(63,114,175,0.5)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.5s ease-out both',
        'slide-down': 'slideDown 0.2s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-3d': 'pulse3d 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
