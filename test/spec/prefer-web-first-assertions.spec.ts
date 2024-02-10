import rule from '../../src/rules/prefer-web-first-assertions';
import { runRuleTester, test } from '../utils/rule-tester';

runRuleTester('prefer-web-first-assertions', rule, {
  invalid: [
    // isVisible
    {
      code: test('expect(await page.locator(".tweet").isVisible()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toBe(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeHidden', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(true)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeHidden', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(true)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeHidden', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
    },

    // isHidden
    {
      code: test('expect(await foo.isHidden()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeHidden', method: 'isHidden' },
          endColumn: 56,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeHidden()'),
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isHidden' },
          endColumn: 56,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeVisible()'),
    },
    {
      code: test('expect(await foo.isHidden()).toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isHidden' },
          endColumn: 56,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeVisible()'),
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeHidden', method: 'isHidden' },
          endColumn: 56,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeHidden()'),
    },

    // getAttribute
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).toBe("bar")',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveAttribute', method: 'getAttribute' },
          endColumn: 77,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect.soft(foo).toHaveAttribute("aria-label", "bar")',
      ),
    },
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).not.toBe("bar")',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveAttribute', method: 'getAttribute' },
          endColumn: 77,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect.soft(foo).not.toHaveAttribute("aria-label", "bar")',
      ),
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).toBe("bar")',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveAttribute', method: 'getAttribute' },
          endColumn: 93,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect.soft(page.locator("foo")).toHaveAttribute("aria-label", "bar")',
      ),
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).not.toBe("bar")',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveAttribute', method: 'getAttribute' },
          endColumn: 93,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect.soft(page.locator("foo")).not.toHaveAttribute("aria-label", "bar")',
      ),
    },

    // innerText
    {
      code: test('expect.soft(await foo.innerText()).toBe("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveText', method: 'innerText' },
          endColumn: 62,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect.soft(foo).toHaveText("bar")'),
    },
    {
      code: test('expect.soft(await foo.innerText()).not.toBe("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveText', method: 'innerText' },
          endColumn: 62,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect.soft(foo).not.toHaveText("bar")'),
    },

    // inputValue
    {
      code: test('expect["soft"](await foo.inputValue()).toBe("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveValue', method: 'inputValue' },
          endColumn: 66,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect["soft"](foo).toHaveValue("bar")'),
    },
    {
      code: test('expect[`soft`](await foo.inputValue()).not.toEqual("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveValue', method: 'inputValue' },
          endColumn: 66,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect[`soft`](foo).not.toHaveValue("bar")'),
    },

    // textContent
    {
      code: test('expect(await foo.textContent()).toBe("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveText', method: 'textContent' },
          endColumn: 59,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toHaveText("bar")'),
    },
    {
      code: test('expect(await foo.textContent()).not.toBe("bar")'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toHaveText', method: 'textContent' },
          endColumn: 59,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).not.toHaveText("bar")'),
    },

    // isChecked
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(foo)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect(page.locator("howdy")).toBeChecked({ checked: foo })',
      ),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).toBeTruthy()',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(true)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(bar)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test(
        'await expect(page.locator("howdy")).not.toBeChecked({ checked: bar })',
      ),
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBeFalsy()'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeChecked', method: 'isChecked' },
          endColumn: 75,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
    },

    // isDisabled
    {
      code: test('expect(await foo.isDisabled()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeDisabled', method: 'isDisabled' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEnabled', method: 'isDisabled' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEnabled', method: 'isDisabled' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeDisabled', method: 'isDisabled' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeDisabled()'),
    },

    // isEnabled
    {
      code: test('expect(await foo.isEnabled()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEnabled', method: 'isEnabled' },
          endColumn: 57,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeDisabled', method: 'isEnabled' },
          endColumn: 57,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeDisabled', method: 'isEnabled' },
          endColumn: 57,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEnabled', method: 'isEnabled' },
          endColumn: 57,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEnabled()'),
    },

    // isEditable
    {
      code: test('expect(await foo.isEditable()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).not.toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).not.toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(false)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 58,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(foo).toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(true)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBe(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBeFalsy()',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(false)',
      ),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeEditable', method: 'isEditable' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await expect(page.locator("howdy")).toBeEditable()'),
    },
    // Global aliases
    {
      code: test('assert(await page.locator(".tweet").isVisible()).toBe(true)'),
      errors: [
        {
          column: 28,
          data: { matcher: 'toBeVisible', method: 'isVisible' },
          endColumn: 76,
          line: 1,
          messageId: 'useWebFirstAssertion',
        },
      ],
      output: test('await assert(page.locator(".tweet")).toBeVisible()'),
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
  valid: [
    { code: test('await expect(page.locator(".tweet")).toBeVisible()') },
    { code: test('await expect(bar).toBeEnabled()') },
    { code: test('await expect.soft(page.locator(".tweet")).toBeDisabled()') },
    { code: test('await expect["soft"](bar).toBeEnabled()') },
    { code: test('const text = await page.locator(".tweet").innerText()') },
    { code: test('let visible = await foo.isVisible()') },
    { code: test('const value = await bar["inputValue"]()') },
    { code: test('const isEditable = await baz[`isEditable`]()') },
    // Global aliases
    {
      code: test('await assert(page.locator(".tweet")).toBeVisible()'),
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
});
