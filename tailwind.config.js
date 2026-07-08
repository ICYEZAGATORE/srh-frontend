/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colours map to the CSS-variable design tokens in src/index.css, so both
      // the token classes (bg-[var(--clr-primary)]) used across the existing
      // components AND the friendly aliases below (bg-primary) resolve to the
      // same value and re-theme in high-contrast mode automatically.
      colors: {
        primary: {
          DEFAULT: 'var(--clr-primary)',
          strong: 'var(--clr-primary-strong)',
          light: 'var(--clr-primary-light)',
        },
        accent: {
          DEFAULT: 'var(--clr-accent)',
          strong: 'var(--clr-accent-strong)',
          light: 'var(--clr-accent-light)',
        },
        mint: {
          DEFAULT: 'var(--clr-mint)',
          light: 'var(--clr-mint-light)',
        },
        surface: 'var(--clr-surface)',
        bg: 'var(--clr-bg)',
        ink: {
          DEFAULT: 'var(--clr-text-primary)',
          muted: 'var(--clr-text-secondary)',
        },
        line: 'var(--clr-border)',
      },
      fontFamily: {
        // Body default — Atkinson Hyperlegible (low-vision legibility).
        sans: ['Atkinson Hyperlegible', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Characterful display, used with restraint.
        display: ['Bricolage Grotesque', 'Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
        // Tight UI labels / captions.
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(76, 46, 156, 0.22)',
        lift: '0 20px 44px -18px rgba(76, 46, 156, 0.34)',
        glow: '0 0 0 4px rgba(245, 165, 36, 0.28)',
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
