import { Rule } from 'eslint';
import * as ESTree from 'estree';
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
          node: node.parent,
          messageId: 'exceededMaxDepth',
          data: {
            depth: describeCallbackStack.length.toString(),
            max: max.toString(),
          },
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
      FunctionExpression: pushDescribeCallback,
      'FunctionExpression:exit': popDescribeCallback,
      ArrowFunctionExpression: pushDescribeCallback,
      'ArrowFunctionExpression:exit': popDescribeCallback,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforces a maximum depth to nested describe calls',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#max-nested-describe',
    },
    messages: {
      exceededMaxDepth:
        'Maximum describe call depth exceeded ({{ depth }}). Maximum allowed is {{ max }}.',
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
