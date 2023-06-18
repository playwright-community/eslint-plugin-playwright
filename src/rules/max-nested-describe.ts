import { Rule } from 'eslint';
import { isDescribeCall } from '../utils/ast';

export default {
  create(context) {
    const { options } = context;
    const max: number = options[0]?.max ?? 5;
    const describeCallbackStack: number[] = [];

    function pushDescribeCallback(node: Rule.Node) {
      if (
        node.parent.type !== 'CallExpression' ||
        !isDescribeCall(node.parent)
      ) {
        return;
      }

      describeCallbackStack.push(0);

      if (describeCallbackStack.length > max) {
        context.report({
          data: {
            depth: describeCallbackStack.length.toString(),
            max: max.toString(),
          },
          messageId: 'exceededMaxDepth',
          node: node.parent.callee,
        });
      }
    }

    function popDescribeCallback(node: Rule.Node) {
      const { parent } = node;

      if (parent.type === 'CallExpression' && isDescribeCall(parent)) {
        describeCallbackStack.pop();
      }
    }

    return {
      ArrowFunctionExpression: pushDescribeCallback,
      'ArrowFunctionExpression:exit': popDescribeCallback,
      FunctionExpression: pushDescribeCallback,
      'FunctionExpression:exit': popDescribeCallback,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforces a maximum depth to nested describe calls',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/max-nested-describe.md',
    },
    messages: {
      exceededMaxDepth:
        'Maximum describe call depth exceeded ({{ depth }}). Maximum allowed is {{ max }}.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          max: {
            minimum: 0,
            type: 'integer',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
} as Rule.RuleModule;
