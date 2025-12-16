/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ecofy: {
          primary: '#22c55e',
          secondary: '#16a34a',
          dark: '#15803d',
          light: '#86efac',
          accent: '#dcfce7',
        },
      },
    },
  },
  plugins: [],
}
