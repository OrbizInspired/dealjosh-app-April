/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // DEFINING THE DEALJOSH BRAND PALETTE
      colors: {
        dj: {
          'orange': '#CC5500', // The burnt orange from the DEALJOSH text
          'yellow': '#FFD700', // The gold/yellow from the bag icon
          'red': '#FF4500',    // The brighter red/orange
          'bg': '#FFFBF0'      // A subtle cream background
        }
      },
      spacing: {
        '200': '800px',
        '175': '700px',
      }
    },
  },
  plugins: [],
}