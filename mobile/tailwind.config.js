/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        apple: {
          background: "#F2F2F7", // Apple Notes list background
          card: "#FFFFFF",
          text: "#000000",
          accent: "#D4A017", // Apple Notes gold/yellow
          secondary: "#8E8E93",
          separator: "#C6C6C8",
        },
      },
    },
  },
  plugins: [],
}
