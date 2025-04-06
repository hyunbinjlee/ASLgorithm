/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in-from-top": "slideInFromTop 3s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        slideInFromTop: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "40%": {
            transform: "translateY(-20%)",
            opacity: "0.3",
          },
          "70%": {
            transform: "translateY(0)",
            opacity: "0.7",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
};
