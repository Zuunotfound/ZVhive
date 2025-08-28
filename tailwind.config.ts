import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4C4C6D',
          50: '#F5F5F8',
          100: '#E9E9F0',
          200: '#CFCFDD',
          300: '#B5B5CA',
          400: '#7F7FA1',
          500: '#4C4C6D',
          600: '#3D3D57',
          700: '#2E2E41',
          800: '#1F1F2B',
          900: '#101016'
        }
      }
    },
  },
  plugins: [],
} satisfies Config