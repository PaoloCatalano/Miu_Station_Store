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
      boxShadow: {
        out: "inset 1px 1px 1px #ffffff60, inset -1px -1px 1px rgba(94, 104, 121, 0.692)",
        in: "inset -1px -1px 1px #ffffff60, inset 1px 1px 1px rgba(94, 104,121, 0.692)",
      },
      transformOrigin: {
        "left-center": "left center",
        "right-center": "right center",
      },
      colors: {
        "miu-50": "#d1ecf1",
        "miu-100": "#a2dae3",
        "miu-200": "#8ad0db",
        "miu-300": "#74c7d4",
        "miu-400": "#45b5c6",
        "miu-500": "#17a2b8",
        "miu-600": "#128293",
        "miu-700": "#0e616e",
        "miu-800": "#09414a",
        "miu-900": "#052025",
      },
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
        "boeing-once": "boeing 3s linear 1",
      },
    },
  },
  plugins: [],
};
