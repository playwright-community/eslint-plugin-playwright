import playwright from 'eslint-plugin-playwright';

export default [
  playwright.configs['flat/recommended'],
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
    },
    rules: {
      'playwright/prefer-lowercase-title': 'warn',
      'playwright/prefer-to-be': 'warn',
      'playwright/prefer-to-have-length': 'warn',
      'playwright/prefer-strict-equal': 'warn',
      'playwright/max-nested-describe': ['warn', { max: 1 }],
      'playwright/no-restricted-matchers': [
        'error',
        {
          toBeFalsy: 'Use `toBe(false)` instead.',
          not: null,
        },
      ],
    },
  },
];
