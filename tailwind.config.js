module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './wp-templates/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
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
      white: '#ffffff',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
