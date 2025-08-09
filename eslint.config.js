import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'dist/', 'sample/', '.github/'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  reactPlugin.configs.flat.recommended,
  jsxA11yPlugin.flatConfigs.recommended,

  {
    plugins: { 'react-hooks': reactHooksPlugin },
    rules: reactHooksPlugin.configs.recommended.rules,
  },

  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'off',
    },
  },

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021, window: 'readonly' },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['.', 'src'],
          extensions: ['.js', '.ts', '.jsx', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-webpack-loader-syntax': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-use-before-define': 'off',
      'no-console': 'off',
      'no-extend-native': 'off',
      'no-param-reassign': 'off',
      'class-methods-use-this': 'off',
      'dot-notation': ['error', { allowKeywords: true }],
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      camelcase: 'warn',
      'no-plusplus': 'off',
      'no-nested-ternary': 'off',

      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-restricted-types': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      'prettier/prettier': 'off',
    },
  },

  prettierConfig,
);
