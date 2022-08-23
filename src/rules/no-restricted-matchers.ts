import { Rule } from 'eslint';
import { getNodeName, isExpectCall } from '../utils/ast';
import * as ESTree from 'estree';
import { NodeWithParent } from '../utils/types';

function getMatchers(
  node: NodeWithParent,
  chain: ESTree.Node[] = []
): ESTree.Node[] {
  if (node.parent.type === 'MemberExpression' && node.parent.object === node) {
    return getMatchers(node.parent, [...chain, node.parent.property]);
  }

  return chain;
}

export default {
  create(context) {
    const restrictedChains = (context.options?.[0] ?? {}) as {
      [key: string]: string | null;
    };

    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const matchers = getMatchers(node);
        const permutations = matchers.map((_, i) => matchers.slice(0, i + 1));

        for (const permutation of permutations) {
          const chain = permutation.map(getNodeName).join('.');

          if (chain in restrictedChains) {
            const message = restrictedChains[chain];

            context.report({
              messageId: message ? 'restrictedWithMessage' : 'restricted',
              data: { message: message ?? '', chain },
              loc: {
                start: permutation[0].loc!.start,
                end: permutation[permutation.length - 1].loc!.end,
              },
            });

            break;
          }
        }
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
      restricted: 'Use of `{{chain}}` is disallowed',
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
