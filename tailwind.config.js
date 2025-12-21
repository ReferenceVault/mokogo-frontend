/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color from logo (warm orange)
        'mokogo-primary': '#F7A86B',
        'mokogo-primary-dark': '#E8955A',
        'mokogo-primary-light': '#F9B88A',
        // Info/Alert colors (warm orange tints for info boxes)
        'mokogo-info-bg': '#FEF5ED',
        'mokogo-info-border': '#FCD9B8',
        'mokogo-info-text': '#C05621',
        // Off-white from logo (already in use)
        'mokogo-off-white': '#F7F9FC',
        // Neutral grays
        'mokogo-gray': '#E5E7EB',
        'mokogo-gray-dark': '#D1D5DB',
        'mokogo-gray-light': '#F3F4F6',
        // Legacy blue (keeping for backward compatibility, can be removed later)
        'mokogo-blue': '#F7A86B', // Mapped to primary for smooth transition
      },
    },
  },
  plugins: [],
}
