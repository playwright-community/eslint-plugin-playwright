const {
  isTestIdentifier,
  isDescribeCall,
  isHookCall,
} = require('../utils/ast');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    let inTestCase = false;

    function maybeReportConditional(node) {
      if (inTestCase) {
        context.report({
          messageId: 'conditionalInTest',
          node,
        });
      }
    }

    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          isTestIdentifier(callee) &&
          !isDescribeCall(node) &&
          !isHookCall(node)
        ) {
          inTestCase = true;
        }
      },
      'CallExpression:exit'(node) {
        const { callee } = node;
        if (
          isTestIdentifier(callee) &&
          !isDescribeCall(node) &&
          !isHookCall(node)
        ) {
          inTestCase = false;
        }
      },
      IfStatement: maybeReportConditional,
      SwitchStatement: maybeReportConditional,
      ConditionalExpression: maybeReportConditional,
      LogicalExpression: maybeReportConditional,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow conditional logic in tests',
      recommended: false,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright#no-conditional-in-test',
    },
    messages: {
      conditionalInTest: 'Avoid having conditionals in tests',
    },
    type: 'problem',
    schema: [],
  },
};
