import { runTSRuleTester } from '../utils/rule-tester.js'
import validTestTags from './valid-test-tags.js'

runTSRuleTester('valid-test-tags', validTestTags, {
  invalid: [
    // Tag without @ prefix
    {
      code: "test('my test', { tag: 'e2e' }, async ({ page }) => {})",
      errors: [{ messageId: 'invalidTagFormat' }],
    },
    // Invalid tag value type
    {
      code: "test('my test', { tag: 123 }, async ({ page }) => {})",
      errors: [{ messageId: 'invalidTagValue' }],
    },
    // Array of tags without @ prefix
    {
      code: "test('my test', { tag: ['e2e', 'login'] }, async ({ page }) => {})",
      errors: [
        { messageId: 'invalidTagFormat' },
        { messageId: 'invalidTagFormat' },
      ],
    },
    // Tag not in allowedTags list
    {
      code: "test('my test', { tag: '@e2e' }, async ({ page }) => {})",
      errors: [{ data: { tag: '@e2e' }, messageId: 'unknownTag' }],
      options: [{ allowedTags: ['@regression', '@smoke'] }],
    },
    // Tag in disallowedTags list
    {
      code: "test('my test', { tag: '@skip' }, async ({ page }) => {})",
      errors: [{ data: { tag: '@skip' }, messageId: 'disallowedTag' }],
      options: [{ disallowedTags: ['@skip', '@todo'] }],
    },
    // Tag matching disallowed pattern
    {
      code: "test('my test', { tag: '@temp-123' }, async ({ page }) => {})",
      errors: [{ data: { tag: '@temp-123' }, messageId: 'disallowedTag' }],
      options: [{ disallowedTags: ['@skip', /^@temp-/] }],
    },
    // Tag not matching allowed pattern
    {
      code: "test('my test', { tag: '@my-tag-abc' }, async ({ page }) => {})",
      errors: [{ data: { tag: '@my-tag-abc' }, messageId: 'unknownTag' }],
      options: [{ allowedTags: ['@regression', /^@my-tag-\d+$/] }],
    },
    // Invalid tag in test.skip
    {
      code: "test.skip('my test', { tag: 'e2e' }, async ({ page }) => {})",
      errors: [{ messageId: 'invalidTagFormat' }],
    },
    // Invalid tag in test.fixme
    {
      code: "test.fixme('my test', { tag: 'e2e' }, async ({ page }) => {})",
      errors: [{ messageId: 'invalidTagFormat' }],
    },
    // Invalid tag in test.only
    {
      code: "test.only('my test', { tag: 'e2e' }, async ({ page }) => {})",
      errors: [{ messageId: 'invalidTagFormat' }],
    },
  ],
  valid: [
    // Basic tag validation
    {
      code: "test('my test', { tag: '@e2e' }, async ({ page }) => {})",
    },
    {
      code: "test('my test', { tag: ['@e2e', '@login'] }, async ({ page }) => {})",
    },
    {
      code: "test.describe('my suite', { tag: '@regression' }, () => {})",
    },
    {
      code: "test.step('my step', { tag: '@critical' }, async () => {})",
    },
    // No tag (valid)
    {
      code: "test('my test', async ({ page }) => {})",
    },
    // Other options without tag (valid)
    {
      code: "test('my test', { timeout: 5000 }, async ({ page }) => {})",
    },
    // Allowed tags
    {
      code: "test('my test', { tag: '@regression' }, async ({ page }) => {})",
      options: [{ allowedTags: ['@regression', '@smoke'] }],
    },
    {
      code: "test('my test', { tag: '@my-tag-123' }, async ({ page }) => {})",
      options: [{ allowedTags: ['@regression', /^@my-tag-\d+$/] }],
    },
    // Not in disallowed tags
    {
      code: "test('my test', { tag: '@e2e' }, async ({ page }) => {})",
      options: [{ disallowedTags: ['@skip', '@todo'] }],
    },
    {
      code: "test('my test', { tag: '@my-tag-123' }, async ({ page }) => {})",
      options: [{ disallowedTags: ['@skip', /^@temp-/] }],
    },
    // Valid tags with test.skip
    {
      code: "test.skip('my test', { tag: '@e2e' }, async ({ page }) => {})",
    },
    // Valid tags with test.fixme
    {
      code: "test.fixme('my test', { tag: '@e2e' }, async ({ page }) => {})",
    },
    // Valid tags with test.only
    {
      code: "test.only('my test', { tag: '@e2e' }, async ({ page }) => {})",
    },
    // Tag with annotation
    {
      code: "test('my test', { tag: '@e2e', annotation: { type: 'issue', description: 'BUG-123' } }, async ({ page }) => {})",
    },
    // Tag with array of annotations
    {
      code: "test('my test', { tag: '@e2e', annotation: [{ type: 'issue', description: 'BUG-123' }, { type: 'flaky' }] }, async ({ page }) => {})",
    },
    // Array of tags with annotation
    {
      code: "test('my test', { tag: ['@e2e', '@login'], annotation: { type: 'issue', description: 'BUG-123' } }, async ({ page }) => {})",
    },
    // Tag with annotation in test.skip
    {
      code: "test.skip('my test', { tag: '@e2e', annotation: { type: 'issue', description: 'BUG-123' } }, async ({ page }) => {})",
    },
    // Tag with annotation in test.fixme
    {
      code: "test.fixme('my test', { tag: '@e2e', annotation: { type: 'issue', description: 'BUG-123' } }, async ({ page }) => {})",
    },
    // Tag with annotation in test.only
    {
      code: "test.only('my test', { tag: '@e2e', annotation: { type: 'issue', description: 'BUG-123' } }, async ({ page }) => {})",
    },
  ],
})
