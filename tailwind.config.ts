import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Healing Space Color Palette ===
        moss: {
          DEFAULT: '#3D6B52',
          light: '#E0EDE5',
          dark: '#1E3D2A',
        },
        cream: {
          DEFAULT: '#F7F4EE',
          2: '#EFE9DC',
          3: '#E4DBC8',
        },
        dusk: {
          DEFAULT: '#4A3F6B',
          light: '#E8E3F5',
          dark: '#251E3A',
        },
        sky: {
          DEFAULT: '#3A7CA5',
          light: '#E0EEF8',
          dark: '#1A4A6A',
        },
        sand: {
          DEFAULT: '#B08050',
          light: '#F5EBD8',
          dark: '#7A5530',
        },
        dawn: {
          DEFAULT: '#B06038',
          light: '#F5E5D8',
          dark: '#7A3A1A',
        },
        rose: {
          DEFAULT: '#7A3A50',
          light: '#F5E0E8',
          dark: '#4A1A28',
        },
        ink: '#2A2520',
        muted: '#6A5F52',
        hint: '#9A8E82',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
