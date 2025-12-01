/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}
