const { RuleTester } = require("eslint");
const rule = require("../lib/rules/no-page-pause");

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const wrapInTest = (input) => `test('a', async () => { ${input} })`;

const invalid = (code) => ({
  code: wrapInTest(code),
  errors: [{ messageId: "noPagePause" }],
});

const valid = (code) => ({
  code: wrapInTest(code),
});

new RuleTester().run("no-page-pause", rule, {
  invalid: [invalid("await page.pause()")],
  valid: [
    valid("await page.click()"),
    valid("await expect(page).toBePaused()"),
  ],
});
