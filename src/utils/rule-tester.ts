import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

// Override the default `it` and `describe` functions to use `vitest`
;(RuleTester as any).it = it
;(RuleTester as any).describe = describe

/**
 * @example
 *   import rule from '../../src/rules/missing-playwright-await';
 *
 *   runRuleTester('missing-playwright-await', rule, {
 *   invalid: ['expect(page.locator('checkbox')).toBeChecked()'],
 *   valid: ['await expect(page.locator('checkbox')).toBeChecked()'],
 *   });
 */
export function runRuleTester(...args: Parameters<RuleTester['run']>) {
  const config = {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  }

  return new RuleTester(config).run(...args)
}

export function runTSRuleTester(...args: Parameters<RuleTester['run']>) {
  const config = {
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  }

  return new RuleTester(config).run(...args)
}

export const test = (input: string) => `test('test', async () => { ${input} })`
