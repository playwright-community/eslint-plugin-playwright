const { RuleTester } = require("eslint");
const rule = require("../lib/rules/missing-playwright-await");

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

const wrapInTest = (input) => `test('a', async () => { ${input} })`;

const invalid = (messageId, code, output, options = []) => ({
  code: wrapInTest(code),
  errors: [{ messageId }],
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
    invalid(
      "expect",
      "expect(page).toBeChecked()",
      "await expect(page).toBeChecked()"
    ),
    invalid(
      "expect",
      "expect(page).not.toBeEnabled()",
      "await expect(page).not.toBeEnabled()"
    ),

    // Custom matchers
    invalid(
      "expect",
      "expect(page).toBeCustomThing(false)",
      "await expect(page).toBeCustomThing(false)",
      options
    ),
    invalid(
      "expect",
      "expect(page).not.toBeCustomThing(true)",
      "await expect(page).not.toBeCustomThing(true)",
      options
    ),

    // test.step
    invalid(
      "testStep",
      "test.step('foo', async () => {})",
      "await test.step('foo', async () => {})"
    ),
  ],
  valid: [
    valid('await expect(page).toEqualTitle("text")'),
    valid('await expect(page).not.toHaveText("text")'),

    // Doesn't require an await when returning
    valid('return expect(page).toHaveText("text")'),
    {
      code: 'const a = () => expect(page).toHaveText("text")',
      options,
    },

    // Custom matchers
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)"),
    valid("expect(page).toBeCustomThing(true)"),

    // test.step
    valid("await test.step('foo', async () => {})"),
  ],
});
