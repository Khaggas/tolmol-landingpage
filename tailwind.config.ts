import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#030712",
        mist: "#f8fbff",
        cyanline: "#2563eb",
        volt: "#ffffff",
        violet: "#1e40af"
      },
      boxShadow: {
        glow: "0 0 10px rgba(37, 99, 235, 0.04)",
        card: "0 1px 3px rgba(15, 23, 42, 0.025)",
        form: "0 12px 32px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.04)"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
