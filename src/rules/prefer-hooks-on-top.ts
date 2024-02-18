import { Rule } from 'eslint';
import { isTestCall, isTestHook } from '../utils/ast';

export default {
  create(context) {
    const stack = [false];

    return {
      CallExpression(node) {
        if (isTestCall(context, node)) {
          stack[stack.length - 1] = true;
        }

        if (stack.at(-1) && isTestHook(context, node)) {
          context.report({
            messageId: 'noHookOnTop',
            node,
          });
        }

        stack.push(false);
      },
      'CallExpression:exit'() {
        stack.pop();
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest having hooks before any test cases',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/prefer-hooks-on-top.md',
    },
    messages: {
      noHookOnTop: 'Hooks should come before test cases',
    },
    type: 'suggestion',
  },
} as Rule.RuleModule;
