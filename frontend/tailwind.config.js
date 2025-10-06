/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#6ee7b7",
          600: "#34d399",
          700: "#10b981"
        }
      }
    },
  },
  plugins: [],
}
