import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  getMatchers,
  getStringValue,
  isBooleanLiteral,
  isExpectCall,
} from '../utils/ast';

type MethodConfig = {
  type: 'string' | 'boolean';
  matcher: string;
  inverse?: string;
};

const methods: Record<string, MethodConfig> = {
  innerText: { type: 'string', matcher: 'toHaveText' },
  textContent: { type: 'string', matcher: 'toHaveText' },
  inputValue: { type: 'string', matcher: 'toHaveValue' },
  isEditable: { type: 'boolean', matcher: 'toBeEditable' },
  isChecked: { type: 'boolean', matcher: 'toBeChecked' },
  isDisabled: {
    type: 'boolean',
    matcher: 'toBeDisabled',
    inverse: 'toBeEnabled',
  },
  isEnabled: {
    type: 'boolean',
    matcher: 'toBeEnabled',
    inverse: 'toBeDisabled',
  },
  isHidden: {
    type: 'boolean',
    matcher: 'toBeHidden',
    inverse: 'toBeVisible',
  },
  isVisible: {
    type: 'boolean',
    matcher: 'toBeVisible',
    inverse: 'toBeHidden',
  },
};

const supportedMatchers = new Set([
  'toBe',
  'toEqual',
  'toBeTruthy',
  'toBeFalsy',
]);

export function getMatcherCall(node: ESTree.Node) {
  const grandparent = (node as any).parent?.parent as ESTree.Node;
  return grandparent.type === 'CallExpression' ? grandparent : undefined;
}

export default {
  create(context) {
    return {
      CallExpression(node) {
        if (!isExpectCall(node)) return;

        const [arg] = node.arguments;
        if (
          arg.type !== 'AwaitExpression' ||
          arg.argument.type !== 'CallExpression' ||
          arg.argument.callee.type !== 'MemberExpression'
        ) {
          return;
        }

        // Matcher must be supported
        const matcherChain = getMatchers(node);
        const matcher = matcherChain[matcherChain.length - 1];
        const matcherName = getStringValue(matcher);
        if (!supportedMatchers.has(matcherName)) return;

        // Playwright method must be supported
        const method = getStringValue(arg.argument.callee.property);
        const methodConfig = methods[method];
        if (!methodConfig) return;

        const { callee } = arg.argument;
        context.report({
          messageId: 'useWebFirstAssertion',
          suggest: [
            {
              messageId: 'suggestWebFirstAssertion',
              fix: (fixer) => {
                const matcherCall = getMatcherCall(matcher);

                const fixes = [
                  // Add await to the expect call
                  fixer.insertTextBefore(node, 'await '),
                  // Remove the await keyword
                  fixer.replaceTextRange(
                    [arg.range![0], arg.argument.range![0]],
                    ''
                  ),
                  // Remove the instance method
                  fixer.replaceTextRange(
                    [
                      callee.property.range![0] - 1,
                      callee.property.range![1] + 2,
                    ],
                    ''
                  ),
                ];

                // Change the matcher
                const lastMatcher = matcherChain[matcherChain.length - 1];
                const isNot = getStringValue(matcherChain[0]) === 'not';
                const isFalsy =
                  methodConfig.type === 'boolean' &&
                  !!matcherCall?.arguments.length &&
                  isBooleanLiteral(matcherCall.arguments[0], false);

                const isInverse = methodConfig.inverse
                  ? isNot || isFalsy
                  : isNot && isFalsy;

                // Remove not from matcher chain if no longer needed
                if (isInverse && isNot) {
                  const notRange = matcherChain[0].range!;
                  fixes.push(fixer.removeRange([notRange[0], notRange[1] + 1]));
                }

                // Add not to the matcher chain if no inverse matcher exists
                if (!methodConfig.inverse && !isNot && isFalsy) {
                  fixes.push(fixer.insertTextBefore(matcher, 'not.'));
                }

                // Replace the old matcher with the new matcher. The inverse
                // matcher should only be used if the old statement was not a
                // double negation.
                const newMatcher =
                  (+isNot ^ +isFalsy && methodConfig.inverse) ||
                  methodConfig.matcher;
                fixes.push(fixer.replaceText(lastMatcher, newMatcher));

                // Remove boolean argument if it exists
                const [matcherArg] = matcherCall?.arguments ?? [];
                if (matcherArg && isBooleanLiteral(matcherArg)) {
                  fixes.push(fixer.remove(matcherArg));
                }

                return fixes;
              },
            },
          ],
          node,
        });
      },

      // const matchers = getMatchers(node);
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer web first assertions',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-web-first-assertions.md',
    },
    hasSuggestions: true,
    messages: {
      useWebFirstAssertion: 'Prefer web first assertions.',
      suggestWebFirstAssertion: 'Replace {{method}} with {{matcher}}.',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
