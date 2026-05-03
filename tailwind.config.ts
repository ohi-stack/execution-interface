import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#040816',
        neon: '#67e8f9',
        sovereign: '#a78bfa'
      }
    }
  },
  plugins: []
};

export default config;
