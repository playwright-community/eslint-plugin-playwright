const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-element-handle');

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const wrapInTest = (input) => `test('verify noElementHandle rule', async () => { ${input} })`;

const invalid = (code, output) => ({
  code: wrapInTest(code),
  errors: [{ messageId: 'noElementHandle' }],
  output: wrapInTest(output),
});

const valid = (code) => ({
  code: wrapInTest(code),
});

new RuleTester().run('no-element-handle', rule, {
  invalid: [
    // element handle as const
    invalid("const handle = await page.$('text=Submit');", "const handle = page.locator('text=Submit');"),

    // element handle as let
    invalid("let handle = await page.$('text=Submit');", "let handle = page.locator('text=Submit');"),

    // element handle as expression statement
    invalid('await page.$("div")', 'page.locator("div")'),

    // element handle click
    invalid('await (await page.$$("div")).click();', 'await (page.locator("div")).click();'),

    // element handles as const
    invalid('const handles = await page.$$("a")', 'const handles = page.locator("a")'),

    // element handles as let
    invalid('let handles = await page.$$("a")', 'let handles = page.locator("a")'),

    // element handles as expression statement
    invalid('await page.$$("a")', 'page.locator("a")'),
  ],
  valid: [
    // page locator
    valid('page.locator("a")'),

    // page locator with action
    valid('await page.locator("a").click();'),
  ],
});
