const { RuleTester } = require('eslint');

/**
 *
 * @param {string} name - The name of the rule
 * @param {string} rule - Path to the rule to test
 * @param {Object} tests - The tests to run
 * @param {string[]} tests.valid - Valid tests
 * @param {string[]} tests.invalid - Invalid tests
 *
 * @example
 * const rule = require('../lib/rules/missing-playwright-await');
 *
 * runRuleTester('missing-playwright-await', rule, {
 *   valid: ['await expect(page.locator('checkbox')).toBeChecked()'],
 *   invalid: ['expect(page.locator('checkbox')).toBeChecked()'],
 * });
 */
function runRuleTester(name, rule, tests) {
  const config = {
    parserOptions: {
      ecmaVersion: 2018,
    },
  };

  return new RuleTester(config).run(name, rule, tests);
}

const wrapInTest = (input) => `test('test', async () => { ${input} })`;

module.exports = {
  runRuleTester,
  wrapInTest,
};
