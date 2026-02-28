/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#F5F4F0',
        card: '#EFEFEB',
        accent: '#FF3B00',
        border: '#E0DFD9',
        ink: '#1A1A1A',
        muted: '#888880',
      },
    },
  },
  plugins: [],
}
