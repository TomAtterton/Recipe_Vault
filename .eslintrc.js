module.exports = {
  extends: ['@react-native-community', 'plugin:prettier/recommended', 'plugin:i18next/recommended'],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'react-native-unistyles',
    'eslint-plugin-react-compiler',
    'i18next',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react-native-unistyles/no-unused-styles': 'warn',
    'react-compiler/react-compiler': 'warn',
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
    'react/require-default-props': 'off', // Allow non-defined react props as undefined
    '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between ESLint and Prettier
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
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off', // Ensures no conflict with unused-imports
      },
    },
  ],
};
