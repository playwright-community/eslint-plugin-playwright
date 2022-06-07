
const { isCallExpression, isDescribeCall } = require('../utils/ast');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const { options } = context;
    const defaultOptions = { max: 5 };
    const { max } = options[0] || defaultOptions;
    const describeCallbackStack = [];

    function pushDescribeCallback(node) {
      const { parent } = node;

      if(!isCallExpression(parent) || !isDescribeCall(parent)) {
        return;
      }

      describeCallbackStack.push(0);

      if (describeCallbackStack.length > max) {
        context.report({
          node: parent,
          messageId: 'exceededMaxDepth',
          data: { depth: describeCallbackStack.length, max },
        });
    }
    }

    function popDescribeCallback(node) {
      const { parent } = node;

      if (isCallExpression(parent) && isDescribeCall(parent)) {
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
      exceededMaxDepth: 'Maximum describe call depth exceeded ({{ depth }}). Maximum allowed is {{ max }}.',
    },
    type: 'suggestion',
    fixable: 'code',
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
};
