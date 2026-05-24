/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        tinto: {
          dark: '#0a0a0a',
          card: '#141414',
          accent: '#d4af37',
        }
      }
    },
  },
  plugins: [],
}