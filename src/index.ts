import maxNestedDescribe from './rules/max-nested-describe';
import maxNestedStep from './rules/max-nested-step';
import missingPlaywrightAwait from './rules/missing-playwright-await';
import noConditionalInTest from './rules/no-conditional-in-test';
import noElementHandle from './rules/no-element-handle';
import noEval from './rules/no-eval';
import noFocusedTest from './rules/no-focused-test';
import noForceOption from './rules/no-force-option';
import noNetworkidle from './rules/no-networkidle';
import noPagePause from './rules/no-page-pause';
import noRestrictedMatchers from './rules/no-restricted-matchers';
import noSkippedTest from './rules/no-skipped-test';
import noUselessAwait from './rules/no-useless-await';
import noUselessNot from './rules/no-useless-not';
import noWaitForTimeout from './rules/no-wait-for-timeout';
import preferLowercaseTitle from './rules/prefer-lowercase-title';
import preferStrictEqual from './rules/prefer-strict-equal';
import preferToBe from './rules/prefer-to-be';
import preferToHaveLength from './rules/prefer-to-have-length';
import preferWebFirstAssertions from './rules/prefer-web-first-assertions';
import requireSoftAssertions from './rules/require-soft-assertions';
import requireTopLevelDescribe from './rules/require-top-level-describe';
import validExpect from './rules/valid-expect';

const recommended = {
  env: {
    'shared-node-browser': true,
  },
  plugins: ['playwright'],
  rules: {
    'no-empty-pattern': 'off',
    'playwright/max-nested-describe': 'warn',
    'playwright/max-nested-step': 'warn',
    'playwright/missing-playwright-await': 'error',
    'playwright/no-conditional-in-test': 'warn',
    'playwright/no-element-handle': 'warn',
    'playwright/no-eval': 'warn',
    'playwright/no-focused-test': 'error',
    'playwright/no-force-option': 'warn',
    'playwright/no-networkidle': 'error',
    'playwright/no-page-pause': 'warn',
    'playwright/no-skipped-test': 'warn',
    'playwright/no-useless-await': 'warn',
    'playwright/no-useless-not': 'warn',
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/prefer-web-first-assertions': 'error',
    'playwright/valid-expect': 'error',
  },
};

export = {
  configs: {
    'jest-playwright': {
      env: {
        jest: true,
        'shared-node-browser': true,
      },
      globals: {
        browser: true,
        browserName: true,
        context: true,
        deviceName: true,
        jestPlaywright: true,
        page: true,
      },
      plugins: ['jest', 'playwright'],
      rules: {
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
        'playwright/missing-playwright-await': 'error',
        'playwright/no-page-pause': 'warn',
      },
    },
    'playwright-test': recommended,
    recommended,
  },
  rules: {
    'max-nested-describe': maxNestedDescribe,
    'max-nested-step': maxNestedStep,
    'missing-playwright-await': missingPlaywrightAwait,
    'no-conditional-in-test': noConditionalInTest,
    'no-element-handle': noElementHandle,
    'no-eval': noEval,
    'no-focused-test': noFocusedTest,
    'no-force-option': noForceOption,
    'no-networkidle': noNetworkidle,
    'no-page-pause': noPagePause,
    'no-restricted-matchers': noRestrictedMatchers,
    'no-skipped-test': noSkippedTest,
    'no-useless-await': noUselessAwait,
    'no-useless-not': noUselessNot,
    'no-wait-for-timeout': noWaitForTimeout,
    'prefer-lowercase-title': preferLowercaseTitle,
    'prefer-strict-equal': preferStrictEqual,
    'prefer-to-be': preferToBe,
    'prefer-to-have-length': preferToHaveLength,
    'prefer-web-first-assertions': preferWebFirstAssertions,
    'require-soft-assertions': requireSoftAssertions,
    'require-top-level-describe': requireTopLevelDescribe,
    'valid-expect': validExpect,
  },
};
