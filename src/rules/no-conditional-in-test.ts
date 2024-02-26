import { Rule } from 'eslint';
import { findParent, getStringValue } from '../utils/ast';
import { parseFnCall } from '../utils/parseFnCall';

export default {
  create(context) {
    function checkConditional(node: Rule.Node & Rule.NodeParentExtension) {
      const call = findParent(node, 'CallExpression');
      if (!call) return;

      const fnCall = parseFnCall(context, call);

      // Allow conditional logic in `test.skip()` calls inside of tests
      // https://playwright.dev/docs/api/class-test#test-skip-3
      if (
        fnCall?.type === 'test' &&
        fnCall.members.some((member) => getStringValue(member) === 'skip') &&
        call.arguments[0]?.type === 'LogicalExpression'
      ) {
        return;
      }

      if (fnCall?.type === 'test' || fnCall?.type === 'step') {
        context.report({ messageId: 'conditionalInTest', node });
      }
    }

    return {
      ConditionalExpression: checkConditional,
      IfStatement: checkConditional,
      LogicalExpression: checkConditional,
      SwitchStatement: checkConditional,
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
    schema: [],
    type: 'problem',
  },
} as Rule.RuleModule;
