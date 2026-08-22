/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          /* Surfaces */
          bg:             'var(--color-bg)',
          'bg-alt':       'var(--color-bg-alt)',
          surface:        'var(--color-surface)',

          /* Dark teal — brand primary dark (logo background / headings) */
          teal:           'var(--color-teal)',
          'teal-mid':     'var(--color-teal-mid)',
          'teal-light':   'var(--color-teal-light)',

          /* Brand green — primary accent / CTAs */
          green:          'var(--color-green)',
          'green-dark':   'var(--color-green-dark)',
          'green-subtle': 'var(--color-green-subtle)',

          /* Text */
          'text-h':       'var(--color-text-h)',
          'text-body':    'var(--color-text-body)',
          'text-muted':   'var(--color-text-muted)',

          /* Semantic */
          danger:         'var(--color-danger)',
          success:        'var(--color-success)',
          border:         'var(--color-border)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
