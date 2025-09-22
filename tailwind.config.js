/** @type {import('tailwindcss').Config} */
module.exports = {
  // В v4 сканирование файлов автоматическое, content можно опустить.
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2F80ED', dark: '#1C6DD0', light: '#EAF2FF' },
      },
    },
  },
  plugins: [],
};
