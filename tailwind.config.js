/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: '#f7941d', dark: '#e07a00', light: '#ffa940' },
        green:  { dark: '#00242B', mid: '#003d30' },
        navy:   '#081c2e',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        body:    ["'Nunito Sans'", 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        orange: '0 6px 20px rgba(247,148,29,0.35)',
      },
    },
  },
  plugins: [],
};
