import { Rule } from 'eslint';
import * as ESTree from 'estree';
import { getTestNames } from '../utils/ast';

function hasTests(context: Rule.RuleContext, node: ESTree.Comment) {
  const testNames = getTestNames(context);
  const names = testNames.join('|');
  const regex = new RegExp(
    `^\\s*(${names}|describe)(\\.\\w+|\\[['"]\\w+['"]\\])?\\s*\\(`,
    'mu',
  );
  return regex.test(node.value);
}

export default {
  create(context) {
    function checkNode(node: ESTree.Comment) {
      if (!hasTests(context, node)) return;

      context.report({
        messageId: 'commentedTests',
        node: node as unknown as ESTree.Node,
      });
    }

    return {
      Program() {
        context.sourceCode.getAllComments().forEach(checkNode);
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow commented out tests',
      recommended: true,
      url: 'https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules/no-commented-out-tests.md',
    },
    messages: {
      commentedTests: 'Some tests seem to be commented',
    },
    type: 'problem',
  },
} as Rule.RuleModule;
