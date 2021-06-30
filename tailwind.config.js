const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './wp-templates/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1366px',
      wide: '1600px',
    },
    colors: {
      transparent: 'transparent',
      red: {
        DEFAULT: '#E62D2D',
      },
      pink: '#F4D3CD',
      white: '#ffffff',
    },
    height: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      full: '100%',
      screen: 'calc(var(--vh) * 100)',
      'screen-1/2': 'calc(var(--vh) * 50)',
      'screen-2': 'calc(var(--vh) * 200)',
      'screen-3': 'calc(var(--vh) * 300)',
      'screen-4': 'calc(var(--vh) * 400)',
      'screen-5': 'calc(var(--vh) * 500)',
      'screen-6': 'calc(var(--vh) * 600)',
    }),
    minHeight: (theme) => ({
      0: '0',
      ...theme('spacing'),
      full: '100%',
      screen: 'calc(var(--vh) * 100)',
      'screen-1/2': 'calc(var(--vh) * 50)',
      'screen-2': 'calc(var(--vh) * 200)',
      'screen-3': 'calc(var(--vh) * 300)',
      'screen-4': 'calc(var(--vh) * 400)',
      'screen-5': 'calc(var(--vh) * 500)',
      'screen-6': 'calc(var(--vh) * 600)',
    }),
    extend: {
      fontSize: {
        '3xl': '2rem',
        '8xl': '5.625rem',
      },
      borderWidth: {
        10: '10px',
        60: '60px',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      fontFamily: {
        sans: ['Gotham HTF', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-pseudo-elements')({
      contentUtilities: false,
      emptyContent: true,
    }),
  ],
};
