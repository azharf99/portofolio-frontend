/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwind v4 is CSS-first: the design tokens (colors, fonts) live in the
  // @theme block in src/index.css, not here — a JS theme.extend is silently
  // ignored in v4 unless imported via @config, which this project doesn't do.
  theme: {
    extend: {},
  },
  plugins: [],
}
