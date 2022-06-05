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
        'btn': '-0.313rem 0.313rem 0.625rem -0.063rem rgb(0 0 0 / 15%)',
        'btn-hovered': '0 0.125rem 0.625rem 0 rgb(0 0 0 / 50%)',
        'card': '-0.125rem 0.25rem 0.625rem rgba(0, 0, 0, 0.12)'
      },
      borderWidth: {
        'info-box': '10px solid rgba(0, 117, 255, 0.5)', 
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