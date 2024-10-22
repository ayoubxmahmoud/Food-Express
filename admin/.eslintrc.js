const { resolve } = require('node:path');

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
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  rules: {
    // Deactivated all ESLint rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'import/newline-after-import': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'unicorn/filename-case': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'import/no-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'no-nested-ternary': 'off',
    'no-redeclare': 'off',
    'react/jsx-fragments': 'off',
    'react/prop-types': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    "no-unused-vars": "off",
    'no-console': 'off', // Disable no-console rule globally
  },
  ignorePatterns: ['.eslintrc.js', 'next.config.mjs', 'prettier.config.mjs', 'node_modules/', 'dist/'],
};
