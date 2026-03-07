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
          500: '#1e40af', // Deep blue
          600: '#1d4ed8',
          700: '#1e3a8a'
        },
        accent: {
          400: '#fbbf24', // Amber
          500: '#f59e0b',
          600: '#d97706'
        }
      }
    },
  },
  plugins: [],
}