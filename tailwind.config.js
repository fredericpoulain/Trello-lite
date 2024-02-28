/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      'templates/**/*.html.twig',
      'templates/*.html.twig',
      'assets/js/**/*.js',
      'assets/react/**/*.jsx', // Si vous utilisez des fichiers React JSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

