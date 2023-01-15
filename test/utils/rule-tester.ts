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
export function runRuleTester(...args: Parameters<RuleTester['run']>) {
  const config = {
    parserOptions: {
      ecmaVersion: 2018,
    },
  };

  return new RuleTester(config).run(...args);
}

export const test = (input: string) => `test('test', async () => { ${input} })`;
