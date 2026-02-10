/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
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
