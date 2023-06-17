import { runRuleTester, test } from '../utils/rule-tester';
import rule from '../../src/rules/prefer-web-first-assertions';

const error = (output: string) => [
  {
    messageId: 'useWebFirstAssertion',
    suggestions: [
      {
        messageId: 'suggestWebFirstAssertion',
        output: test(output),
      },
    ],
  },
];

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
      errors: error('await expect(page.locator(".tweet")).toBeVisible()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toBe(false)'
      ),
      errors: error('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(true)'
      ),
      errors: error('await expect(page.locator(".tweet")).toBeVisible()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).toEqual(false)'
      ),
      errors: error('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(true)'
      ),
      errors: error('await expect(page.locator(".tweet")).toBeHidden()'),
    },
    {
      code: test(
        'expect(await page.locator(".tweet").isVisible()).not.toBe(false)'
      ),
      errors: error('await expect(page.locator(".tweet")).toBeVisible()'),
    },

    // isHidden
    {
      code: test('expect(await foo.isHidden()).toBe(true)'),
      errors: error('await expect(foo).toBeHidden()'),
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(true)'),
      errors: error('await expect(foo).toBeVisible()'),
    },
    {
      code: test('expect(await foo.isHidden()).toBe(false)'),
      errors: error('await expect(foo).toBeVisible()'),
    },
    {
      code: test('expect(await foo.isHidden()).not.toBe(false)'),
      errors: error('await expect(foo).toBeHidden()'),
    },

    // getAttribute
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).toBe("bar")'
      ),
      errors: error(
        'await expect.soft(foo).toHaveAttribute("aria-label", "bar")'
      ),
    },
    {
      code: test(
        'expect.soft(await foo.getAttribute("aria-label")).not.toBe("bar")'
      ),
      errors: error(
        'await expect.soft(foo).not.toHaveAttribute("aria-label", "bar")'
      ),
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).toBe("bar")'
      ),
      errors: error(
        'await expect.soft(page.locator("foo")).toHaveAttribute("aria-label", "bar")'
      ),
    },
    {
      code: test(
        'expect.soft(await page.locator("foo").getAttribute("aria-label")).not.toBe("bar")'
      ),
      errors: error(
        'await expect.soft(page.locator("foo")).not.toHaveAttribute("aria-label", "bar")'
      ),
    },

    // innerText
    {
      code: test('expect.soft(await foo.innerText()).toBe("bar")'),
      errors: error('await expect.soft(foo).toHaveText("bar")'),
    },
    {
      code: test('expect.soft(await foo.innerText()).not.toBe("bar")'),
      errors: error('await expect.soft(foo).not.toHaveText("bar")'),
    },

    // inputValue
    {
      code: test('expect["soft"](await foo.inputValue()).toBe("bar")'),
      errors: error('await expect["soft"](foo).toHaveValue("bar")'),
    },
    {
      code: test('expect[`soft`](await foo.inputValue()).not.toEqual("bar")'),
      errors: error('await expect[`soft`](foo).not.toHaveValue("bar")'),
    },

    // textContent
    {
      code: test('expect(await foo.textContent()).toBe("bar")'),
      errors: error('await expect(foo).toHaveText("bar")'),
    },
    {
      code: test('expect(await foo.textContent()).not.toBe("bar")'),
      errors: error('await expect(foo).not.toHaveText("bar")'),
    },

    // isChecked
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(true)'),
      errors: error('await expect(page.locator("howdy")).toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).toBeTruthy()'
      ),
      errors: error('await expect(page.locator("howdy")).toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(true)'
      ),
      errors: error('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBe(false)'),
      errors: error('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test('expect(await page.locator("howdy").isChecked()).toBeFalsy()'),
      errors: error('await expect(page.locator("howdy")).not.toBeChecked()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isChecked()).not.toBe(false)'
      ),
      errors: error('await expect(page.locator("howdy")).toBeChecked()'),
    },

    // isDisabled
    {
      code: test('expect(await foo.isDisabled()).toBe(true)'),
      errors: error('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(true)'),
      errors: error('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).toBe(false)'),
      errors: error('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isDisabled()).not.toBe(false)'),
      errors: error('await expect(foo).toBeDisabled()'),
    },

    // isEnabled
    {
      code: test('expect(await foo.isEnabled()).toBe(true)'),
      errors: error('await expect(foo).toBeEnabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(true)'),
      errors: error('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).toBe(false)'),
      errors: error('await expect(foo).toBeDisabled()'),
    },
    {
      code: test('expect(await foo.isEnabled()).not.toBe(false)'),
      errors: error('await expect(foo).toBeEnabled()'),
    },

    // isEditable
    {
      code: test('expect(await foo.isEditable()).toBe(true)'),
      errors: error('await expect(foo).toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(true)'),
      errors: error('await expect(foo).not.toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).toBe(false)'),
      errors: error('await expect(foo).not.toBeEditable()'),
    },
    {
      code: test('expect(await foo.isEditable()).not.toBe(false)'),
      errors: error('await expect(foo).toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(true)'
      ),
      errors: error('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBe(false)'
      ),
      errors: error('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).toBeFalsy()'
      ),
      errors: error('await expect(page.locator("howdy")).not.toBeEditable()'),
    },
    {
      code: test(
        'expect(await page.locator("howdy").isEditable()).not.toBe(false)'
      ),
      errors: error('await expect(page.locator("howdy")).toBeEditable()'),
    },
  ],
});
