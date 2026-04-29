import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        gold: '#C9A227',
        paper: '#F8FAFC',
      },
    },
  },
  plugins: [],
};

export default config;
