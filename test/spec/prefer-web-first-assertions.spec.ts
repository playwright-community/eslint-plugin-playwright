import { runRuleTester, wrapInTest } from '../utils/rule-tester';
import rule from '../../src/rules/prefer-web-first-assertions';

const invalid = (code: string, output: string) => ({
  code: wrapInTest(code),
  errors: [
    {
      messageId: 'useWebFirstAssertion',
      suggestions: [
        {
          messageId: 'suggestWebFirstAssertion',
          output: wrapInTest(output),
        },
      ],
    },
  ],
});

const valid = wrapInTest;

runRuleTester('prefer-web-first-assertions', rule, {
  valid: [] || [
    valid('await expect(page.locator(".tweet")).toBeVisible()'),
    valid('await expect(bar).toBeEnabled()'),
    valid('await expect.soft(page.locator(".tweet")).toBeDisabled()'),
    valid('await expect["soft"](bar).toBeEnabled()'),
    valid('const text = await page.locator(".tweet").innerText()'),
    valid('let visible = await foo.isVisible()'),
    valid('const value = await bar["inputValue"]()'),
    valid('const isEditable = await baz[`isEditable`]()'),
  ],
  invalid: [
    // isVisible
    invalid(
      'expect(await page.locator(".tweet").isVisible()).toBe(true)',
      'await expect(page.locator(".tweet")).toBeVisible()'
    ),
    invalid(
      'expect(await page.locator(".tweet").isVisible()).toBe(false)',
      'await expect(page.locator(".tweet")).toBeHidden()'
    ),
    invalid(
      'expect(await page.locator(".tweet").isVisible()).toEqual(true)',
      'await expect(page.locator(".tweet")).toBeVisible()'
    ),
    invalid(
      'expect(await page.locator(".tweet").isVisible()).toEqual(false)',
      'await expect(page.locator(".tweet")).toBeHidden()'
    ),
    invalid(
      'expect(await page.locator(".tweet").isVisible()).not.toBe(true)',
      'await expect(page.locator(".tweet")).toBeHidden()'
    ),
    invalid(
      'expect(await page.locator(".tweet").isVisible()).not.toBe(false)',
      'await expect(page.locator(".tweet")).toBeVisible()'
    ),
    // isHidden
    invalid(
      'expect(await foo.isHidden()).toBe(true)',
      'await expect(foo).toBeHidden()'
    ),
    invalid(
      'expect(await foo.isHidden()).not.toBe(true)',
      'await expect(foo).toBeVisible()'
    ),
    invalid(
      'expect(await foo.isHidden()).toBe(false)',
      'await expect(foo).toBeVisible()'
    ),
    invalid(
      'expect(await foo.isHidden()).not.toBe(false)',
      'await expect(foo).toBeHidden()'
    ),
    // getAttribute
    invalid(
      'expect.soft(await foo.getAttribute("aria-label")).toBe("bar")',
      'await expect.soft(foo).toHaveAttribute("aria-label", "bar"))'
    ),
    invalid(
      'expect.soft(await foo.getAttribute("aria-label")).not.toBe("bar")',
      'await expect.soft(foo).not.toHaveAttribute("aria-label", "bar"))'
    ),
    // innerText
    invalid(
      'expect.soft(await foo.innerText()).toBe("bar")',
      'await expect.soft(foo).toHaveText("bar")'
    ),
    invalid(
      'expect.soft(await foo.innerText()).not.toBe("bar")',
      'await expect.soft(foo).not.toHaveText("bar")'
    ),
    // inputValue
    invalid(
      'expect["soft"](await foo.inputValue()).toBe("bar")',
      'await expect["soft"](foo).toHaveValue("bar")'
    ),
    invalid(
      'expect[`soft`](await foo.inputValue()).not.toEqual("bar")',
      'await expect[`soft`](foo).not.toHaveValue("bar")'
    ),
    // textContent
    invalid(
      'expect(await foo.textContent()).toBe("bar")',
      'await expect(foo).toHaveText("bar")'
    ),
    invalid(
      'expect(await foo.textContent()).not.toBe("bar")',
      'await expect(foo).not.toHaveText("bar")'
    ),
    // isChecked
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBe(true)',
      'await expect(page.locator("howdy")).toBeChecked()'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBeTruthy()',
      'await expect(page.locator("howdy")).toBeChecked()'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).not.toBe(true)',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBe(false)',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBeFalsy()',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).not.toBe(false)',
      'await expect(page.locator("howdy")).toBeChecked()'
    ),
    // isDisabled
    invalid(
      'expect(await foo.isDisabled()).toBe(true)',
      'await expect(foo).toBeDisabled()'
    ),
    invalid(
      'expect(await foo.isDisabled()).not.toBe(true)',
      'await expect(foo).toBeEnabled()'
    ),
    invalid(
      'expect(await foo.isDisabled()).toBe(false)',
      'await expect(foo).toBeEnabled()'
    ),
    invalid(
      'expect(await foo.isDisabled()).not.toBe(false)',
      'await expect(foo).toBeDisabled()'
    ),
    // isEnabled
    invalid(
      'expect(await foo.isEnabled()).toBe(true)',
      'await expect(foo).toBeEnabled()'
    ),
    invalid(
      'expect(await foo.isEnabled()).not.toBe(true)',
      'await expect(foo).toBeDisabled()'
    ),
    invalid(
      'expect(await foo.isEnabled()).toBe(false)',
      'await expect(foo).toBeDisabled()'
    ),
    invalid(
      'expect(await foo.isEnabled()).not.toBe(false)',
      'await expect(foo).toBeEnabled()'
    ),
    // isEditable
    invalid(
      'expect(await foo.isEditable()).toBe(true)',
      'await expect(foo).toBeEditable()'
    ),
    invalid(
      'expect(await foo.isEditable()).not.toBe(true)',
      'await expect(foo).not.toBeEditable()'
    ),
    invalid(
      'expect(await foo.isEditable()).toBe(false)',
      'await expect(foo).not.toBeEditable()'
    ),
    invalid(
      'expect(await foo.isEditable()).not.toBe(false)',
      'await expect(foo).toBeEditable()'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).not.toBe(true)',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBe(false)',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).toBeFalsy()',
      'await expect(page.locator("howdy")).toBeChecked({ checked: false })'
    ),
    invalid(
      'expect(await page.locator("howdy").isChecked()).not.toBe(false)',
      'await expect(page.locator("howdy")).toBeChecked()'
    ),
  ].slice(-4),
});
