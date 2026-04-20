/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: '#13131F',
        card: '#1C1C2E',
        glass: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.08)',
        borderGreen: 'rgba(0,196,140,0.35)',
        primary: '#00C48C',
        greenGlow: 'rgba(0,196,140,0.12)',
        amber: '#F5A623',
        red: '#FF4D6A',
        blue: '#4A9EFF',
        textPrimary: '#F0F0F5',
        textSecondary: '#8A8A9A',
        textMono: '#00C48C',
      },
      fontFamily: {
        heading: ['Syne_700Bold'],
        body: ['PlusJakartaSans_400Regular'],
        bodyMed: ['PlusJakartaSans_500Medium'],
        bodySemi: ['PlusJakartaSans_600SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
      }
    },
  },
  plugins: [],
}
