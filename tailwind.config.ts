import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#030712',
        midnight: '#07111f',
        obsidian: '#05050a',
        gold: {
          100: '#fff4bf',
          200: '#f8df86',
          300: '#eac85a',
          400: '#c99a2e',
          500: '#9f741d'
        },
        neon: '#67e8f9',
        sovereign: '#a78bfa',
        royal: '#7c3aed'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif']
      },
      boxShadow: {
        sovereign: '0 24px 80px rgba(5, 5, 10, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        gold: '0 18px 60px rgba(234, 200, 90, 0.16)'
      }
    }
  },
  plugins: []
};

export default config;
