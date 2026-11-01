/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // R1 Design Tokens
        canvas: {
          DEFAULT: '#080D1B',
          dark: '#080D1B',
          light: '#F8FAFC',
        },
        surface: {
          DEFAULT: '#101A2E',
          dark: '#101A2E',
          elevated: '#16223B',
          light: '#FFFFFF',
          lightElevated: '#F1F5F9',
        },
        border: {
          DEFAULT: 'rgba(148, 163, 184, 0.15)',
          dark: 'rgba(148, 163, 184, 0.15)',
          darkSubtle: 'rgba(148, 163, 184, 0.10)',
          light: 'rgba(148, 163, 184, 0.3)',
        },
        primary: {
          DEFAULT: '#3B82F6', // Electric Blue
          hover: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.35)',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Neon Purple
          hover: '#7C3AED',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        accent: {
          DEFAULT: '#22D3EE', // Cyan
          hover: '#06B6D4',
          glow: 'rgba(34, 211, 238, 0.35)',
        },
        text: {
          DEFAULT: '#E6EDF7',
          primary: '#E6EDF7',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        // Updated Brand Aliases to map cleanly to the new Dark SaaS palette
        brand: {
          navy: {
            DEFAULT: '#080D1B',
            50: '#F4F6FB',
            100: '#E8ECF7',
            200: '#C7D2EE',
            300: '#9FB3E2',
            400: '#6987CF',
            500: '#3D62BA',
            600: '#234499',
            700: '#172F73',
            800: '#16223B', // Elevated card surface
            900: '#101A2E', // Primary card/surface
            950: '#080D1B', // Canvas background
          },
          teal: {
            DEFAULT: '#22D3EE', // Cyan accent
            50: '#ECFEFF',
            100: '#CFFAFE',
            200: '#A5F3FC',
            300: '#67E8F9',
            400: '#22D3EE',
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490',
            800: '#155E75',
            900: '#164E63',
          },
          amber: {
            DEFAULT: '#F59E0B',
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
        },
        // Dedicated semantic status colors
        semantic: {
          fact: {
            DEFAULT: '#22C55E', // Sourced Green
            bg: 'rgba(34, 197, 94, 0.12)',
            darkBg: 'rgba(34, 197, 94, 0.12)',
            border: 'rgba(34, 197, 94, 0.3)',
            darkBorder: 'rgba(34, 197, 94, 0.3)',
            text: '#22C55E',
            darkText: '#22C55E',
          },
          conflict: {
            DEFAULT: '#F43F5E', // Conflict Red
            bg: 'rgba(244, 63, 94, 0.12)',
            darkBg: 'rgba(244, 63, 94, 0.12)',
            border: 'rgba(244, 63, 94, 0.3)',
            darkBorder: 'rgba(244, 63, 94, 0.3)',
            text: '#F43F5E',
            darkText: '#F43F5E',
          },
          outdated: {
            DEFAULT: '#F59E0B', // Outdated Orange
            bg: 'rgba(245, 158, 11, 0.12)',
            darkBg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.3)',
            darkBorder: 'rgba(245, 158, 11, 0.3)',
            text: '#F59E0B',
            darkText: '#F59E0B',
          },
          gap: {
            DEFAULT: '#A78BFA', // Gap Purple
            bg: 'rgba(167, 139, 250, 0.12)',
            darkBg: 'rgba(167, 139, 250, 0.12)',
            border: 'rgba(167, 139, 250, 0.3)',
            darkBorder: 'rgba(167, 139, 250, 0.3)',
            text: '#A78BFA',
            darkText: '#A78BFA',
          },
          ai: {
            DEFAULT: '#3B82F6', // AI Suggestion Blue
            bg: 'rgba(59, 130, 246, 0.12)',
            darkBg: 'rgba(59, 130, 246, 0.12)',
            border: 'rgba(59, 130, 246, 0.4)',
            darkBorder: 'rgba(59, 130, 246, 0.4)',
            text: '#60A5FA',
            darkText: '#60A5FA',
          },
          uncertainty: {
            DEFAULT: '#94A3B8', // Uncertain Gray
            bg: 'rgba(148, 163, 184, 0.12)',
            darkBg: 'rgba(148, 163, 184, 0.12)',
            border: 'rgba(148, 163, 184, 0.3)',
            darkBorder: 'rgba(148, 163, 184, 0.3)',
            text: '#94A3B8',
            darkText: '#94A3B8',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        num: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(34, 211, 238, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'soft-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'soft': '0 4px 16px -2px rgba(0, 0, 0, 0.3)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.4)',
        'soft-xl': '0 20px 35px -4px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
