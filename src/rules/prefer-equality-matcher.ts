import { Rule } from 'eslint';
import {
  equalityMatchers,
  getParent,
  getRawValue,
  getStringValue,
  isBooleanLiteral,
} from '../utils/ast';
import { parseExpectCall } from '../utils/parseExpectCall';

export default {
  create(context) {
    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(context, node);
        if (!expectCall || expectCall.args.length === 0) return;

        const { args, matcher } = expectCall;
        const [comparison] = node.arguments;
        const expectCallEnd = node.range![1];
        const [matcherArg] = args;

        if (
          comparison?.type !== 'BinaryExpression' ||
          (comparison.operator !== '===' && comparison.operator !== '!==') ||
          !equalityMatchers.has(getStringValue(matcher)) ||
          !isBooleanLiteral(matcherArg)
        ) {
          return;
        }

        const matcherValue = getRawValue(matcherArg) === 'true';
        const [modifier] = expectCall.modifiers;
        const hasNot = expectCall.modifiers.some(
          (node) => getStringValue(node) === 'not',
        );

        // we need to negate the expectation if the current expected
        // value is itself negated by the "not" modifier
        const addNotModifier =
          (comparison.operator === '!==' ? !matcherValue : matcherValue) ===
          hasNot;

        context.report({
          messageId: 'useEqualityMatcher',
          node: matcher,
          suggest: [...equalityMatchers.keys()].map((equalityMatcher) => ({
            data: { matcher: equalityMatcher },
            fix(fixer) {
              // preserve the existing modifier if it's not a negation
              let modifierText =
                modifier && getStringValue(modifier) !== 'not'
                  ? `.${getStringValue(modifier)}`
                  : '';

              if (addNotModifier) {
                modifierText += `.not`;
              }

              return [
                // replace the comparison argument with the left-hand side of the comparison
                fixer.replaceText(
                  comparison,
                  context.sourceCode.getText(comparison.left),
                ),
                // replace the current matcher & modifier with the preferred matcher
                fixer.replaceTextRange(
                  [expectCallEnd, getParent(matcher)!.range![1]],
                  `${modifierText}.${equalityMatcher}`,
                ),
                // replace the matcher argument with the right-hand side of the comparison
                fixer.replaceText(
                  matcherArg,
                  context.sourceCode.getText(comparison.right),
                ),
              ];
            },
            messageId: 'suggestEqualityMatcher',
          })),
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using the built-in equality matchers',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-equality-matcher.md',
    },
    hasSuggestions: true,
    messages: {
      suggestEqualityMatcher: 'Use `{{ matcher }}`',
      useEqualityMatcher: 'Prefer using one of the equality matchers instead',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
