import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F2",
        "paper-line": "#DEDBCE",
        ink: "#20293A",
        "ink-soft": "#5C6570",
        mastery: "#2F6F4E",
        "mastery-soft": "#E4EEE7",
        attention: "#B8792F",
        "attention-soft": "#F5E9D6",
        risk: "#9C3B2E",
        "risk-soft": "#F3E1DD",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
