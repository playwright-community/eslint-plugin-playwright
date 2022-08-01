import { Rule } from 'eslint';
import * as ESTree from 'estree';
import {
  isTestIdentifier,
  isDescribeCall,
  isCalleeProperty,
} from '../utils/ast';

function isHookCall(node: ESTree.CallExpression) {
  const hooks = ['beforeAll', 'beforeEach', 'afterAll', 'afterEach'];
  return hooks.some((hook) => isCalleeProperty(node, hook));
}

export default {
  create(context) {
    let inTestCase = false;

    function maybeReportConditional(node: Rule.Node) {
      if (inTestCase) {
        context.report({
          messageId: 'conditionalInTest',
          node,
        });
      }
    }

    return {
      CallExpression(node) {
        if (
          isTestIdentifier(node.callee) &&
          !isDescribeCall(node) &&
          !isHookCall(node)
        ) {
          inTestCase = true;
        }
      },
      'CallExpression:exit'(node: ESTree.CallExpression) {
        if (
          isTestIdentifier(node.callee) &&
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
} as Rule.RuleModule;
