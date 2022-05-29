module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts}'],
  darkMode: false,
  theme: {
    extend: {
      backgroundColor: {
        'jb-blue': '#2C8BF4',
      },
      rotate: {
        '220': '220deg'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}