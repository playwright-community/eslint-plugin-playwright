import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/prefer-web-first-assertions';

runRuleTester('prefer-web-first-assertions', rule, {
  valid: [
    { code: test('await expect(page.locator(".tweet")).toBeVisible()') },
    { code: test('await expect(bar).toBeEnabled()') },
    { code: test('await expect.soft(page.locator(".tweet")).toBeDisabled()') },
    { code: test('await expect["soft"](bar).toBeEnabled()') },
    { code: test('const text = await page.locator(".tweet").innerText()') },
    { code: test('let visible = await foo.isVisible()') },
    { code: test('const value = await bar["inputValue"]()') },
    { code: test('const isEditable = await baz[`isEditable`]()') },
  ],
  invalid: [
    // isVisible
    {
      code: test('expect(await page.locator(".tweet").isVisible()).toBe(true)'),
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeVisible' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toBe(false)'
      ),
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeHidden' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(true)'
      ),
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeVisible' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(false)'
      ),
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeHidden' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(true)'
      ),
      output: test('await expect(page.locator(".tweet")).toBeHidden()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeHidden' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(false)'
      ),
      output: test('await expect(page.locator(".tweet")).toBeVisible()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isVisible', matcher: 'toBeVisible' },
        },
      ],
    },

    // isHidden
    {
      code: test('expect(await foo.isHidden()).toBe(true)'),
      output: test('await expect(foo).toBeHidden()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 56,
          data: { method: 'isHidden', matcher: 'toBeHidden' },
        },
      ],
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(true)'),
      output: test('await expect(foo).toBeVisible()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 56,
          data: { method: 'isHidden', matcher: 'toBeVisible' },
        },
      ],
    },
    {
      code: test('expect(await foo.isHidden()).toBe(false)'),
      output: test('await expect(foo).toBeVisible()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 56,
          data: { method: 'isHidden', matcher: 'toBeVisible' },
        },
      ],
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(false)'),
      output: test('await expect(foo).toBeHidden()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 56,
          data: { method: 'isHidden', matcher: 'toBeHidden' },
        },
      ],
    },

    // getAttribute
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).toBe("bar")'
      ),
      output: test(
        'await expect.soft(foo).toHaveAttribute("aria-label", "bar")'
      ),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 77,
          data: { method: 'getAttribute', matcher: 'toHaveAttribute' },
        },
      ],
    },
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).not.toBe("bar")'
      ),
      output: test(
        'await expect.soft(foo).not.toHaveAttribute("aria-label", "bar")'
      ),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 77,
          data: { method: 'getAttribute', matcher: 'toHaveAttribute' },
        },
      ],
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).toBe("bar")'
      ),
      output: test(
        'await expect.soft(page.locator("foo")).toHaveAttribute("aria-label", "bar")'
      ),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 93,
          data: { method: 'getAttribute', matcher: 'toHaveAttribute' },
        },
      ],
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).not.toBe("bar")'
      ),
      output: test(
        'await expect.soft(page.locator("foo")).not.toHaveAttribute("aria-label", "bar")'
      ),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 93,
          data: { method: 'getAttribute', matcher: 'toHaveAttribute' },
        },
      ],
    },

    // innerText
    {
      code: test('expect.soft(await foo.innerText()).toBe("bar")'),
      output: test('await expect.soft(foo).toHaveText("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 62,
          data: { method: 'innerText', matcher: 'toHaveText' },
        },
      ],
    },
    {
      code: test('expect.soft(await foo.innerText()).not.toBe("bar")'),
      output: test('await expect.soft(foo).not.toHaveText("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 62,
          data: { method: 'innerText', matcher: 'toHaveText' },
        },
      ],
    },

    // inputValue
    {
      code: test('expect["soft"](await foo.inputValue()).toBe("bar")'),
      output: test('await expect["soft"](foo).toHaveValue("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 66,
          data: { method: 'inputValue', matcher: 'toHaveValue' },
        },
      ],
    },
    {
      code: test('expect[`soft`](await foo.inputValue()).not.toEqual("bar")'),
      output: test('await expect[`soft`](foo).not.toHaveValue("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 66,
          data: { method: 'inputValue', matcher: 'toHaveValue' },
        },
      ],
    },

    // textContent
    {
      code: test('expect(await foo.textContent()).toBe("bar")'),
      output: test('await expect(foo).toHaveText("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 59,
          data: { method: 'textContent', matcher: 'toHaveText' },
        },
      ],
    },
    {
      code: test('expect(await foo.textContent()).not.toBe("bar")'),
      output: test('await expect(foo).not.toHaveText("bar")'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 59,
          data: { method: 'textContent', matcher: 'toHaveText' },
        },
      ],
    },

    // isChecked
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(true)'),
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).toBeTruthy()'
      ),
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(true)'
      ),
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(false)'),
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBeFalsy()'),
      output: test('await expect(page.locator("howdy")).not.toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(false)'
      ),
      output: test('await expect(page.locator("howdy")).toBeChecked()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 75,
          data: { method: 'isChecked', matcher: 'toBeChecked' },
        },
      ],
    },

    // isDisabled
    {
      code: test('expect(await foo.isDisabled()).toBe(true)'),
      output: test('await expect(foo).toBeDisabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isDisabled', matcher: 'toBeDisabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(true)'),
      output: test('await expect(foo).toBeEnabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isDisabled', matcher: 'toBeEnabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isDisabled()).toBe(false)'),
      output: test('await expect(foo).toBeEnabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isDisabled', matcher: 'toBeEnabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(false)'),
      output: test('await expect(foo).toBeDisabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isDisabled', matcher: 'toBeDisabled' },
        },
      ],
    },

    // isEnabled
    {
      code: test('expect(await foo.isEnabled()).toBe(true)'),
      output: test('await expect(foo).toBeEnabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 57,
          data: { method: 'isEnabled', matcher: 'toBeEnabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(true)'),
      output: test('await expect(foo).toBeDisabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 57,
          data: { method: 'isEnabled', matcher: 'toBeDisabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEnabled()).toBe(false)'),
      output: test('await expect(foo).toBeDisabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 57,
          data: { method: 'isEnabled', matcher: 'toBeDisabled' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(false)'),
      output: test('await expect(foo).toBeEnabled()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 57,
          data: { method: 'isEnabled', matcher: 'toBeEnabled' },
        },
      ],
    },

    // isEditable
    {
      code: test('expect(await foo.isEditable()).toBe(true)'),
      output: test('await expect(foo).toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(true)'),
      output: test('await expect(foo).not.toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEditable()).toBe(false)'),
      output: test('await expect(foo).not.toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(false)'),
      output: test('await expect(foo).toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 58,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(true)'
      ),
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBe(false)'
      ),
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBeFalsy()'
      ),
      output: test('await expect(page.locator("howdy")).not.toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(false)'
      ),
      output: test('await expect(page.locator("howdy")).toBeEditable()'),
      errors: [
        {
          messageId: 'useWebFirstAssertion',
          line: 1,
          column: 28,
          endColumn: 76,
          data: { method: 'isEditable', matcher: 'toBeEditable' },
        },
      ],
    },
  ],
});
