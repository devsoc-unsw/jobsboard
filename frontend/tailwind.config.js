const plugin = require('tailwindcss/plugin')

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
      },
      boxShadow: {
        'btn': '-5px 5px 10px -1px rgb(0 0 0 / 15%)',
        'btn-hovered': '0 2px 10px 0 rgb(0 0 0 / 50%)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'img': { 
          'max-width': 'none'
        },
      })
    })
  ],
}