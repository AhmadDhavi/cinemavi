/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a', // Slate 900
        primary: '#6366f1', // Indigo 500
      }
    },
  },
  plugins: [],
}