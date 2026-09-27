import type { Config } from "tailwindcss";

// Design tokens for Ambagan. The palette and type pairing are documented in
// README.md under "Design direction" — read that before adding new colors
// or fonts so the system stays coherent as we build out donor/Katiwala UI.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F3",
        ink: "#1C1B18",
        muted: "#6B6459",
        teal: {
          DEFAULT: "#1F5F5B",
          dark: "#163F3C",
        },
        gold: {
          DEFAULT: "#D9A441",
          dark: "#B8842F",
        },
        line: "#DED7C8",
        danger: "#A8402F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
