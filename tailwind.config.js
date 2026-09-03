/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#0f172a',
        },
        party: {
          ppp: '#e61e2b', // 국민의힘 (Red)
          dp: '#004ea2',  // 더불어민주당 (Blue)
          rk: '#008080',  // 조국혁신당 (Teal)
          ra: '#ff6600',  // 개혁신당 (Orange)
          etc: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}
