import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { isExpectCall } from '../utils/ast';
import { getAmountData } from '../utils/misc';
import { parseExpectCall } from '../utils/parseExpectCall';
import { NodeWithParent } from '../utils/types';

function isMatcherCalled(node: NodeWithParent): {
  called: boolean;
  node: ESTree.Node;
} {
  if (node.parent.type !== 'MemberExpression') {
    // Just asserting that the parent is a call expression is not enough as
    // the node could be an argument of a call expression which doesn't
    // determine if it is called. To determine if it is called, we verify
    // that the parent call expression callee is the same as the node.
    return {
      called:
        node.parent.type === 'CallExpression' && node.parent.callee === node,
      node,
    };
  }

  // If the parent is a member expression, we continue traversing upward to
  // handle matcher chains of unknown length. e.g. expect().not.something.
  return isMatcherCalled(node.parent);
}

export default {
  create(context) {
    const options = {
      maxArgs: 2,
      minArgs: 1,
      ...((context.options?.[0] as Record<string, unknown>) ?? {}),
    };

    const minArgs = Math.min(options.minArgs, options.maxArgs);
    const maxArgs = Math.max(options.minArgs, options.maxArgs);

    return {
      CallExpression(node) {
        if (!isExpectCall(node)) return;

        const expectCall = parseExpectCall(node);
        if (!expectCall) {
          context.report({ messageId: 'matcherNotFound', node });
        } else {
          const result = isMatcherCalled(node);

          if (!result.called) {
            context.report({
              messageId: 'matcherNotCalled',
              node:
                result.node.type === 'MemberExpression'
                  ? result.node.property
                  : result.node,
            });
          }
        }

        if (node.arguments.length < minArgs) {
          context.report({
            data: getAmountData(minArgs),
            messageId: 'notEnoughArgs',
            node,
          });
        }

        if (node.arguments.length > maxArgs) {
          context.report({
            data: getAmountData(maxArgs),
            messageId: 'tooManyArgs',
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Enforce valid `expect()` usage',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/valid-expect.md',
    },
    messages: {
      matcherNotCalled: 'Matchers must be called to assert.',
      matcherNotFound: 'Expect must have a corresponding matcher call.',
      notEnoughArgs: 'Expect requires at least {{amount}} argument{{s}}.',
      tooManyArgs: 'Expect takes at most {{amount}} argument{{s}}.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          maxArgs: {
            minimum: 1,
            type: 'number',
          },
          minArgs: {
            minimum: 1,
            type: 'number',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
} as Rule.RuleModule;
