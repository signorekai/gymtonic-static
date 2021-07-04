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
      black: '#000000',
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
      lineHeight: {
        tighter: '1.1',
      },
      width: {
        '3/10': '30%',
        '7/10': '70%',
        'screen-2/5': '40vw',
        'screen-1/2': '50vw',
      },
      height: {
        'screen-w-2/5': '40vw',
        'screen-border-10': 'calc(calc(var(--vh) * 100) + 20px)',
        'screen-border-60': 'calc(calc(var(--vh) * 100) + 120px)',
      },
      fontSize: {
        sm: '.9375rem',
        '2xl': '1.625rem',
        '3xl': '2rem',
        '8xl': '5.625rem',
        '11xl': '8.5rem',
      },
      borderWidth: {
        4: '4px',
        10: '10px',
        60: '60px',
      },
      maxWidth: {
        none: 'none',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '2/3': '66.67%',
        '3/4': '75%',
        '5/6': '83.33%',
      },
      maxHeight: {
        none: 'none',
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
      },
      padding: {
        18: '4.5rem',
        22: '5.5rem',
        34: '8.5rem',
      },
      margin: {
        34: '8.5rem',
        screen: 'calc(var(--vh) * 100)',
        'screen-1/20': '5vh',
        'screen-1/10': '10vh',
        'screen-3/20': '15vh',
        'screen-2/10': '20vh',
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
