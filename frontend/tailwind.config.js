/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'], // Default font
        dyslexic: ['OpenDyslexic', 'Comic Sans MS'], // Dyslexic font
      },
    },
  },
  plugins: [],
};
