import rule from '../../src/rules/prefer-inner-text';
import { runRuleTester } from '../utils/rule-tester';
import dedent = require('dedent');

runRuleTester('prefer-inner-text', rule, {
  valid: [
    "page.locator('').innerText()",
    "this.page.locator('').innerText()",
    "locator('').innerText()",
    "await locator('').innerText()",
    {
      code: dedent`
        const node = page.locator('div');
        const text = await node.innerText();
      `,
    },
    "function innerText() {}",
    "const innerText = \"test\"",
    dedent`
      const test = { textContent: 'test' }
      test.textContent
    `,
    dedent`
      const test = { textContent: () => 'test' }
      test.textContent()
    `   
  ],
  invalid: [
    {
      code: "locator('').textContent()",
      errors: [
        {
          messageId: 'useInnerText',
          suggestions: [
            {
              messageId: 'suggestReplaceWithInnerText',
              output: "locator('').innerText()",
            },
          ],
          column: 13,
          endColumn: 24,
          line: 1,
        },
      ],
    },
    {
      code: "page.locator('').textContent()",
      errors: [
        {
          messageId: 'useInnerText',
          suggestions: [
            {
              messageId: 'suggestReplaceWithInnerText',
              output: "page.locator('').innerText()",
            },
          ],
          column: 18,
          endColumn: 29,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        const node = page.locator('div');
        const text = await node.textContent();
      `,
      errors: [
        {
          messageId: 'useInnerText',
          suggestions: [
            {
              messageId: 'suggestReplaceWithInnerText',
              output: dedent`
                const node = page.locator('div');
                const text = await node.innerText();
              `,
            },
          ],
          column: 25,
          endColumn: 36,
          line: 2,
        },
      ],
    },
    {
      code: dedent`
        const node = this.page.locator('div');
        const text = await node.textContent();
      `,
      errors: [
        {
          messageId: 'useInnerText',
          suggestions: [
            {
              messageId: 'suggestReplaceWithInnerText',
              output: dedent`
                const node = this.page.locator('div');
                const text = await node.innerText();
              `,
            },
          ],
          column: 25,
          endColumn: 36,
          line: 2,
        },
      ],
    }
  ],
});
