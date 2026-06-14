/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f5238',
          container: '#2d6a4f',
          fixed: '#b1f0ce',
        },
        secondary: {
          DEFAULT: '#0e6c4a',
          container: '#a0f4c8',
        },
        tertiary: {
          DEFAULT: '#364d3c',
          container: '#4d6553',
        },
        surface: {
          DEFAULT: '#ffffff',
          neutral: '#f8f9fa',
          variant: '#e1e3e4',
          dim: '#d9dadb',
        },
        on: {
          surface: '#191c1d',
          primary: '#ffffff',
          secondary: '#ffffff',
          tertiary: '#ffffff',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'level-1': '0 4px 20px rgba(0,0,0,0.04)',
        'level-2': '0 8px 24px rgba(15,82,56,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '1.5rem',
      }
    },
  },
  plugins: [],
}