module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  ignorePatterns: [
    "*_tests.js",
    "./node_modules/**",
    ".eslintrc.cjs"
  ],
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    "import/no-cycle": "warn",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["tests(new)/**/*"] }],
    "@typescript-eslint/brace-style": "off",
    "@typescript-eslint/no-floating-promises": [
      "error", { ignoreIIFE: true }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "no-console": "off",
  },
  overrides: [
    {
      files: ["tests(new)/**/*"],
      rules: {
        "prefer-arrow-callback": "error",
      }
    }
  ]
};