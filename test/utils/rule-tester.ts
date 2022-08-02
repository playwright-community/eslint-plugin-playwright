import test from '@playwright/test';
import { RuleTester } from 'eslint';

/**
 * @example
 * import rule from '../../src/rules/missing-playwright-await';
 *
 * runRuleTester('missing-playwright-await', rule, {
 *   valid: ['await expect(page.locator('checkbox')).toBeChecked()'],
 *   invalid: ['expect(page.locator('checkbox')).toBeChecked()'],
 * });
 */
export function runRuleTester(...args: Parameters<RuleTester['run']>): void {
  const config = {
    parserOptions: {
      ecmaVersion: 2018,
    },
  };

  new RuleTester(config).run(...args);
}

export const wrapInTest = (input: string) =>
  `test('test', async () => { ${input} })`;

export type Errors = RuleTester.InvalidTestCase['errors'];
