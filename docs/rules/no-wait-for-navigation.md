# Disallow usage of `page.waitForNavigation` (`no-wait-for-navigation`)

## Rule Details

Example of **incorrect** code for this rule:

Example 1
```javascript
await page.waitForNavigation('#foo')
```

Example 2
```javascript
const navigationPromise = page.waitForNavigation();
await page.getByText('Navigate after timeout').click();
await navigationPromise;
```

Examples of **correct** code for this rule:

Example 1
```javascript
await page.waitForURL('#foo')
```

Example 2
```javascript
await page.click('adelayed-navigation'); 
await page.waitForURL('**/target html');
```