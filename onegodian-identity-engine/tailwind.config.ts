import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#080808',
        gold: '#d5b773',
        graphite: '#141414'
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(213,183,115,0.25), transparent 55%)'
      },
      boxShadow: {
        luxe: '0 0 0 1px rgba(213,183,115,0.25), 0 12px 42px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};

export default config;
