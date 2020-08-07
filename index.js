module.exports = {
  configs: {
    recommended: {
      env: {
        'shared-node-browser': true,
        jest: true,
      },
      rules: {
        'jest/no-standalone-expect': [
          'error',
          { 'additionalTestBlockFunctions':
            ['test.jestPlaywrightDebug',
              'it.jestPlaywrightDebug',
              'test.jestPlaywrightSkip',
              'it.jestPlaywrightSkip',
              'test.jestPlaywrightConfig',
              'it.jestPlaywrightConfig']
          }
      ]},
      globals: {
        browserName: true,
        deviceName: true,
        browser: true,
        context: true,
        page: true,
        jestPlaywright: true,
      }
    }
  },
}
