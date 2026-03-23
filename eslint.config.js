/* eslint-disable no-undef */
const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-console': 'warn',
      'eqeqeq': 'error',
      'no-empty-function': 'warn',
      'no-multi-spaces': 'error',
      'no-return-await': 'error',
      'no-useless-return': 'error',
      'no-constant-condition': 'warn',
      'no-undef': 'error',
      'no-use-before-define': 'error',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'max-lines-per-function': ['error', 60],
      'max-len': ['error', { code: 80 }],
    },
  },
  {
    files: ['backend/**/*.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['frontend/**/*.{js,mjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser,
    },
  },
]);