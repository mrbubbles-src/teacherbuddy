import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#ffffff',
          font: '#000000',
          primary: '#1b39c9',
          secondary: '#ff6001',
        },
      },
    },
  },
  plugins: [],
};
export default config;
