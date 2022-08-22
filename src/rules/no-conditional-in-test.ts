import { Rule } from 'eslint';
import { findParent, isTest } from '../utils/ast';

export default {
  create(context) {
    function checkConditional(node: Rule.Node & Rule.NodeParentExtension) {
      const call = findParent(node, 'CallExpression');

      if (call && isTest(call)) {
        context.report({ messageId: 'conditionalInTest', node });
      }
    }

    return {
      IfStatement: checkConditional,
      SwitchStatement: checkConditional,
      ConditionalExpression: checkConditional,
      LogicalExpression: checkConditional,
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow conditional logic in tests',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-conditional-in-test.md',
    },
    messages: {
      conditionalInTest: 'Avoid having conditionals in tests',
    },
    type: 'problem',
    schema: [],
  },
} as Rule.RuleModule;
