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
    'vue/no-v-html': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/multi-word-component-names': 'off',
  }
};