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
    extend: {
      fontSize: {
        '3xl': '2rem',
        '8xl': '5.625rem',
      },
      borderWidth: {
        10: '10px',
        60: '60px',
      },
      animation: {
        'menu-drop-down': 'drop-down 0.3s ease-out forwards',
      },
      keyframes: {
        'drop-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      fontFamily: {
        sans: ['Gotham HTF'],
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
