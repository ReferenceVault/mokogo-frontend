/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mokogo-blue': '#1A73E8',
        'mokogo-off-white': '#F7F9FC',
        'mokogo-gray': '#E5E7EB',
      },
    },
  },
  plugins: [],
}
