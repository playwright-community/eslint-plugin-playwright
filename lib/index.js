const missingPlaywrightAwait = require("./rules/missing-playwright-await");
const noPagePause = require("./rules/no-page-pause");
const noElementHandle = require("./rules/no-element-handle");
const noEval = require("./rules/no-eval");
const noFocusedTest = require("./rules/no-focused-test");
const noSkippedTest = require("./rules/no-skipped-test");
const noWaitForTimeout = require("./rules/no-wait-for-timeout");
const noForceOption = require("./rules/no-force-option");

module.exports = {
  configs: {
    "playwright-test": {
      plugins: ["playwright"],
      env: {
        "shared-node-browser": true,
      },
      rules: {
        "no-empty-pattern": "off",
        "playwright/missing-playwright-await": "error",
        "playwright/no-page-pause": "warn",
        "playwright/no-element-handle": "warn",
        "playwright/no-eval": "warn",
        "playwright/no-focused-test": "error",
        "playwright/no-skipped-test": "warn",
        "playwright/no-wait-for-timeout": "warn",
        "playwright/no-force-option": "warn",
      },
    },
    "jest-playwright": {
      plugins: ["jest", "playwright"],
      env: {
        "shared-node-browser": true,
        jest: true,
      },
      rules: {
        "playwright/missing-playwright-await": "error",
        "playwright/no-page-pause": "warn",
        "jest/no-standalone-expect": [
          "error",
          {
            additionalTestBlockFunctions: [
              "test.jestPlaywrightDebug",
              "it.jestPlaywrightDebug",
              "test.jestPlaywrightSkip",
              "it.jestPlaywrightSkip",
              "test.jestPlaywrightConfig",
              "it.jestPlaywrightConfig",
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
    "missing-playwright-await": missingPlaywrightAwait,
    "no-page-pause": noPagePause,
    "no-element-handle": noElementHandle,
    "no-eval": noEval,
    "no-focused-test": noFocusedTest,
    "no-skipped-test": noSkippedTest,
    "no-wait-for-timeout": noWaitForTimeout,
    "no-force-option": noForceOption,
  },
};
