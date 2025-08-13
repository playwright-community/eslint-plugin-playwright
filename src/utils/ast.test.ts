import { describe, it, expect } from 'vitest'
import type { Rule } from 'eslint'
import { getImportedAliases } from './ast.js'

describe('getImportedAliases', () => {
  it('supports ImportSpecifier.imported as Literal', () => {
    // Intentionally construct a nonstandard/synthetic AST: in valid JS parsed by
    // standard ESTree parsers, `ImportSpecifier.imported` is an Identifier.
    // Here we use a Literal ('test') to ensure `getImportedAliases` gracefully
    // handles such shapes and still treats `import { test as it }` as aliasing.
    const program: any = {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportSpecifier',
              imported: { type: 'Literal', value: 'test', raw: "'test'" },
              local: { type: 'Identifier', name: 'it' },
            },
          ],
          source: {
            type: 'Literal',
            value: '@playwright/test',
            raw: "'@playwright/test'",
          },
        },
      ],
    }

    const context = {
      sourceCode: { ast: program },
    } as unknown as Rule.RuleContext
    const aliases = getImportedAliases(context, 'test')
    expect(aliases).toEqual(['it'])
  })
})
