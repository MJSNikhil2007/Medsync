/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0f1d",      // Deep space black
          card: "#131b2e",      // Rich dark slate for cards
          border: "#1e293b",    // Slate-800 border
          text: "#94a3b8",      // Muted text color
          highlight: "#10b981", // Emerald accent
          accent: "#06b6d4",    // Cyan accent
          warning: "#f59e0b",   // Amber/Gold
          danger: "#ef4444"     // Crimson
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-emerald": "0 8px 32px 0 rgba(16, 185, 129, 0.15)",
        "glass-cyan": "0 8px 32px 0 rgba(6, 182, 212, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      }
    },
  },
  plugins: [],
}
