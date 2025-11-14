/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}', // app directory inside src
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}', // if pages used later
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
  