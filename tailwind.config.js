/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (Switched to Clean Light Mode)
        'bg-base': '#F8FAFC',    // Slate-50: Main app background
        'bg-surface': '#FFFFFF', // White: Cards, sidebars, headers
        'bg-elevated': '#FFFFFF', // White: Modals, dropdowns
        'bg-hover': '#F1F5F9',   // Slate-100: Hover states
        'bg-active': '#E2E8F0',  // Slate-200: Active/Pressed states

        // Borders (Subtle Grays)
        'border-subtle': '#F1F5F9', // Slate-100
        'border-default': '#E2E8F0', // Slate-200
        'border-strong': '#CBD5E1',  // Slate-300

        // Text (High Contrast Slate)
        'text-primary': '#0F172A',   // Slate-900: Headings, main text
        'text-secondary': '#475569', // Slate-600: Body text
        'text-tertiary': '#64748B',  // Slate-500: Meta data, smaller text
        'text-disabled': '#94A3B8',  // Slate-400

        // Accent (Professional Blue/Indigo)
        'accent': '#2563EB',         // Blue-600: Trustworthy, standard corporate blue
        'accent-hover': '#1D4ED8',   // Blue-700

        // Functional (Standardized Palette)
        'success': '#16A34A',        // Green-600
        'warning': '#D97706',        // Amber-600 (Darker for better text readability)
        'error': '#DC2626',          // Red-600
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
        'sans': ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
      // UPDATED: Shadows made softer for light mode
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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