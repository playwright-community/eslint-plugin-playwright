import { Rule } from 'eslint';
import { isStepCall } from '../utils/ast';

export default {
  create(context) {
    const { options } = context;
    const max: number = options[0]?.max ?? 5;
    const stepCallbackStack: number[] = [];

    function pushStepCallback(node: Rule.Node) {
      if (node.parent.type !== 'CallExpression' || !isStepCall(node.parent)) {
        return;
      }

      stepCallbackStack.push(0);

      if (stepCallbackStack.length > max) {
        context.report({
          node: node.parent.callee,
          messageId: 'exceededMaxDepth',
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
      description: 'Enforces a maximum depth to nested step calls',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/max-nested-step.md',
    },
    messages: {
      exceededMaxDepth:
        'Maximum step call depth exceeded ({{ depth }}). Maximum allowed is {{ max }}.',
    },
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
  },
} as Rule.RuleModule;
