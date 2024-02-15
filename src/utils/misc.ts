import { Rule } from 'eslint';

export const getAmountData = (amount: number) => ({
  amount: amount.toString(),
  s: amount === 1 ? '' : 's',
});

export function getSourceCode(context: Rule.RuleContext) {
  return context.sourceCode ?? context.getSourceCode();
}
