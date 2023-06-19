import { Rule } from 'eslint';
import { isStepCall } from '../utils/ast';

export default {
  create(context) {
    const max: number = 1;
    const stepCallbackStack: number[] = [];

    function pushStepCallback(node: Rule.Node) {
      if (node.parent.type !== 'CallExpression' || !isStepCall(node.parent)) {
        return;
      }

      stepCallbackStack.push(0);

      if (stepCallbackStack.length > max) {
        context.report({
          node: node.parent.callee,
          messageId: 'noNestedStep',
          data: {
            depth: stepCallbackStack.length.toString(),
            max: max.toString(),
          },
        });
      }
    }

    function popStepCallback(node: Rule.Node) {
      const { parent } = node;

      if (parent.type === 'CallExpression' && isStepCall(parent)) {
        stepCallbackStack.pop();
      }
    }

    return {
      FunctionExpression: pushStepCallback,
      'FunctionExpression:exit': popStepCallback,
      ArrowFunctionExpression: pushStepCallback,
      'ArrowFunctionExpression:exit': popStepCallback,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow nested `test.step()` methods',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-nested-step.md',
    },
    messages: {
      noNestedStep: 'Do not nest `test.step()` methods.',
    },
    type: 'problem',
    schema: [],
  },
} as Rule.RuleModule;
