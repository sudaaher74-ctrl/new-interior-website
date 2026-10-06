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
        background: '#FAFAF9',
        surface: '#FFFFFF',
        surfaceElevated: '#F5F3EE',
        deepFooter: '#F5F3EE',
        canvas: '#FAFAF9',
        gold: {
          DEFAULT: '#8F6E38',
          light: '#A37E42',
          muted: '#BFA06C',
        },
        ink: {
          DEFAULT: '#0F0F12',
          secondary: '#3F3F46',
          muted: '#71717A',
        },
        line: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          hairline: 'rgba(0, 0, 0, 0.08)',
          divider: 'rgba(0, 0, 0, 0.04)',
          gold: 'rgba(143, 110, 56, 0.45)',
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
