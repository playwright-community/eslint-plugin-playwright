import { Rule } from 'eslint';
import { isIdentifier } from '../utils/ast';
import { NodeWithParent } from '../utils/types';

function isMatcherFound(node: NodeWithParent): boolean {
  if (node.parent.type !== 'MemberExpression') {
    return false;
  }

  return !(
    isIdentifier(node.parent.property, 'not') &&
    node.parent.parent.type !== 'MemberExpression'
  );
}

function isMatcherCalled(node: NodeWithParent): boolean {
  return node.parent.type === 'MemberExpression'
    ? // If the parent is a member expression, we continue traversing upward to
      // handle matcher chains of unknown length. e.g. expect().not.something.
      isMatcherCalled(node.parent)
    : // Just asserting that the parent is a call expression is not enough as
      // the node could be an argument of a call expression which doesn't
      // determine if it is called. To determine if it is called, we verify
      // that the parent call expression callee is the same as the node.
      node.parent.type === 'CallExpression' && node.parent.callee === node;
}

const getAmountData = (amount: number) => ({
  amount: amount.toString(),
  s: amount === 1 ? '' : 's',
});

export default {
  create(context) {
    const options = {
      minArgs: 1,
      maxArgs: 2,
      ...((context.options?.[0] as {}) ?? {}),
    };

    const minArgs = Math.min(options.minArgs, options.maxArgs);
    const maxArgs = Math.max(options.minArgs, options.maxArgs);

    return {
      CallExpression(node) {
        if (!isIdentifier(node.callee, 'expect')) {
          return;
        }

        if (!isMatcherFound(node)) {
          context.report({ node, messageId: 'matcherNotFound' });
        } else if (!isMatcherCalled(node)) {
          context.report({ node, messageId: 'matcherNotCalled' });
        }

        if (node.arguments.length < minArgs) {
          context.report({
            messageId: 'notEnoughArgs',
            data: getAmountData(minArgs),
            node,
          });
        }

        if (node.arguments.length > maxArgs) {
          context.report({
            messageId: 'tooManyArgs',
            data: getAmountData(maxArgs),
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
      tooManyArgs: 'Expect takes at most {{amount}} argument{{s}}.',
      notEnoughArgs: 'Expect requires at least {{amount}} argument{{s}}.',
      matcherNotFound: 'Expect must have a corresponding matcher call.',
      matcherNotCalled: 'Matchers must be called to assert.',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          minArgs: {
            type: 'number',
            minimum: 1,
          },
          maxArgs: {
            type: 'number',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },
} as Rule.RuleModule;
