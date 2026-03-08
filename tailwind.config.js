/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1ED',   // Musical Orange - Subtle
          100: '#FFF1ED',  // Musical Orange - Light background
          500: '#FF6B35',  // Musical Orange - Main
          600: '#FF8C5A',  // Musical Orange - Light
          700: '#E55A2E'   // Musical Orange - Dark
        },
        secondary: {
          50: '#F0F7FF',   // Deep Chord Blue - Subtle
          100: '#F0F7FF',  // Deep Chord Blue - Light background
          500: '#2C5282',  // Deep Chord Blue - Main
          600: '#4A90C2',  // Deep Chord Blue - Light
          700: '#234468'   // Deep Chord Blue - Dark
        },
        accent: {
          50: '#F0FFF4',   // Progress Green - Subtle
          500: '#48BB78',  // Progress Green - Main
          600: '#68D391',  // Progress Green - Light
          700: '#38A169'   // Progress Green - Dark
        }
      }
    },
  },
  plugins: [],
}