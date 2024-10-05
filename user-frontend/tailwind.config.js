/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'trust-color':'#0166FF',
        'trust-light':'0080F6',
      }
    },
  },
  plugins: [],
}