module.exports = {
  configs: {
    recommended: {
      env: {
        node: true,
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