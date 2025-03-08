/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          light: '#2a2a3e',
        },
        accent: {
          pink: '#FF0080',
          red: '#FF4D4D',
        },
      },
      backgroundImage: {
        'gradient-border': 'linear-gradient(to right, #FF0080, #FF4D4D)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
} 