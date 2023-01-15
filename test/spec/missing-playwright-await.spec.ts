import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/missing-playwright-await';

runRuleTester('missing-playwright-await', rule, {
  invalid: [
    {
      code: test('expect(page).toBeChecked()'),
      output: test('await expect(page).toBeChecked()'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 34,
        },
      ],
    },
    {
      code: test('expect(page).not.toBeEnabled()'),
      output: test('await expect(page).not.toBeEnabled()'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 34,
        },
      ],
    },
    // Custom matchers
    {
      code: test('expect(page).toBeCustomThing(false)'),
      output: test('await expect(page).toBeCustomThing(false)'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 34,
        },
      ],
      options: [{ customMatchers: ['toBeCustomThing'] }],
    },
    {
      code: test('expect(page)["not"][`toBeCustomThing`](true)'),
      output: test('await expect(page)["not"][`toBeCustomThing`](true)'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 34,
        },
      ],
      options: [{ customMatchers: ['toBeCustomThing'] }],
    },
    // expect.soft
    {
      code: test('expect.soft(page).toBeChecked()'),
      output: test('await expect.soft(page).toBeChecked()'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 39,
        },
      ],
    },
    {
      code: test('expect["soft"](page)["toBeChecked"]()'),
      output: test('await expect["soft"](page)["toBeChecked"]()'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 42,
        },
      ],
    },
    {
      code: test('expect[`soft`](page)[`toBeChecked`]()'),
      output: test('await expect[`soft`](page)[`toBeChecked`]()'),
      errors: [
        {
          messageId: 'expect',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 42,
        },
      ],
    },
    // expect.poll
    {
      code: test('expect.poll(() => foo).toBe(true)'),
      output: test('await expect.poll(() => foo).toBe(true)'),
      errors: [
        {
          messageId: 'expectPoll',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 39,
        },
      ],
    },
    {
      code: test('expect["poll"](() => foo)["toContain"]("bar")'),
      output: test('await expect["poll"](() => foo)["toContain"]("bar")'),
      errors: [
        {
          messageId: 'expectPoll',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 42,
        },
      ],
    },
    {
      code: test('expect[`poll`](() => foo)[`toBeTruthy`]()'),
      output: test('await expect[`poll`](() => foo)[`toBeTruthy`]()'),
      errors: [
        {
          messageId: 'expectPoll',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 42,
        },
      ],
    },
    // test.step
    {
      code: test("test.step('foo', async () => {})"),
      output: test("await test.step('foo', async () => {})"),
      errors: [
        {
          messageId: 'testStep',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 37,
        },
      ],
    },
    {
      code: test("test['step']('foo', async () => {})"),
      output: test("await test['step']('foo', async () => {})"),
      errors: [
        {
          messageId: 'testStep',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 40,
        },
      ],
    },
  ],
  valid: [
    { code: test('await expect(page).toBeEditable') },
    { code: test('await expect(page).toEqualTitle("text")') },
    { code: test('await expect(page).not.toHaveText("text")') },

    // Doesn't require an await when returning
    { code: test('return expect(page).toHaveText("text")') },
    {
      code: test('const a = () => expect(page).toHaveText("text")'),
      options: [{ customMatchers: ['toBeCustomThing'] }],
    },

    // Custom matchers
    {
      code: test('await expect(page).toBeCustomThing(true)'),
      options: [{ customMatchers: ['toBeCustomThing'] }],
    },
    { code: test('await expect(page).toBeCustomThing(true)') },
    { code: test('expect(page).toBeCustomThing(true)') },
    {
      code: test('await expect(page).toBeAsync(true)'),
      options: [{ customMatchers: ['toBeAsync'] }],
    },

    // expect.soft
    { code: test('await expect.soft(page).toHaveText("text")') },
    { code: test('await expect.soft(page).not.toHaveText("text")') },

    // expect.poll
    { code: test('await expect.poll(() => foo).toBe("text")') },
    { code: test('await expect["poll"](() => foo).toContain("text")') },
    { code: test('await expect[`poll`](() => foo).toBeTruthy()') },

    // test.step
    { code: test("await test.step('foo', async () => {})") },
  ],
});
