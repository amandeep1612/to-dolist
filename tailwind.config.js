/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff1f5",
          100: "#ffe4ec",
          200: "#fecddc",
          300: "#fda4bf",
          400: "#fb719c",
          500: "#f23f7b",
          600: "#db235f",
          700: "#b7184d",
          800: "#951543",
          900: "#80143f"
        }
      }
    }
  },
  plugins: []
};
