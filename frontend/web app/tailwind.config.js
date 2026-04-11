/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'leather': '#a06a45',
        'stone': '#e0d8c8',
        'paper': '#fcfaf5',
        'wood': '#d4bda5',
        'sticky-yellow': '#fef08a',
        'sticky-pink': '#fbcfe8',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        handwritten: ['"Patrick Hand"', '"Caveat"', '"Comic Sans MS"', 'cursive'],
      },
      boxShadow: {
        'inner-lg': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
