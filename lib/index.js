const missingPlaywrightAwait = require("./rules/missing-playwright-await");
const noPagePause = require("./rules/no-page-pause");
const noElementHandle = require("./rules/no-element-handle");
const noEval = require("./rules/no-eval");

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
  },
};
