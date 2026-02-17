/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#3D2B14',
          dark2: '#5A4228',
          dark3: '#6B5238',
          dark4: '#7D6548',
          brown: '#ccb27f',
          'brown-hover': '#714c20',
          gold: '#8B7D3C',
          'gold-light': '#9E8E4A',
        },
        neutral: {
          50: '#faf8f5',
          100: '#f0ebe3',
          200: '#e0d8cc',
          300: '#b8ad9e',
          400: '#8a7e6e',
          500: '#5c5345',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1320px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
