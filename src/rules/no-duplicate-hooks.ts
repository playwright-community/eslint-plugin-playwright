import { Rule } from 'eslint';
import { getStringValue, isDescribeCall, isTestHook } from '../utils/ast';

export default {
  create(context) {
    const hookContexts: Array<Record<string, number>> = [{}];

    return {
      CallExpression(node) {
        if (isDescribeCall(node)) {
          hookContexts.push({});
        }

        if (!isTestHook(context, node)) {
          return;
        }

        const currentLayer = hookContexts[hookContexts.length - 1];
        const name =
          node.callee.type === 'MemberExpression'
            ? getStringValue(node.callee.property)
            : '';

        currentLayer[name] ||= 0;
        currentLayer[name] += 1;

        if (currentLayer[name] > 1) {
          context.report({
            data: { hook: name },
            messageId: 'noDuplicateHook',
            node,
          });
        }
      },
      'CallExpression:exit'(node) {
        if (isDescribeCall(node)) {
          hookContexts.pop();
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow duplicate setup and teardown hooks',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-duplicate-hooks.md',
    },
    messages: {
      noDuplicateHook: 'Duplicate {{ hook }} in describe block',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
