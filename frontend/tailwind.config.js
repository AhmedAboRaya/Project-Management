/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          text: '#080c0d',
          bg: '#f7fafb',
          primary: '#5aa7b9',
          secondary: '#9cd1dd',
          accent: '#6bc4d8',
        },
        dark: {
          text: '#f2f6f7',
          bg: '#030607',
          primary: '#4693a4',
          secondary: '#225763',
          accent: '#288195',
        },
      },
    },
  },
  plugins: [],
}
