import type { Config } from 'tailwindcss';
import preset from '@runic-rpc/ui/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@runic-rpc/ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      // Match website accent colors (used across the UI preset via `cyan-*` utilities)
      colors: {
        cyan: {
          primary: '#FE4037',
          light: '#FF5A4F',
          glow: 'rgba(254, 64, 55, 0.15)',
        },
      },
    },
  },
};

export default config;
