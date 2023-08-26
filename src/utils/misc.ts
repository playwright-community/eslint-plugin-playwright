import { Rule } from 'eslint';

import { Settings } from './types';

export const getAmountData = (amount: number) => ({
  amount: amount.toString(),
  s: amount === 1 ? '' : 's',
});

interface AssertFunctionNamesOptions {
  additionalAssertFunctionNames?: string[];
}

export function getAdditionalAssertFunctionNames(
  context: Rule.RuleContext
): string[] {
  const globalSettings =
    (context.settings as Settings).playwright?.additionalAssertFunctionNames ??
    ([] as string[]);
  const ruleSettings =
    (context.options[0] as AssertFunctionNamesOptions | undefined)
      ?.additionalAssertFunctionNames ?? ([] as string[]);

  return [...globalSettings, ...ruleSettings];
}
