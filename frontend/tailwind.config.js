/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-600',
    'bg-red-700',
    'hover:bg-red-700',
    'focus:ring-red-500'
  ]
}
