import * as dedent from 'dedent';
import rule from '../../src/rules/missing-playwright-await';
import { runRuleTester, test } from '../utils/rule-tester';

runRuleTester('missing-playwright-await', rule, {
  invalid: [
    {
      code: test('expect(page).toBeChecked()'),
      errors: [
        {
          column: 28,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      output: test('await expect(page).toBeChecked()'),
    },
    {
      code: test('expect(page).not.toBeEnabled()'),
      errors: [
        {
          column: 28,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      output: test('await expect(page).not.toBeEnabled()'),
    },
    // Custom matchers
    {
      code: test('expect(page).toBeCustomThing(false)'),
      errors: [
        {
          column: 28,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      options: [{ customMatchers: ['toBeCustomThing'] }],
      output: test('await expect(page).toBeCustomThing(false)'),
    },
    {
      code: test('expect(page)["not"][`toBeCustomThing`](true)'),
      errors: [
        {
          column: 28,
          endColumn: 34,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      options: [{ customMatchers: ['toBeCustomThing'] }],
      output: test('await expect(page)["not"][`toBeCustomThing`](true)'),
    },
    // expect.soft
    {
      code: test('expect.soft(page).toBeChecked()'),
      errors: [
        {
          column: 28,
          endColumn: 39,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      output: test('await expect.soft(page).toBeChecked()'),
    },
    {
      code: test('expect["soft"](page)["toBeChecked"]()'),
      errors: [
        {
          column: 28,
          endColumn: 42,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      output: test('await expect["soft"](page)["toBeChecked"]()'),
    },
    {
      code: test('expect[`soft`](page)[`toBeChecked`]()'),
      errors: [
        {
          column: 28,
          endColumn: 42,
          endLine: 1,
          line: 1,
          messageId: 'expect',
        },
      ],
      output: test('await expect[`soft`](page)[`toBeChecked`]()'),
    },
    // expect.poll
    {
      code: test('expect.poll(() => foo).toBe(true)'),
      errors: [
        {
          column: 28,
          endColumn: 39,
          endLine: 1,
          line: 1,
          messageId: 'expectPoll',
        },
      ],
      output: test('await expect.poll(() => foo).toBe(true)'),
    },
    {
      code: test('expect["poll"](() => foo)["toContain"]("bar")'),
      errors: [
        {
          column: 28,
          endColumn: 42,
          endLine: 1,
          line: 1,
          messageId: 'expectPoll',
        },
      ],
      output: test('await expect["poll"](() => foo)["toContain"]("bar")'),
    },
    {
      code: test('expect[`poll`](() => foo)[`toBeTruthy`]()'),
      errors: [
        {
          column: 28,
          endColumn: 42,
          endLine: 1,
          line: 1,
          messageId: 'expectPoll',
        },
      ],
      output: test('await expect[`poll`](() => foo)[`toBeTruthy`]()'),
    },
    // test.step
    {
      code: test("test.step('foo', async () => {})"),
      errors: [
        {
          column: 28,
          endColumn: 37,
          endLine: 1,
          line: 1,
          messageId: 'testStep',
        },
      ],
      output: test("await test.step('foo', async () => {})"),
    },
    {
      code: test("test['step']('foo', async () => {})"),
      errors: [
        {
          column: 28,
          endColumn: 40,
          endLine: 1,
          line: 1,
          messageId: 'testStep',
        },
      ],
      output: test("await test['step']('foo', async () => {})"),
    },
    {
      code: dedent(
        test(`
          const promises = [
            expect(page.locator("foo")).toHaveText("bar"),
            expect(page).toHaveTitle("baz"),
          ]
        `)
      ),
      errors: [
        { column: 4, endColumn: 10, endLine: 3, line: 3, messageId: 'expect' },
        { column: 4, endColumn: 10, endLine: 4, line: 4, messageId: 'expect' },
      ],
      output: dedent(
        test(`
          const promises = [
            await expect(page.locator("foo")).toHaveText("bar"),
            await expect(page).toHaveTitle("baz"),
          ]
        `)
      ),
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
    // Promise.all
    {
      code: test(`
        await Promise.all([
          expect(page.locator("foo")).toHaveText("bar"),
          expect(page).toHaveTitle("baz"),
        ])
      `),
    },
  ],
});
