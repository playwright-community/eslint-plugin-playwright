import globals from 'globals'
import contextClose from './rules/context-close'
import expectExpect from './rules/expect-expect'
import maxExpects from './rules/max-expects'
import maxNestedDescribe from './rules/max-nested-describe'
import missingPlaywrightAwait from './rules/missing-playwright-await'
import noCommentedOutTests from './rules/no-commented-out-tests'
import noConditionalExpect from './rules/no-conditional-expect'
import noConditionalInTest from './rules/no-conditional-in-test'
import noDuplicateHooks from './rules/no-duplicate-hooks'
import noElementHandle from './rules/no-element-handle'
import noEval from './rules/no-eval'
import noFocusedTest from './rules/no-focused-test'
import noForceOption from './rules/no-force-option'
import noGetByTitle from './rules/no-get-by-title'
import noHooks from './rules/no-hooks'
import noNestedStep from './rules/no-nested-step'
import noNetworkidle from './rules/no-networkidle'
import noNthMethods from './rules/no-nth-methods'
import noPagePause from './rules/no-page-pause'
import noRawLocators from './rules/no-raw-locators'
import noRestrictedMatchers from './rules/no-restricted-matchers'
import noSkippedTest from './rules/no-skipped-test'
import noStandaloneExpect from './rules/no-standalone-expect'
import noUnsafeReferences from './rules/no-unsafe-references'
import noUselessAwait from './rules/no-useless-await'
import noUselessNot from './rules/no-useless-not'
import noWaitForSelector from './rules/no-wait-for-selector'
import noWaitForTimeout from './rules/no-wait-for-timeout'
import preferComparisonMatcher from './rules/prefer-comparison-matcher'
import preferEqualityMatcher from './rules/prefer-equality-matcher'
import preferHooksInOrder from './rules/prefer-hooks-in-order'
import preferHooksOnTop from './rules/prefer-hooks-on-top'
import preferLowercaseTitle from './rules/prefer-lowercase-title'
import preferStrictEqual from './rules/prefer-strict-equal'
import preferToBe from './rules/prefer-to-be'
import preferToContain from './rules/prefer-to-contain'
import preferToHaveCount from './rules/prefer-to-have-count'
import preferToHaveLength from './rules/prefer-to-have-length'
import preferWebFirstAssertions from './rules/prefer-web-first-assertions'
import requireHook from './rules/require-hook'
import requireSoftAssertions from './rules/require-soft-assertions'
import requireToThrowMessage from './rules/require-to-throw-message'
import requireTopLevelDescribe from './rules/require-top-level-describe'
import validDescribeCallback from './rules/valid-describe-callback'
import validExpect from './rules/valid-expect'
import validExpectInPromise from './rules/valid-expect-in-promise'
import validTitle from './rules/valid-title'

const index = {
  configs: {},
  rules: {
    'context-close': contextClose,
    'expect-expect': expectExpect,
    'max-expects': maxExpects,
    'max-nested-describe': maxNestedDescribe,
    'missing-playwright-await': missingPlaywrightAwait,
    'no-commented-out-tests': noCommentedOutTests,
    'no-conditional-expect': noConditionalExpect,
    'no-conditional-in-test': noConditionalInTest,
    'no-duplicate-hooks': noDuplicateHooks,
    'no-element-handle': noElementHandle,
    'no-eval': noEval,
    'no-focused-test': noFocusedTest,
    'no-force-option': noForceOption,
    'no-get-by-title': noGetByTitle,
    'no-hooks': noHooks,
    'no-nested-step': noNestedStep,
    'no-networkidle': noNetworkidle,
    'no-nth-methods': noNthMethods,
    'no-page-pause': noPagePause,
    'no-raw-locators': noRawLocators,
    'no-restricted-matchers': noRestrictedMatchers,
    'no-skipped-test': noSkippedTest,
    'no-standalone-expect': noStandaloneExpect,
    'no-unsafe-references': noUnsafeReferences,
    'no-useless-await': noUselessAwait,
    'no-useless-not': noUselessNot,
    'no-wait-for-selector': noWaitForSelector,
    'no-wait-for-timeout': noWaitForTimeout,
    'prefer-comparison-matcher': preferComparisonMatcher,
    'prefer-equality-matcher': preferEqualityMatcher,
    'prefer-hooks-in-order': preferHooksInOrder,
    'prefer-hooks-on-top': preferHooksOnTop,
    'prefer-lowercase-title': preferLowercaseTitle,
    'prefer-strict-equal': preferStrictEqual,
    'prefer-to-be': preferToBe,
    'prefer-to-contain': preferToContain,
    'prefer-to-have-count': preferToHaveCount,
    'prefer-to-have-length': preferToHaveLength,
    'prefer-web-first-assertions': preferWebFirstAssertions,
    'require-hook': requireHook,
    'require-soft-assertions': requireSoftAssertions,
    'require-to-throw-message': requireToThrowMessage,
    'require-top-level-describe': requireTopLevelDescribe,
    'valid-describe-callback': validDescribeCallback,
    'valid-expect': validExpect,
    'valid-expect-in-promise': validExpectInPromise,
    'valid-title': validTitle,
  },
}

const sharedConfig = {
  rules: {
    'no-empty-pattern': 'off',
    'playwright/context-close': 'error',
    'playwright/expect-expect': 'warn',
    'playwright/max-nested-describe': 'warn',
    'playwright/missing-playwright-await': 'error',
    'playwright/no-conditional-expect': 'warn',
    'playwright/no-conditional-in-test': 'warn',
    'playwright/no-element-handle': 'warn',
    'playwright/no-eval': 'warn',
    'playwright/no-focused-test': 'error',
    'playwright/no-force-option': 'warn',
    'playwright/no-nested-step': 'warn',
    'playwright/no-networkidle': 'error',
    'playwright/no-page-pause': 'warn',
    'playwright/no-skipped-test': 'warn',
    'playwright/no-standalone-expect': 'error',
    'playwright/no-unsafe-references': 'error',
    'playwright/no-useless-await': 'warn',
    'playwright/no-useless-not': 'warn',
    'playwright/no-wait-for-selector': 'warn',
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/prefer-web-first-assertions': 'error',
    'playwright/valid-describe-callback': 'error',
    'playwright/valid-expect': 'error',
    'playwright/valid-expect-in-promise': 'error',
    'playwright/valid-title': 'error',
  },
} as const

const legacyConfig = {
  ...sharedConfig,
  env: {
    'shared-node-browser': true,
  },
  plugins: ['playwright'],
}

const flatConfig = {
  ...sharedConfig,
  languageOptions: {
    globals: globals['shared-node-browser'],
  },
  plugins: {
    playwright: index,
  },
}

const sharedJestConfig = {
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
} as const

const legacyJestConfig = {
  ...sharedJestConfig,
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
}

const jestConfig = {
  ...sharedJestConfig,
  languageOptions: {
    globals: {
      ...globals['shared-node-browser'],
      ...globals.jest,
      browser: 'writable',
      browserName: 'writable',
      context: 'writable',
      deviceName: 'writable',
      jestPlaywright: 'writable',
      page: 'writable',
    },
  },
  plugins: {
    playwright: index,
  },
}

export = {
  ...index,
  configs: {
    'flat/jest-playwright': jestConfig,
    'flat/recommended': flatConfig,
    'jest-playwright': legacyJestConfig,
    'playwright-test': legacyConfig,
    recommended: legacyConfig,
  },
}
