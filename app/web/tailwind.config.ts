import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "2/1": "2 / 1"
      }
    },
  },
  plugins: [],
} satisfies Config;
