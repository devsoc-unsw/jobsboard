const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts}'],
  darkMode: false,
  theme: {
    screens: {
      // The following screen sizes are converted into css like so
      // @media (min-width: ...px) { ... }
      'xs': '480px',
      'sm': '640px', 
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundColor: {
        'jb-background': '#f6f9fc',
        'jb-blue': '#2c8bf4',
        'jb-btn-hovered': '#1f7ade',
      },
      colors: {
        'jb-headings': '#0c3149',
        'jb-subheadings': '#415d6d',
        'jb-placeholder': '#606060',
        'jb-textlink': '#2c8bf4',
        'jb-textlink-hovered': '#1f7ade',
        'jb-tags': '#ebecf0',
      },
      rotate: {
        '220': '220deg'
      },
      boxShadow: {
        'btn': '-5px 5px 10px -1px rgb(0 0 0 / 15%)',
        'btn-hovered': '0 2px 10px 0 rgb(0 0 0 / 50%)',
        'card': '-2px 4px 10px rgba(0, 0, 0, 0.12)'
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