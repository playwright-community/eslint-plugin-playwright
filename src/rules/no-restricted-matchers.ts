import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';
import { parseExpectCall } from '../utils/parseExpectCall';

// To properly test matcher chains, we ensure the entire chain is surrounded by
// periods so that the `includes` matcher doesn't match substrings. For example,
// `not` should only match `expect().not.something()` but it should not match
// `expect().nothing()`.
const wrap = (chain: string) => `.${chain}.`;

export default {
  create(context) {
    const restrictedChains = (context.options?.[0] ?? {}) as {
      [key: string]: string | null;
    };

    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(node);
        if (!expectCall) return;

        // Stringify the expect call chain to compare to the list of restricted
        // matcher chains.
        const chain = expectCall.members.map(getStringValue).join('.');

        Object.entries(restrictedChains)
          .filter(([restriction]) => wrap(chain).includes(wrap(restriction)))
          .forEach(([restriction, message]) => {
            context.report({
              messageId: message ? 'restrictedWithMessage' : 'restricted',
              data: { message: message ?? '', restriction },
              loc: {
                start: expectCall.members[0].loc!.start,
                end: expectCall.members[expectCall.members.length - 1].loc!.end,
              },
            });
          });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow specific matchers & modifiers',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-restricted-matchers.md',
    },
    messages: {
      restricted: 'Use of `{{restriction}}` is disallowed',
      restrictedWithMessage: '{{message}}',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: ['string', 'null'],
        },
      },
    ],
  },
} as Rule.RuleModule;
