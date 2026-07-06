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
        gold: { DEFAULT:'#D4A017', light:'#F5C842', dark:'#A07810' },
      },
      fontFamily: {
        display: ['var(--font-playfair)','Georgia','serif'],
        body:    ['var(--font-dm-sans)','system-ui','sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017, #F5C842)',
      },
      boxShadow: {
        gold:      'var(--shadow-gold)',
        'gold-sm': 'var(--shadow-gold-sm)',
        card:      'var(--shadow-card)',
        'card-lg': 'var(--shadow-card-lg)',
      },
    },
  },
  plugins: [],
};
