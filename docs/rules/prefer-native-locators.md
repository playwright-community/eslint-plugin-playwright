# Suggest using native Playwright locators (`prefer-native-locators`)

Playwright has built-in locators for common query selectors such as finding
elements by placeholder text, ARIA role, accessible name, and more. This rule
suggests using these native locators instead of using `page.locator()` with an
equivalent selector.

In some cases this can be more robust too, such as finding elements by ARIA role
or accessible name, because some elements have implicit roles, and there are
multiple ways to specify accessible names.

## Rule details

Examples of **incorrect** code for this rule:

```javascript
page.locator('[aria-label="View more"]')
page.locator('[role="button"]')
page.locator('[placeholder="Enter some text..."]')
page.locator('[alt="Playwright logo"]')
page.locator('[title="Additional context"]')
page.locator('[data-testid="password-input"]')
```

Examples of **correct** code for this rule:

```javascript
page.getByLabel('View more')
page.getByRole('Button')
page.getByPlaceholder('Enter some text...')
page.getByAltText('Playwright logo')
page.getByTestId('password-input')
page.getByTitle('Additional context')
```
