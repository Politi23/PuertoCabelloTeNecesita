import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        bg: '#060E1C',
        surface: '#0A1A30',
        line: '#153055',
        ink: '#EDF1FA',
        muted: '#7896B8',
        gold: '#CDA020',
        crit: '#C82030',
        warn: '#C07525',
        ok: '#2A9850',
      },
      fontFamily: {
        archivo: ['var(--font-archivo)', 'sans-serif'],
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      maxWidth: {
        container: '80rem',
        'container-xl': '96rem',
        'container-tv': '120rem',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        pulse: 'pulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
