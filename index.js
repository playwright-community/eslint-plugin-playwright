module.exports = {
  configs: {
    recommended: {
      env: {
        'shared-node-browser': true,
        jest: true,
      },
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
