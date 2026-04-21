/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0a',
        'neon-purple': '#b026ff',
        'neon-blue': '#00d4ff',
        'neon-green': '#6dff67',
        'neon-yellow': '#ffe45c',
      },
    },
  },
  plugins: [],
};
