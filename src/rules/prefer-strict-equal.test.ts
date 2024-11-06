import rule from '../../src/rules/prefer-strict-equal.js'
import { runRuleTester } from '../utils/rule-tester.js'

runRuleTester('prefer-strict-equal', rule, {
  invalid: [
    {
      code: 'expect(something).toEqual(somethingElse);',
      errors: [
        {
          column: 19,
          endColumn: 26,
          line: 1,
          messageId: 'useToStrictEqual',
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'expect(something).toStrictEqual(somethingElse);',
            },
          ],
        },
      ],
    },
    {
      code: 'expect(something)["toEqual"](somethingElse);',
      errors: [
        {
          column: 19,
          endColumn: 28,
          line: 1,
          messageId: 'useToStrictEqual',
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'expect(something)["toStrictEqual"](somethingElse);',
            },
          ],
        },
      ],
    },
    // Global aliases
    {
      code: 'assert(something).toEqual(somethingElse);',
      errors: [
        {
          column: 19,
          endColumn: 26,
          line: 1,
          messageId: 'useToStrictEqual',
          suggestions: [
            {
              messageId: 'suggestReplaceWithStrictEqual',
              output: 'assert(something).toStrictEqual(somethingElse);',
            },
          ],
        },
      ],
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
  valid: [
    'expect(something).toStrictEqual(somethingElse);',
    "a().toEqual('b')",
    'expect(a);',
    // Global aliases
    {
      code: 'assert(something).toStrictEqual(somethingElse);',
      settings: {
        playwright: {
          globalAliases: { expect: ['assert'] },
        },
      },
    },
  ],
})
