/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0D0D0D',       // Primary dark background
          charcoal: '#171717',   // Card & section elevated background
          elevated: '#212121',   // Modal/drawer background
          border: '#2E2E2E',     // Subtle border line
          cream: '#FAF7F2',      // Warm primary light text
          ivory: '#ECE6DA',      // Body secondary text
          muted: '#A39E93',      // Muted label text
          saffron: '#D97706',    // Saffron accent (warm amber/orange)
          burgundy: '#5C1D24',   // Burgundy primary accent
          burgundyHover: '#4A161D',
          brass: '#C5A059',      // Warm brass/gold accent (used sparingly)
          brassHover: '#B38E47',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.75',
      }
    },
  },
  plugins: [],
}
