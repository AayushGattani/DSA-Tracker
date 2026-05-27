/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          foreground: '#ededed',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.4)',
          foreground: 'rgba(255, 255, 255, 0.6)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(to bottom right, #1a1a1a, #0a0a0a)',
      },
    },
  },
  plugins: [],
}
