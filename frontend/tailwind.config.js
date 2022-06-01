const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts}'],
  darkMode: false,
  theme: {
    extend: {
      backgroundColor: {
        'jb-background': '#f6f9fc',
        'jb-blue': '#2C8BF4',
        'jb-btn-hovered': '#1f7ade',
      },
      colors: {
        'jb-headings': '#0c3149',
        'jb-subheadings': '#415d6d',
        'jb-placeholder': '#878787',
        'jb-textlink': '#2c8bf4',
        'jb-tags': '#ebecf0',
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
        'body': {
          'background': '#f6f9fc',
          'margin': '0',
          'height': '100%'
        }
      })
    })
  ],
}