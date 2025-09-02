/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#0066cc",
        secondary: "#1a1a1a",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
