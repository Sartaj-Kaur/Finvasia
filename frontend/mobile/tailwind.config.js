/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Onboarding screen palette — "vellum & walnut ink"
        paper:      '#F5EFE3',   // Slightly warm off-white — aged paper, not #FFF
        paperLight: '#EDE0C8',   // One shade warmer — vellum fill tints
        terra:      '#C1673A',   // Terracotta — primary CTA (replaces generic gold)
        sand:       '#D4A96A',   // Warm sand — secondary highlights
        walnut:     '#3E2C1E',   // Deep walnut ink — text on paper
        ink:        '#1C1714',   // Deepest ink
        fog:        '#A89070',   // Muted label text
        hairline:   '#D4C4B0',   // Subtle borders / underlines
        moss:       '#5A8A68',   // Dried moss green
        crimson:    '#A84040',   // Aged crimson
      },
      fontFamily: {
        sans: ['System'],
        serif: ['serif'],
      }
    },
  },
  plugins: [],
}
