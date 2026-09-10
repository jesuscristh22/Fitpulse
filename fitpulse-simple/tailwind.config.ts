import type { Config } from "tailwindcss";
import { colors } from "./lib/design-tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        carbon: colors.carbon,
        graphite: colors.graphite,
        gold: colors.gold,
        "gold-light": colors.goldLight,
        silver: colors.silver,
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
