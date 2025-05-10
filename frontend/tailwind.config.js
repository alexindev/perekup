/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E85B01',
        dark: '#3C3C3C',
        light: '#DFDFDF',
        border: '#CEC4C3',
        text: '#A39594',
      },
    },
  },
  plugins: [],
} 