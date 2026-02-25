/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#0C0C0E',
        'bg-surface': '#131316',
        'bg-elevated': '#1A1A1F',
        'bg-hover': '#222228',
        'bg-active': '#2A2A32',
        
        // Borders
        'border-subtle': '#1F1F26',
        'border-default': '#2A2A34',
        'border-strong': '#3A3A48',
        
        // Text
        'text-primary': '#EBEBF0',
        'text-secondary': '#8A8A9A',
        'text-tertiary': '#555568',
        'text-disabled': '#3A3A48',
        
        // Accent
        'accent': '#8B8BFF',
        'accent-hover': '#9D9DFF',

        // Functional
        'success': '#4ADE80',
        'warning': '#FBBF24',
        'error': '#FF6B6B',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '25': '100px',
        '30px': '30px',
        '26px': '26px',
        '28px': '28px',
        '45': '180px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.5' }],
        'md': ['16px', { lineHeight: '1.5' }],
        'lg': ['18px', { lineHeight: '1.5' }],
        'xl': ['20px', { lineHeight: '1.5' }],
        '2xl': ['26px', { lineHeight: '1.1' }],
        '3xl': ['36px', { lineHeight: '1.1' }],
        '4xl': ['48px', { lineHeight: '1.1' }],
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '150ms',
        'slow': '250ms',
      },
      transitionTimingFunction: {
        'base': 'ease',
      },
      animation: {
        'toast-in': 'toast-in 0.2s ease',
        'overlay-in': 'overlay-in 0.15s ease',
        'drawer-in': 'drawer-in 0.2s ease',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        'toast-in': {
          'from': {
            'opacity': '0',
            'transform': 'translateY(8px)',
          },
          'to': {
            'opacity': '1',
            'transform': 'translateY(0)',
          },
        },
        'overlay-in': {
          'from': { 'opacity': '0' },
          'to': { 'opacity': '1' },
        },
        'drawer-in': {
          'from': {
            'transform': 'translateX(40px)',
            'opacity': '0',
          },
          'to': {
            'transform': 'translateX(0)',
            'opacity': '1',
          },
        },
        'shimmer': {
          '0%': {
            'background-position': '200% 0',
          },
          '100%': {
            'background-position': '-200% 0',
          },
        },
      },
      width: {
        'sidebar': '200px',
        '30px': '30px',
        '26px': '26px',
        '45': '180px',
      },
      height: {
        'navbar': '52px',
        '30px': '30px',
        '26px': '26px',
        '72px': '72px',
        '28px': '28px',
      },
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1200px',
      },
      zIndex: {
        '100': '100',
        '150': '150',
        '200': '200',
        '1000': '1000',
      },
      maxWidth: {
        '80': '320px',
        '96': '384px',
        '45': '180px',
      },
      maxHeight: {
        '80': '340px',
      },
    },
  },
  plugins: [],
}
