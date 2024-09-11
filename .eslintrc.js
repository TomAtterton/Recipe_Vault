const path = require('path');

module.exports = {
  extends: ['@react-native-community', 'plugin:prettier/recommended', 'plugin:i18next/recommended'],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'react-native-unistyles',
    'eslint-plugin-react-compiler',
    'jest', // Add jest plugin here
    'i18next',
  ],
  env: {
    'jest/globals': true, // Add jest environment here
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-native-unistyles/no-unused-styles': 'warn',
    'react-compiler/react-compiler': 'warn',

    // Define Prettier rules once
    'prettier/prettier': [
      'error',
      {
        semi: true,
        useTabs: false,
        tabWidth: 2,
        bracketSpacing: true,
        jsxBracketSameLine: false,
        printWidth: 100,
        singleQuote: true,
        arrowParens: 'always',
      },
    ],
    // Unused imports rule for all JavaScript/TypeScript files
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    // Specific rules for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between Eslint and Prettier
        'react/require-default-props': 'off', // Allow non-defined react props as undefined
      },
    },
    // Specific rules for translations JSON files
    {
      files: ['src/translations/*.json'],
      extends: ['plugin:i18n-json/recommended'],
      rules: {
        'i18n-json/valid-json': 'error',
        'i18n-json/sorted-keys': [
          'error',
          {
            order: 'asc',
            indentSpaces: 2,
          },
        ],
        'i18n-json/identical-keys': [
          'error',
          {
            filePath: path.resolve('./src/translations/en.json'),
          },
        ],
        // Override prettier for JSON formatting
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            endOfLine: 'auto',
          },
        ],
      },
    },
  ],
};
