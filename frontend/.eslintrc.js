module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },  
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: "module",
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:vue/recommended"
  ],
  rules: {
    'vue/no-v-html': 'off', // enabled to render html from free text editor
    'vue/no-reserved-component-names': 'off',
    'vue/multi-word-component-names': 'off',

    // eslint rules
    'quotes': ['error', 'single'],
    'keyword-spacing': 'error',
    'key-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'template-curly-spacing': 'error',
    'space-in-parens': 'error',
    'func-call-spacing': 'error',
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': 'error',
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',

    'arrow-spacing': 'error',
    'no-whitespace-before-property': 'error',
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'no-multi-spaces': 'error',
    'semi': 'error',
    'block-spacing': 'error',
    'eol-last': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'implicit-arrow-linebreak': 'error',
    'rest-spread-spacing': 'error',
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', { 'named': 'never', 'asyncArrow': 'always' }],
    
    // vue related rules 
    'vue/html-quotes': ['error', 'single'],
    'vue/keyword-spacing': 'error',
    'vue/key-spacing': 'error',
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/template-curly-spacing': 'error',
    'vue/space-in-parens': 'error',
    'vue/max-len': ['error', { 
      'code': 80,
      'tabWidth': 2, 
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
      'ignoreStrings': true,
      'ignoreHTMLAttributeValues': true,
      'ignoreHTMLTextContents': true 
    }],

    'vue/func-call-spacing': 'error',
    'vue/array-bracket-newline': ['error', 'consistent'],
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/comma-spacing': 'error',
  }
};