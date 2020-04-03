module.exports = {
  configs: {
    recommended: {
      env: {
        'shared-node-browser': true,
        jest: true,
      },
      globals: {
        browser: true,
        context: true,
        page: true,
        jestPlaywright: true,
      }
    }
  },
}