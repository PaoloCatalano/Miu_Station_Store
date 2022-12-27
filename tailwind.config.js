/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
        boeing: {
          "0%": {
            transform: "translateX(0%)",
          },
          "2%": {
            transform: "translateX(5%)",
          },
          "4%": {
            transform: "translateX(-5%)",
          },
          "6%": {
            transform: "translateX(2%)",
          },
          "8%": {
            transform: "translateX(-2%)",
          },
          "10%": {
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in 1",
        boeing: "boeing 3s linear infinite",
      },
    },
  },
  plugins: [],
};
