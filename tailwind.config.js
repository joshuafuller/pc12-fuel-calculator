/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'ripple-1': 'ripple 2s ease-in-out infinite',
        'ripple-2': 'ripple 2s ease-in-out infinite 1s',
      },
      keyframes: {
        ripple: {
          '0%, 100%': { transform: 'translateX(-100%) translateY(0)' },
          '50%': { transform: 'translateX(100%) translateY(-25%)' },
        }
      },
    },
  },
  plugins: [],
}