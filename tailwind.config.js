/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand — calm, trustworthy deep teal.
        teal: {
          50: '#e6f2f2',
          100: '#cce5e5',
          200: '#a6d4d5',
          600: '#0D7377', // primary
          700: '#0a5c5f',
          800: '#084749',
        },
        warm: {
          white: '#FAF9F6', // warm background
        },
        // Cheerful accent family used across illustrations and highlights.
        marigold: {
          100: '#fff1d6',
          400: '#FFC95C',
          500: '#F4A261', // warm amber
          600: '#e08a3e',
        },
        // Supportive amber for fallback cards — never red.
        support: {
          50: '#fdf6e9',
          100: '#fbedcf',
          600: '#b77f1f',
          700: '#8f6315',
        },
        ink: {
          500: '#5b6b6a',
          700: '#33403f',
          900: '#1c2625',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(13, 115, 119, 0.25)',
        lift: '0 18px 40px -16px rgba(13, 115, 119, 0.35)',
        glow: '0 0 0 4px rgba(13, 115, 119, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0D7377 0%, #14A0A5 100%)',
        'sun-gradient': 'linear-gradient(135deg, #F4A261 0%, #FFC95C 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        float: 'float 5s ease-in-out infinite',
        pop: 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
