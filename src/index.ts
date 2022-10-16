import missingPlaywrightAwait from './rules/missing-playwright-await';
import noPagePause from './rules/no-page-pause';
import noElementHandle from './rules/no-element-handle';
import noEval from './rules/no-eval';
import noFocusedTest from './rules/no-focused-test';
import noSkippedTest from './rules/no-skipped-test';
import noWaitForTimeout from './rules/no-wait-for-timeout';
import noForceOption from './rules/no-force-option';
import maxNestedDescribe from './rules/max-nested-describe';
import noConditionalInTest from './rules/no-conditional-in-test';
import noRestrictedMatchers from './rules/no-restricted-matchers';
import noUselessNot from './rules/no-useless-not';
import preferLowercaseTitle from './rules/prefer-lowercase-title';
import preferToHaveLength from './rules/prefer-to-have-length';
import preferStrictEqual from './rules/prefer-strict-equal';
import requireTopLevelDescribe from './rules/require-top-level-describe';
import validExpect from './rules/valid-expect';

export = {
  configs: {
    'playwright-test': {
      plugins: ['playwright'],
      env: {
        'shared-node-browser': true,
      },
      rules: {
        'no-empty-pattern': 'off',
        'playwright/missing-playwright-await': 'error',
        'playwright/no-page-pause': 'warn',
        'playwright/no-element-handle': 'warn',
        'playwright/no-eval': 'warn',
        'playwright/no-focused-test': 'error',
        'playwright/no-skipped-test': 'warn',
        'playwright/no-wait-for-timeout': 'warn',
        'playwright/no-force-option': 'warn',
        'playwright/max-nested-describe': 'warn',
        'playwright/no-conditional-in-test': 'warn',
        'playwright/no-useless-not': 'warn',
        'playwright/valid-expect': 'error',
      },
    },
    'jest-playwright': {
      plugins: ['jest', 'playwright'],
      env: {
        'shared-node-browser': true,
        jest: true,
      },
      rules: {
        'playwright/missing-playwright-await': 'error',
        'playwright/no-page-pause': 'warn',
        'jest/no-standalone-expect': [
          'error',
          {
            additionalTestBlockFunctions: [
              'test.jestPlaywrightDebug',
              'it.jestPlaywrightDebug',
              'test.jestPlaywrightSkip',
              'it.jestPlaywrightSkip',
              'test.jestPlaywrightConfig',
              'it.jestPlaywrightConfig',
            ],
          },
        ],
      },
      globals: {
        browserName: true,
        deviceName: true,
        browser: true,
        context: true,
        page: true,
        jestPlaywright: true,
      },
    },
  },
  rules: {
    'missing-playwright-await': missingPlaywrightAwait,
    'no-page-pause': noPagePause,
    'no-element-handle': noElementHandle,
    'no-eval': noEval,
    'no-focused-test': noFocusedTest,
    'no-skipped-test': noSkippedTest,
    'no-wait-for-timeout': noWaitForTimeout,
    'no-force-option': noForceOption,
    'max-nested-describe': maxNestedDescribe,
    'no-conditional-in-test': noConditionalInTest,
    'no-useless-not': noUselessNot,
    'no-restricted-matchers': noRestrictedMatchers,
    'prefer-lowercase-title': preferLowercaseTitle,
    'prefer-strict-equal': preferStrictEqual,
    'prefer-to-have-length': preferToHaveLength,
    'require-top-level-describe': requireTopLevelDescribe,
    'valid-expect': validExpect,
  },
};
