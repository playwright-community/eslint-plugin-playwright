import { Rule } from 'eslint';
import { getStringValue, isTestHook } from '../utils/ast';

const HooksOrder = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];

export default {
  create(context) {
    let previousHookIndex = -1;
    let inHook = false;

    return {
      CallExpression(node) {
        // Ignore everything that is passed into a hook
        if (inHook) return;

        // Reset the previousHookIndex when encountering something different from a hook
        if (!isTestHook(context, node)) {
          previousHookIndex = -1;
          return;
        }

        inHook = true;
        const currentHook =
          node.callee.type === 'MemberExpression'
            ? getStringValue(node.callee.property)
            : '';
        const currentHookIndex = HooksOrder.indexOf(currentHook);

        if (currentHookIndex < previousHookIndex) {
          return context.report({
            data: {
              currentHook,
              previousHook: HooksOrder[previousHookIndex],
            },
            messageId: 'reorderHooks',
            node,
          });
        }

        previousHookIndex = currentHookIndex;
      },
      'CallExpression:exit'(node) {
        if (isTestHook(context, node)) {
          inHook = false;
          return;
        }

        if (inHook) {
          return;
        }

        // Reset the previousHookIndex when encountering something different from a hook
        previousHookIndex = -1;
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer having hooks in a consistent order',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-hooks-in-order.md',
    },
    messages: {
      reorderHooks:
        '`{{ currentHook }}` hooks should be before any `{{ previousHook }}` hooks',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
