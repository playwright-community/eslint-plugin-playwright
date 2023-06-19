import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { isExpectCall, isTest } from '../utils/ast';

export default {
  create(context) {
    const unchecked: ESTree.CallExpression[] = [];

    function checkExpressions(nodes: ESTree.Node[]) {
      for (const node of nodes) {
        const index =
          node.type === 'CallExpression' ? unchecked.indexOf(node) : -1;

        if (index !== -1) {
          unchecked.splice(index, 1);
          break;
        }
      }
    }

    return {
      CallExpression(node) {
        if (isTest(node)) {
          unchecked.push(node);
        } else if (isExpectCall(node)) {
          checkExpressions(context.getAncestors());
        }
      },
      'Program:exit'() {
        unchecked.forEach((node) => {
          context.report({ messageId: 'noAssertions', node });
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce assertion to be made in a test body',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/expect-expect.md',
    },
    messages: {
      noAssertions: 'Test has no assertions',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
