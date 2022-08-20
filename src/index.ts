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
import noUselessNot from './rules/no-useless-not';

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
  },
};
