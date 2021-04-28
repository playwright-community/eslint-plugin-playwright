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
  errors: ["Playwright expectations must be awaited or returned."],
  options,
  output: wrapInTest(output),
});

const valid = (code, options = []) => ({
  code: wrapInTest(code),
  options,
});

const options = [{ customMatchers: ["toBeCustomThing"] }];

const defaultMatchers = [
  "toHaveSelector",
  "toHaveSelectorCount",
  "toHaveText",
  "toEqualText",
  "toEqualValue",
  "toEqualUrl",
  "toHaveFocus",
];

new RuleTester().run("missing-playwright-await", rule, {
  invalid: [
    // Default matchers
    ...defaultMatchers.flatMap((matcher) => [
      invalid(
        `expect(page).${matcher}("text")`,
        `await expect(page).${matcher}("text")`
      ),
      invalid(
        `expect(page).not.${matcher}("text")`,
        `await expect(page).not.${matcher}("text")`
      ),
    ]),

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
    // Default matchers
    ...defaultMatchers.flatMap((matcher) => [
      valid(`await expect(page).${matcher}("text")`),
      valid(`await expect(page).not.${matcher}("text")`),
      valid(`return expect(page).${matcher}("text")`),
    ]),

    // Custom matchers
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)", options),
    valid("await expect(page).toBeCustomThing(true)"),
  ],
});
