import { Rule } from 'eslint';
import { getStringValue } from '../utils/ast';
import { parseExpectCall } from '../utils/parseExpectCall';

export default {
  create(context) {
    const restrictedChains = (context.options?.[0] ?? {}) as {
      [key: string]: string | null;
    };

    return {
      CallExpression(node) {
        const expectCall = parseExpectCall(node);
        if (!expectCall) return;

        Object.entries(restrictedChains)
          .map(([restriction, message]) => {
            const chain = expectCall.members;
            const restrictionLinks = restriction.split('.').length;

            // Find in the full chain, where the restriction chain starts
            const startIndex = chain.findIndex((_, i) => {
              // Construct the partial chain to compare against the restriction
              // chain string.
              const partial = chain
                .slice(i, i + restrictionLinks)
                .map(getStringValue)
                .join('.');

              return partial === restriction;
            });

            return {
              // If the restriction chain was found, return the portion of the
              // chain that matches the restriction chain.
              chain:
                startIndex !== -1
                  ? chain.slice(startIndex, startIndex + restrictionLinks)
                  : [],
              restriction,
              message,
            };
          })
          .filter(({ chain }) => chain.length)
          .forEach(({ chain, restriction, message }) => {
            context.report({
              messageId: message ? 'restrictedWithMessage' : 'restricted',
              data: { message: message ?? '', restriction },
              loc: {
                start: chain[0].loc!.start,
                end: chain[chain.length - 1].loc!.end,
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
