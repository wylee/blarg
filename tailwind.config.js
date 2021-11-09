const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    // "./app/**/*.html.erb",
  ],
  darkMode: false,
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    colors: {
      gray: colors.blueGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },

    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}