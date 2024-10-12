const { resolve } = require('node:path'); // Use require instead of import

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
  ],
  parserOptions: {
    project, // Ensure the path to tsconfig.json is correct
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off', // Disable this rule
    // Other rules...
  },
  ignorePatterns: [
    '.eslintrc.js',
    'next.config.mjs',
    'prettier.config.mjs',
    'node_modules/',
    'dist/',
  ],
};
