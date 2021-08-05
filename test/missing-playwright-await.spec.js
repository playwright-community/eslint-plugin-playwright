const { RuleTester } = require("eslint");
const rule = require("../lib/rules/missing-playwright-await");

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const wrapInTest = (input) => `test('a', async () => { ${input} })`;

const invalid = (code, output, options = []) => ({
  code: wrapInTest(code),
  errors: [{ messageId: "missingAwait" }],
  options,
  output: wrapInTest(output),
});

const valid = (code, options = []) => ({
  code: wrapInTest(code),
  options,
});

const options = [{ customMatchers: ["toBeCustomThing"] }];

new RuleTester().run("missing-playwright-await", rule, {
  invalid: [
    invalid(`expect(page).toBeChecked()`, `await expect(page).toBeChecked()`),
    invalid(
      `expect(page).not.toBeEnabled()`,
      `await expect(page).not.toBeEnabled()`
    ),

    // Custom matchers
    invalid(
      `expect(page).toBeCustomThing(false)`,
      `await expect(page).toBeCustomThing(false)`,
      options
    ),
    invalid(
      `expect(page).not.toBeCustomThing(true)`,
      `await expect(page).not.toBeCustomThing(true)`,
      options
    ),
  ],
  valid: [
    valid(`await expect(page).toEqualTitle("text")`),
    valid(`await expect(page).not.toHaveText("text")`),

    // Doesn't require an await when returning
    valid(`return expect(page).toHaveText("text")`),
    {
      code: `const a = () => expect(page).toHaveText("text")`,
      options,
    },

    // Custom matchers
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)"),
    valid("expect(page).toBeCustomThing(true)"),
  ],
});
