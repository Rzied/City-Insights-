/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "'Times New Roman'", "serif"],
        body: ["'Sora'", "'Helvetica Neue'", "sans-serif"],
      },
      colors: {
        ink: "#0B0F1A",
        fog: "#F5F7FB",
        aurora: "#7CFFB2",
        tide: "#6EC1FF",
        ember: "#FFB86B",
        blush: "#FF7BA9",
      },
      boxShadow: {
        glow: "0 20px 45px -30px rgba(110, 193, 255, 0.8)",
      },
    },
  },
  plugins: [],
}
