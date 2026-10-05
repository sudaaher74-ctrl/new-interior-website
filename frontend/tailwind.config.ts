import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        surface: '#121216',
        surfaceElevated: '#181820',
        deepFooter: '#050505',
        canvas: '#0A0A0B',
        gold: {
          DEFAULT: '#C5A880',
          light: '#E2C799',
          muted: '#8D7458',
        },
        ink: {
          DEFAULT: '#FFFFFF',
          secondary: '#D4D4D8',
          muted: '#A1A1AA',
        },
        line: {
          DEFAULT: 'rgba(255, 255, 255, 0.10)',
          hairline: 'rgba(255, 255, 255, 0.10)',
          divider: 'rgba(255, 255, 255, 0.05)',
          gold: 'rgba(197, 168, 128, 0.50)',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', '-apple-system', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', '-apple-system', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1400px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'marquee-glide': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gold-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'marquee-glide': 'marquee-glide 45s linear infinite',
        'gold-pulse': 'gold-pulse 3s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
