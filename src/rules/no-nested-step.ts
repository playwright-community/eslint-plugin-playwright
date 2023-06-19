import { Rule } from 'eslint';
import { isStepCall } from '../utils/ast';

export default {
  create(context) {
    const max = 1;
    const stepCallbackStack: number[] = [];

    function pushStepCallback(node: Rule.Node) {
      if (node.parent.type !== 'CallExpression' || !isStepCall(node.parent)) {
        return;
      }

      stepCallbackStack.push(0);

      if (stepCallbackStack.length > max) {
        context.report({
          data: {
            depth: stepCallbackStack.length.toString(),
            max: max.toString(),
          },
          messageId: 'noNestedStep',
          node: node.parent.callee,
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
      ArrowFunctionExpression: pushStepCallback,
      'ArrowFunctionExpression:exit': popStepCallback,
      FunctionExpression: pushStepCallback,
      'FunctionExpression:exit': popStepCallback,
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
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule;
